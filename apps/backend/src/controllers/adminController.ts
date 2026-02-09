import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        truckerProfile: true,
        customerProfile: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({ where });

    res.json({
      users: users.map(({ password, ...user }) => user),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const getAllTrips = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        trucker: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        videos: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.trip.count({ where });

    res.json({
      trips,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all trips error:', error);
    res.status(500).json({ error: 'Failed to get trips' });
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTruckers = await prisma.user.count({ where: { role: 'TRUCKER' } });
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    const totalTrips = await prisma.trip.count();
    const pendingTrips = await prisma.trip.count({ where: { status: 'PENDING' } });
    const inTransitTrips = await prisma.trip.count({ where: { status: 'IN_TRANSIT' } });
    const deliveredTrips = await prisma.trip.count({ where: { status: 'DELIVERED' } });
    const disputedTrips = await prisma.trip.count({ where: { status: 'DISPUTED' } });

    const totalRevenue = await prisma.trip.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { price: true },
    });

    res.json({
      users: {
        total: totalUsers,
        truckers: totalTruckers,
        customers: totalCustomers,
      },
      trips: {
        total: totalTrips,
        pending: pendingTrips,
        inTransit: inTransitTrips,
        delivered: deliveredTrips,
        disputed: disputedTrips,
      },
      revenue: {
        total: totalRevenue._sum.price || 0,
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isVerified, isBackgroundChecked } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified,
        isBackgroundChecked,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
};

export const resolveDispute = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const { resolution, newStatus } = req.body;

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        status: newStatus,
      },
    });

    res.json({ trip, resolution });
  } catch (error) {
    console.error('Resolve dispute error:', error);
    res.status(500).json({ error: 'Failed to resolve dispute' });
  }
};
