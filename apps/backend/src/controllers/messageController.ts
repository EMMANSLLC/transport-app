import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    const messages = await prisma.message.findMany({
      where: { tripId },
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
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    res.json(message);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};
