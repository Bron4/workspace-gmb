console.log("AuthContext.tsx: FILE LOADED - LATEST VERSION");

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("AuthContext.tsx: AuthProvider component is initializing - LATEST VERSION");

  // Log what's in localStorage RIGHT NOW before any state initialization
  console.log("AuthContext.tsx: BEFORE useState - localStorage tokens:", {
    accessToken: !!localStorage.getItem("accessToken"),
    refreshToken: !!localStorage.getItem("refreshToken")
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    console.log("AuthContext.tsx: useState initializer function called - LATEST VERSION");
    
    // Check what the current logic is doing
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    console.log("AuthContext.tsx: useState initializer - found tokens:", {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken
    });

    // This is likely what the original logic was doing - return true if tokens exist
    const shouldBeAuthenticated = !!(accessToken && refreshToken);
    console.log("AuthContext.tsx: useState initializer - setting isAuthenticated to:", shouldBeAuthenticated);
    
    return shouldBeAuthenticated;
  });

  // Add useEffect to clear tokens and reset auth state - this WILL run
  useEffect(() => {
    console.log("AuthContext.tsx: AuthProvider useEffect - component mounted - LATEST VERSION");
    console.log("AuthContext.tsx: AuthProvider useEffect - current isAuthenticated:", isAuthenticated);
    console.log("AuthContext.tsx: AuthProvider useEffect - current localStorage tokens BEFORE clearing:", {
      accessToken: !!localStorage.getItem("accessToken"),
      refreshToken: !!localStorage.getItem("refreshToken")
    });

    // FORCE CLEAR tokens for testing - this will actually run
    console.log("AuthContext.tsx: useEffect - CLEARING tokens for testing");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    console.log("AuthContext.tsx: AuthProvider useEffect - tokens AFTER clearing:", {
      accessToken: !!localStorage.getItem("accessToken"),
      refreshToken: !!localStorage.getItem("refreshToken")
    });

    // Force set authentication to false
    if (isAuthenticated) {
      console.log("AuthContext.tsx: useEffect - Setting isAuthenticated to false for testing");
      setIsAuthenticated(false);
    }
  }, []); // Empty dependency array so it only runs once on mount

  // Add useEffect to watch for isAuthenticated changes
  useEffect(() => {
    console.log("AuthContext.tsx: isAuthenticated changed to:", isAuthenticated);
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    console.log("AuthContext.tsx: Login attempt for email:", email);
    try {
      const response = await apiLogin(email, password);
      console.log("AuthContext.tsx: Login response received:", response);
      if (response?.refreshToken || response?.accessToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("accessToken", response.accessToken);
        setIsAuthenticated(true);
        console.log("AuthContext.tsx: Login successful - tokens stored, isAuthenticated set to true");
      } else {
        console.error("AuthContext.tsx: Login response missing tokens:", response);
        throw new Error('Login failed - no tokens received');
      }
    } catch (error) {
      console.error("AuthContext.tsx: Login error:", error);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      throw new Error(error?.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string) => {
    console.log("AuthContext.tsx: Register attempt for email:", email);
    try {
      const response = await apiRegister(email, password);
      console.log("AuthContext.tsx: Register response received:", response);
      // Registration doesn't automatically log in the user
      // They need to go to login page after successful registration
    } catch (error) {
      console.error("AuthContext.tsx: Register error:", error);
      throw new Error(error?.message || 'Registration failed');
    }
  };

  const logout = () => {
    console.log("AuthContext.tsx: Logout called");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    console.log("AuthContext.tsx: Logout completed - tokens removed, isAuthenticated set to false");
  };

  console.log("AuthContext.tsx: AuthProvider render - isAuthenticated:", isAuthenticated, "- LATEST VERSION");
  console.log("AuthContext.tsx: AuthProvider render - current localStorage tokens:", {
    accessToken: !!localStorage.getItem("accessToken"),
    refreshToken: !!localStorage.getItem("refreshToken")
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  console.log("AuthContext.tsx: useAuth called - LATEST VERSION");
  const context = useContext(AuthContext);
  if (!context) {
    console.error("AuthContext.tsx: useAuth called outside of AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log("AuthContext.tsx: useAuth returning context with isAuthenticated:", context.isAuthenticated, "- LATEST VERSION");
  return context;
}