import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data);
    } catch (error) {
      console.error('Failed to fetch trip:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Trip not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-primary-600 hover:text-primary-700"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trip Details</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {trip.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Trip ID</p>
              <p className="text-gray-900 font-mono">{trip.id}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📍 Route
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">●</span>
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="text-gray-900 font-medium">{trip.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <div>
                    <p className="text-sm text-gray-500">Drop-off</p>
                    <p className="text-gray-900 font-medium">{trip.dropoffLocation}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📦 Luggage Information
              </h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Description</dt>
                  <dd className="text-gray-900">{trip.luggageDescription}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Weight</dt>
                  <dd className="text-gray-900">{trip.luggageWeight} lbs</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Dimensions</dt>
                  <dd className="text-gray-900">{trip.luggageDimensions}</dd>
                </div>
              </dl>
            </div>

            {trip.trucker && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🚛 Trucker Information
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">
                      {trip.trucker.user.firstName} {trip.trucker.user.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">{trip.trucker.user.email}</p>
                    <p className="text-gray-600 text-sm">
                      ⭐ {trip.trucker.averageRating.toFixed(1)} ({trip.trucker.totalTrips} trips)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {trip.videos && trip.videos.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🎥 Verification Videos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {trip.videos.map((video: any) => (
                <div key={video.id} className="border rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {video.type.replace(/_/g, ' ')}
                  </p>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm"
                  >
                    View Video
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
