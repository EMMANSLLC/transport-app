import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRoute = async (req: Request, res: Response) => {
  try {
    const {
      startLocation,
      startLat,
      startLng,
      endLocation,
      endLat,
      endLng,
      availableSpace,
      departureTime,
      estimatedArrival,
    } = req.body;

    const truckerProfile = await prisma.truckerProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!truckerProfile) {
      return res.status(404).json({ error: 'Trucker profile not found' });
    }

    const route = await prisma.route.create({
      data: {
        truckerId: truckerProfile.id,
        startLocation,
        startLat,
        startLng,
        endLocation,
        endLat,
        endLng,
        availableSpace,
        departureTime: new Date(departureTime),
        estimatedArrival: new Date(estimatedArrival),
      },
    });

    res.status(201).json(route);
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ error: 'Failed to create route' });
  }
};

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const truckerProfile = await prisma.truckerProfile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!truckerProfile) {
      return res.status(404).json({ error: 'Trucker profile not found' });
    }

    const routes = await prisma.route.findMany({
      where: {
        truckerId: truckerProfile.id,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(routes);
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ error: 'Failed to get routes' });
  }
};

export const updateRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const route = await prisma.route.update({
      where: { id },
      data: updates,
    });

    res.json(route);
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ error: 'Failed to update route' });
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.route.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
};
