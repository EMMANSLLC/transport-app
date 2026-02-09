import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import Profile from './pages/Profile';

function App() {
  const { token } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/create-trip" element={token ? <CreateTrip /> : <Navigate to="/login" />} />
      <Route path="/trip/:id" element={token ? <TripDetails /> : <Navigate to="/login" />} />
      <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
