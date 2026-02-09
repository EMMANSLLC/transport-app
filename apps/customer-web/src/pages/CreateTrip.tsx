import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupLat: 0,
    pickupLng: 0,
    dropoffLocation: '',
    dropoffLat: 0,
    dropoffLng: 0,
    luggageDescription: '',
    luggageWeight: '',
    luggageDimensions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/trips', {
        ...formData,
        luggageWeight: parseFloat(formData.luggageWeight),
      });

      navigate(`/trip/${response.data.trip.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Trip Request
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📍 Pickup Location
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                required
                placeholder="123 Main St, City, State ZIP"
                value={formData.pickupLocation}
                onChange={(e) =>
                  setFormData({ ...formData, pickupLocation: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="40.7128"
                  value={formData.pickupLat || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupLat: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="-74.0060"
                  value={formData.pickupLng || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupLng: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📍 Drop-off Location
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                required
                placeholder="456 Oak Ave, City, State ZIP"
                value={formData.dropoffLocation}
                onChange={(e) =>
                  setFormData({ ...formData, dropoffLocation: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="34.0522"
                  value={formData.dropoffLat || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, dropoffLat: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="-118.2437"
                  value={formData.dropoffLng || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, dropoffLng: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              📦 Luggage Details
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={3}
                placeholder="2 large suitcases, 1 box of electronics"
                value={formData.luggageDescription}
                onChange={(e) =>
                  setFormData({ ...formData, luggageDescription: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="50"
                  value={formData.luggageWeight}
                  onChange={(e) =>
                    setFormData({ ...formData, luggageWeight: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  required
                  placeholder="24x18x12 inches"
                  value={formData.luggageDimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, luggageDimensions: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              ℹ️ <strong>Note:</strong> After submitting, we'll match you with available truckers
              along this route. You'll be able to review trucker profiles before confirming.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating...' : 'Create Trip Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
