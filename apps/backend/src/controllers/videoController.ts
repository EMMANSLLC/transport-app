import { Request, Response } from 'express';
import { PrismaClient, VideoType } from '@prisma/client';
import { uploadToS3 } from '../services/s3Service';

const prisma = new PrismaClient();

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const videoUrl = await uploadToS3(
      req.file.buffer,
      `videos/${tripId}/${type}-${Date.now()}.mp4`,
      req.file.mimetype
    );

    const video = await prisma.video.create({
      data: {
        tripId,
        type: type as VideoType,
        videoUrl,
        uploadedBy: req.user!.userId,
      },
    });

    const allVideos = await prisma.video.findMany({
      where: { tripId },
    });

    const hasPickupTrucker = allVideos.some((v) => v.type === 'PICKUP_TRUCKER');
    const hasPickupCustomer = allVideos.some((v) => v.type === 'PICKUP_CUSTOMER');

    if (hasPickupTrucker && hasPickupCustomer && trip.status === 'MATCHED') {
      await prisma.trip.update({
        where: { id: tripId },
        data: { status: 'IN_TRANSIT', pickupTime: new Date() },
      });
    }

    const hasDropoffTrucker = allVideos.some((v) => v.type === 'DROPOFF_TRUCKER');
    const hasDropoffReceiver = allVideos.some((v) => v.type === 'DROPOFF_RECEIVER');

    if (hasDropoffTrucker && hasDropoffReceiver && trip.status === 'IN_TRANSIT') {
      await prisma.trip.update({
        where: { id: tripId },
        data: {
          status: 'DELIVERED',
          deliveryTime: new Date(),
          escrowReleased: true,
        },
      });
    }

    res.status(201).json(video);
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

export const getVideosByTrip = async (req: Request, res: Response) => {
  try {
    const { tripId } = req.params;

    const videos = await prisma.video.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
    });

    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to get videos' });
  }
};
