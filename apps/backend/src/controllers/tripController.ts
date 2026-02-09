import { Request, Response } from 'express';
import { PrismaClient, TripStatus } from '@prisma/client';
import { findMatchingRoutes } from '../services/matchingService';

const prisma = new PrismaClient();

export const createTrip = async (req: Request, res: Response) => {
  try {
    const {
      pickupLocation,
      pickupLat,
      pickupLng,
      dropoffLocation,
      dropoffLat,
      dropoffLng,
      luggageDescription,
      luggageWeight,
      luggageDimensions,
      luggageImage,
    } = req.body;

    const trip = await prisma.trip.create({
      data: {
        customerId: req.user!.userId,
        pickupLocation,
        pickupLat,
        pickupLng,
        dropoffLocation,
        dropoffLat,
        dropoffLng,
        luggageDescription,
        luggageWeight,
        luggageDimensions,
        luggageImage,
        status: TripStatus.PENDING,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const matchingRoutes = await findMatchingRoutes(
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      luggageWeight
    );

    res.status(201).json({
      trip,
      potentialMatches: matchingRoutes,
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
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
                phoneNumber: true,
              },
            },
          },
        },
        route: true,
        videos: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        tracking: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (
      trip.customerId !== req.user!.userId &&
      trip.trucker?.userId !== req.user!.userId &&
      req.user!.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Failed to get trip' });
  }
};

export const getUserTrips = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};

    if (req.user!.role === 'CUSTOMER') {
      where.customerId = req.user!.userId;
    } else if (req.user!.role === 'TRUCKER') {
      const truckerProfile = await prisma.truckerProfile.findUnique({
        where: { userId: req.user!.userId },
      });
      where.truckerId = truckerProfile?.id;
    }

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
        route: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Failed to get trips' });
  }
};

export const matchTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { routeId } = req.body;

    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        routeId,
        truckerId: route.truckerId,
        status: TripStatus.MATCHED,
      },
      include: {
        customer: true,
        trucker: {
          include: {
            user: true,
          },
        },
        route: true,
      },
    });

    res.json(updatedTrip);
  } catch (error) {
    console.error('Match trip error:', error);
    res.status(500).json({ error: 'Failed to match trip' });
  }
};

export const updateTripStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const trip = await prisma.trip.update({
      where: { id },
      data: { status },
    });

    res.json(trip);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

export const cancelTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.update({
      where: { id },
      data: { status: TripStatus.CANCELLED },
    });

    res.json(trip);
  } catch (error) {
    console.error('Cancel trip error:', error);
    res.status(500).json({ error: 'Failed to cancel trip' });
  }
};
