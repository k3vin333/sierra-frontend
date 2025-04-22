'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  // Define the schema for the user object the same as the backend
  email: string;
  name: string;
  user_id: string;
}

interface TickerData {
  ticker: string;
  created_at: string;
}

interface AuthContextType {
  // Define the context type for the user object the same as the backend
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  saveTicker: (ticker: string) => Promise<{ success: boolean; message?: string }>;
  getTickers: () => Promise<TickerData[]>;
}

// Define the context for the user object the same as the backend
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // If calling login route is successful, then we set the user state to the user object that
        // is returned from the backend.
        // We also set the token state to the token that is returned from the backend.
        // We also set the token and user in localStorage (cookies).
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
    } finally {
      // Set the loading state to false if the login is successful or not
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, name: string) => {
    try {
      // Once user fills out the register form, we set the loading state to true
      setIsLoading(true);
      const response = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // If calling register route is successful, then we set the user state to the user object that
        // is returned from the backend.
        // We also set the token state to the token that is returned from the backend.
        // We also set the token and user in localStorage (cookies).
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
    } finally {
      // Set the loading state to false if the registration is successful or not
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    // Clear the user and token from localStorage cookies when the user logs out
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // No automatic redirect here
  };
  
  const saveTicker = async (ticker: string) => {
    try {
      if (!token) {
        throw new Error('Authentication required');
      }

      // Try using query parameter token instead of headers
      const response = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/tickers?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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

  /*const getTickers = async (): Promise<TickerData[]> => {
    try {
      if (!token) {
        throw new Error('Authentication required');
      }

      // Try using query parameter token instead of headers
      const response = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/tickers?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data.tickers || [];
      } else {
        throw new Error(data.message || 'Failed to retrieve tickers');
      }
    } catch (error) {
      console.error('Get tickers error:', error);
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  };*/

  const getTickers = async (): Promise<TickerData[]> => {
    return [
      { ticker: "aapl", created_at: "2024-01-01T00:00:00Z" },
      { ticker: "msft", created_at: "2024-01-02T00:00:00Z" },
      { ticker: "dis", created_at: "2024-01-03T00:00:00Z" },
      { ticker: "googl", created_at: "2024-01-04T00:00:00Z" },
    ];
  };
  
  
  
  // Initialize from localStorage if available
  // This is used to check if the user is logged in when the page is loaded
  // Allows user sessions to persists across page reloads OR if the user closes
  // the browser/page and revisits the website
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);
  
  // This authcontext provider is used to provide the current users token
  // user name, and the isAuthenticated status to the entire application
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      isLoading,
      login, 
      register, 
      logout,
      saveTicker,
      getTickers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // useAuth must be used within an AuthProvider
  // AuthProvider is the parent component that wraps the entire application
  // and provides the AuthContext to the entire application
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 