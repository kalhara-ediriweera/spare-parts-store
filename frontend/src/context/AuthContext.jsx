import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user details on load
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Register
  const register = async (name, email, password, phone, referralCode) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, referralCode })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Connection failure. Try again.');
      return { success: false, message: 'Connection failure.' };
    }
  };

  // Login
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Connection failure. Try again.');
      return { success: false, message: 'Connection failure.' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setUser(null);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Profile update failed.');
      return { success: false };
    }
  };

  // Add Address
  const addAddress = async (address) => {
    try {
      const res = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address)
      });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, addressBook: data.addressBook }));
        return { success: true };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  };

  // Delete Address
  const deleteAddress = async (id) => {
    try {
      const res = await fetch(`/api/auth/addresses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, addressBook: data.addressBook }));
        return { success: true };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  };

  // Add Saved Vehicle
  const addVehicle = async (vehicle) => {
    try {
      const res = await fetch('/api/auth/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, savedVehicles: data.savedVehicles }));
        return { success: true };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  };

  // Delete Saved Vehicle
  const deleteVehicle = async (id) => {
    try {
      const res = await fetch(`/api/auth/vehicles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUser(prev => ({ ...prev, savedVehicles: data.savedVehicles }));
        return { success: true };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        addVehicle,
        deleteVehicle,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
