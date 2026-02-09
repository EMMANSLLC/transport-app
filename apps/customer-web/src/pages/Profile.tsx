import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-gray-600">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {profile?.role}
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd className="mt-1 text-gray-900">{profile?.phoneNumber || 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-gray-900">
                {new Date(profile?.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
              <dd className="mt-1">
                {profile?.isVerified ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-yellow-600">⚠ Pending Verification</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {profile?.customerProfile && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Statistics
            </h3>
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Average Rating</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">
                  ⭐ {profile.customerProfile.averageRating.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Trips</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">
                  {profile.customerProfile.totalTrips}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
