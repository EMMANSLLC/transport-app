import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        truckerProfile: true,
        customerProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phoneNumber, profileImage } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        firstName,
        lastName,
        phoneNumber,
        profileImage,
      },
    });

    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const updateTruckerProfile = async (req: Request, res: Response) => {
  try {
    if (req.user!.role !== 'TRUCKER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const {
      licenseNumber,
      licenseExpiry,
      vehicleType,
      vehiclePlate,
      vehicleCapacity,
      insuranceNumber,
      insuranceExpiry,
    } = req.body;

    const truckerProfile = await prisma.truckerProfile.update({
      where: { userId: req.user!.userId },
      data: {
        licenseNumber,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
        vehicleType,
        vehiclePlate,
        vehicleCapacity,
        insuranceNumber,
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : undefined,
      },
    });

    res.json(truckerProfile);
  } catch (error) {
    console.error('Update trucker profile error:', error);
    res.status(500).json({ error: 'Failed to update trucker profile' });
  }
};
