import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRating = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const { rating, comment } = req.body;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { trucker: true },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.status !== 'DELIVERED') {
      return res.status(400).json({ error: 'Can only rate completed trips' });
    }

    const existingRating = await prisma.rating.findFirst({
      where: {
        tripId,
        reviewerId: req.user!.userId,
      },
    });

    if (existingRating) {
      return res.status(400).json({ error: 'Already rated this trip' });
    }

    const newRating = await prisma.rating.create({
      data: {
        tripId,
        reviewerId: req.user!.userId,
        rating,
        comment,
      },
    });

    if (req.user!.role === 'CUSTOMER' && trip.trucker) {
      const allRatings = await prisma.rating.findMany({
        where: {
          trip: {
            truckerId: trip.truckerId,
          },
          reviewer: {
            role: 'CUSTOMER',
          },
        },
      });

      const avgRating =
        allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

      await prisma.truckerProfile.update({
        where: { id: trip.truckerId! },
        data: {
          averageRating: avgRating,
          totalTrips: { increment: 1 },
        },
      });
    } else if (req.user!.role === 'TRUCKER') {
      const customerProfile = await prisma.customerProfile.findUnique({
        where: { userId: trip.customerId },
      });

      if (customerProfile) {
        const allRatings = await prisma.rating.findMany({
          where: {
            trip: {
              customerId: trip.customerId,
            },
            reviewer: {
              role: 'TRUCKER',
            },
          },
        });

        const avgRating =
          allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

        await prisma.customerProfile.update({
          where: { id: customerProfile.id },
          data: {
            averageRating: avgRating,
            totalTrips: { increment: 1 },
          },
        });
      }
    }

    res.status(201).json(newRating);
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
};
