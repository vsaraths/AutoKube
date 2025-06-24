/**
 * Authentication service for AutoKube
 * Handles user authentication and session management
 */

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Local storage keys
const TOKEN_KEY = 'autokube_token';
const USER_KEY = 'autokube_user';

// Auth service
class AuthService {
  private state: AuthState;
  private listeners: Array<(state: AuthState) => void>;
  
  constructor() {
    this.listeners = [];
    
    // Initialize state from local storage if available
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.state = {
          isAuthenticated: true,
          user,
          token,
        };
      } catch (e) {
        this.state = { ...initialState };
        this.clearStorage();
      }
    } else {
      this.state = { ...initialState };
    }
  }
  
  // Get current auth state
  getState(): AuthState {
    return { ...this.state };
  }
  
  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Notify all listeners of state change
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }
  
  // Update local storage
  private updateStorage(): void {
    if (this.state.token) {
      localStorage.setItem(TOKEN_KEY, this.state.token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    
    if (this.state.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(this.state.user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }
  
  // Clear local storage
  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  
  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      // This would be a real API call in production
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // Simulate API response for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email !== 'admin@autokube.io' && password !== 'password') {
        throw new Error('Invalid credentials');
      }
      
      const user: User = {
        id: '1',
        email: 'admin@autokube.io',
        name: 'Admin User',
        role: 'admin',
        permissions: ['read:all', 'write:all', 'delete:all'],
      };
      
      const token = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
      
      // Update state
      this.state = {
        isAuthenticated: true,
        user,
        token,
      };
      
      // Update storage and notify listeners
      this.updateStorage();
      this.notifyListeners();
      
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
  
  // Logout user
  logout(): void {
    this.state = { ...initialState };
    this.clearStorage();
    this.notifyListeners();
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }
  
  // Get current user
  getUser(): User | null {
    return this.state.user;
  }
  
  // Get auth token
  getToken(): string | null {
    return this.state.token;
  }
  
  // Check if user has permission
  hasPermission(permission: string): boolean {
    return !!this.state.user?.permissions.includes(permission);
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;