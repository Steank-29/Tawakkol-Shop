// Config/auth.js

// JWT Decoding without external library
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (middle part)
    const payload = parts[1];
    // Base64 decode with URL-safe characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    return null;
  }
};

// Get admin data from token or localStorage
export const getAdminData = () => {
  // First try to get from localStorage
  const adminStr = localStorage.getItem('admin');
  if (adminStr) {
    try {
      const adminData = JSON.parse(adminStr);
      if (adminData && adminData._id) {
        return adminData;
      }
    } catch (error) {
      console.error('Error parsing admin data:', error);
    }
  }
  
  // If not in localStorage, decode from token
  const token = getToken();
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) {
      // Merge with any additional admin data we might have
      if (adminStr) {
        try {
          const storedAdmin = JSON.parse(adminStr);
          return { ...decoded, ...storedAdmin };
        } catch (e) {
          return decoded;
        }
      }
      return decoded;
    }
  }
  
  return null;
};

// Your existing functions with improvements
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const admin = localStorage.getItem('admin');
  
  if (!token || !admin) return false;
  
  // Check token expiration
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token expired
      logout();
      return false;
    }
    
    const adminData = JSON.parse(admin);
    return !!(adminData && adminData._id);
  } catch {
    return false;
  }
};

export const getCurrentAdmin = () => {
  return getAdminData();
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  window.location.href = '/login';
};

export const setAuthData = (token, admin) => {
  localStorage.setItem('token', token);
  localStorage.setItem('admin', JSON.stringify(admin));
};

// Check if user has specific role
export const hasRole = (role) => {
  const admin = getCurrentAdmin();
  return admin?.role === role;
};

// Check if user has permission
export const hasPermission = (permission) => {
  const admin = getCurrentAdmin();
  if (!admin) return false;
  
  // Super admin has all permissions
  if (admin.role === 'super-admin') return true;
  
  // Add more permission logic here as needed
  return admin.role === 'admin';
};

// Auth headers for API requests
export const authHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Make authenticated API request
export const authFetch = async (url, options = {}) => {
  const headers = authHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  if (response.status === 401) {
    // Token expired or invalid
    logout();
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

// Validate admin object structure
export const validateAdminData = (adminData) => {
  if (!adminData) return false;
  
  const requiredFields = ['_id', 'email', 'firstName', 'lastName', 'role'];
  for (const field of requiredFields) {
    if (!adminData[field]) return false;
  }
  
  return true;
};

// Get admin initials for avatar
export const getAdminInitials = (admin) => {
  if (!admin) return 'A';
  const firstName = admin.firstName || '';
  const lastName = admin.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'A';
};

// Get admin full name
export const getAdminFullName = (admin) => {
  if (!admin) return 'Admin';
  const firstName = admin.firstName || '';
  const lastName = admin.lastName || '';
  return `${firstName} ${lastName}`.trim() || 'Admin';
};

// Get admin role display name
export const getAdminRoleDisplay = (admin) => {
  if (!admin) return 'Admin';
  const role = admin.role || 'admin';
  return role === 'super-admin' ? 'Super Admin' : 'Admin';
};

// Get admin picture URL
export const getAdminPicture = (admin) => {
  if (!admin) return '';
  
  if (admin.picture?.url && admin.picture.url !== 'https://res.cloudinary.com/dkr41arie/image/upload/v1700000000/default_avatar.png') {
    return admin.picture.url;
  }
  
  return '';
};