import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

export function setupSocketHandlers(io: Server) {
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('User connected:', socket.userId);

    socket.on('join-trip', (tripId: string) => {
      socket.join(`trip-${tripId}`);
      console.log(`User ${socket.userId} joined trip ${tripId}`);
    });

    socket.on('leave-trip', (tripId: string) => {
      socket.leave(`trip-${tripId}`);
      console.log(`User ${socket.userId} left trip ${tripId}`);
    });

    socket.on('send-message', async (data: {
      tripId: string;
      content: string;
      mediaUrl?: string;
    }) => {
      try {
        const message = await prisma.message.create({
          data: {
            tripId: data.tripId,
            senderId: socket.userId!,
            content: data.content,
            mediaUrl: data.mediaUrl,
          },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        });

        io.to(`trip-${data.tripId}`).emit('new-message', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('update-location', async (data: {
      tripId: string;
      latitude: number;
      longitude: number;
    }) => {
      try {
        if (socket.role !== 'TRUCKER') {
          return;
        }

        const tracking = await prisma.trackingUpdate.create({
          data: {
            tripId: data.tripId,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        });

        io.to(`trip-${data.tripId}`).emit('location-updated', {
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: tracking.timestamp,
        });
      } catch (error) {
        console.error('Update location error:', error);
      }
    });

    socket.on('typing', (tripId: string) => {
      socket.to(`trip-${tripId}`).emit('user-typing', {
        userId: socket.userId,
      });
    });

    socket.on('stop-typing', (tripId: string) => {
      socket.to(`trip-${tripId}`).emit('user-stop-typing', {
        userId: socket.userId,
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });
}
