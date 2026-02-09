import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EARTH_RADIUS_KM = 6371;

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export async function findMatchingRoutes(
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number,
  luggageWeight: number,
  maxDistanceKm: number = 50
) {
  const routes = await prisma.route.findMany({
    where: {
      isActive: true,
      availableSpace: {
        gte: luggageWeight,
      },
      departureTime: {
        gte: new Date(),
      },
    },
    include: {
      trucker: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  const matchedRoutes = routes
    .map((route) => {
      const pickupDistance = calculateDistance(
        pickupLat,
        pickupLng,
        route.startLat,
        route.startLng
      );

      const dropoffDistance = calculateDistance(
        dropoffLat,
        dropoffLng,
        route.endLat,
        route.endLng
      );

      const totalDeviation = pickupDistance + dropoffDistance;

      if (totalDeviation <= maxDistanceKm) {
        return {
          route,
          pickupDistance,
          dropoffDistance,
          totalDeviation,
          matchScore: 100 - (totalDeviation / maxDistanceKm) * 100,
        };
      }

      return null;
    })
    .filter((match) => match !== null)
    .sort((a, b) => b!.matchScore - a!.matchScore);

  return matchedRoutes;
}
