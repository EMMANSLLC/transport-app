import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

interface Trip {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  createdAt: string;
  trucker?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchTrips();
  }, [filter]);

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips', {
        params: filter ? { status: filter } : {},
      });
      setTrips(response.data);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'MATCHED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🚚 Trucker Carriage</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Hello, {user?.firstName}
              </span>
              <Link
                to="/profile"
                className="text-primary-600 hover:text-primary-700"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Trips</h2>
          <Link
            to="/create-trip"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            + Create New Trip
          </Link>
        </div>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter('')}
            className={`px-4 py-2 rounded-lg ${
              filter === '' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'PENDING' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('IN_TRANSIT')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'IN_TRANSIT' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            In Transit
          </button>
          <button
            onClick={() => setFilter('DELIVERED')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'DELIVERED' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Delivered
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No trips found</p>
            <Link
              to="/create-trip"
              className="text-primary-600 hover:underline mt-2 inline-block"
            >
              Create your first trip
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                to={`/trip/${trip.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          trip.status
                        )}`}
                      >
                        {trip.status}
                      </span>
                      {trip.trucker && (
                        <span className="text-gray-600 text-sm">
                          Trucker: {trip.trucker.user.firstName} {trip.trucker.user.lastName}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">📍</span>
                        <div>
                          <p className="text-sm text-gray-500">Pickup</p>
                          <p className="text-gray-900 font-medium">{trip.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-600 mr-2">📍</span>
                        <div>
                          <p className="text-sm text-gray-500">Drop-off</p>
                          <p className="text-gray-900 font-medium">{trip.dropoffLocation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
