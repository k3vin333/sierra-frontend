# SIERRA Investments Authentication System Guide

## Overview

The SIERRA Investments platform uses a token-based authentication system built on JSON Web Tokens (JWT). This document explains how to integrate with the authentication API endpoints deployed in AWS.

## API Endpoints

All authentication endpoints are available at:
```
https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/
```

### Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Register a new user |
| `/auth/login` | POST | Authenticate an existing user |
| `/auth/tickers` | POST | Save a ticker to a user's profile |
| `/auth/init` | GET | Initialize database tables (admin only) |
| `/auth/health` | GET | Check API health status |

## Usage Guide

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "name": "User Name",
    "user_id": "d8e8fca2-dc0f-4b3e-b1b0-51921e2f70d0"
  }
}
```

### 2. User Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "name": "User Name",
    "user_id": "d8e8fca2-dc0f-4b3e-b1b0-51921e2f70d0"
  }
}
```

### 3. Save a Ticker

**Endpoint:** `POST /auth/tickers`

**Headers:**
```
Authorization: Bearer <token_from_login_or_register>
```

**Request Body:**
```json
{
  "ticker": "AAPL"
}
```

**Response:**
```json
{
  "message": "Ticker saved successfully",
  "ticker": "AAPL",
  "timestamp": "2025-04-17T01:23:45.678Z"
}
```

## Frontend Implementation Guide

### 1. Storing Authentication State

After a successful login or registration, store the JWT token and user information in your application state. Consider using:

- React Context API
- Redux
- Local Storage (Note: This is less secure but provides persistence)

Example using React hooks and context:

```jsx
// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  const login = async (email, password) => {
    try {
      const response = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const register = async (email, password, name) => {
    try {
      const response = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  const saveTicker = async (ticker) => {
    try {
      const response = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/tickers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticker })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to save ticker');
      }
    } catch (error) {
      console.error('Save ticker error:', error);
      throw error;
    }
  };
  
  // Initialize from localStorage if available
  React.useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      login, 
      register, 
      logout,
      saveTicker
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 2. Protected Routes

Create a wrapper component for routes that require authentication:

```jsx
// ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
```

### 3. Adding Authentication to Your App

Wrap your app with the AuthProvider:

```jsx
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <Route path="/" exact component={() => <Redirect to="/login" />} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

## Token Expiration and Refresh

The JWT tokens issued by the authentication system are valid for 24 hours. Your frontend should handle token expiration by either:

1. Logging the user out when the token expires
2. Implementing a refresh mechanism (not currently supported by the API)

You can check if a token is expired by decoding it and checking the `exp` claim, which contains the expiration timestamp.

## Security Considerations

1. Always use HTTPS for API calls
2. Never store sensitive information like passwords in local storage
3. The JWT token contains user information, but it's encoded not encrypted - don't store sensitive data in the token
4. Consider implementing a token refresh mechanism for production apps
5. Handle authentication errors appropriately:
   - 401 Unauthorized: Token missing or invalid
   - 403 Forbidden: Valid token but insufficient permissions
   - 500 Server Error: Backend issue

## Troubleshooting

Common issues and solutions:

1. **"Invalid token" error**: The token might be expired or malformed. Try logging in again.
2. **CORS issues**: The API has CORS enabled for all origins. If you encounter CORS issues, check your request formatting.
3. **"User already exists" error**: Try logging in instead of registering.

## Reference Implementation

For a reference implementation, see the sample code in the repository under `frontend/src/auth/`.

---

For additional questions or support, contact the backend team. 