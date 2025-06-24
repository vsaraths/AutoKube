/**
 * Theme service for AutoKube
 * Handles theme management and preferences
 */

type ThemeMode = 'light' | 'dark' | 'system';

// Theme service
class ThemeService {
  private currentTheme: ThemeMode;
  private listeners: Array<(theme: ThemeMode) => void>;
  
  constructor() {
    this.listeners = [];
    
    // Initialize from local storage or default to system
    const savedTheme = localStorage.getItem('autokube_theme') as ThemeMode;
    this.currentTheme = savedTheme || 'system';
    
    // Apply theme on initialization
    this.applyTheme();
    
    // Listen for system preference changes
    this.setupSystemListener();
  }
  
  // Get current theme
  getTheme(): ThemeMode {
    return this.currentTheme;
  }
  
  // Set theme
  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    localStorage.setItem('autokube_theme', theme);
    this.applyTheme();
    this.notifyListeners();
  }
  
  // Subscribe to theme changes
  subscribe(listener: (theme: ThemeMode) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Notify all listeners of theme change
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }
  
  // Apply theme to document
  private applyTheme(): void {
    const isDark = this.shouldUseDarkMode();
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // Determine if dark mode should be used
  private shouldUseDarkMode(): boolean {
    if (this.currentTheme === 'dark') return true;
    if (this.currentTheme === 'light') return false;
    
    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  // Setup listener for system preference changes
  private setupSystemListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (this.currentTheme === 'system') {
        this.applyTheme();
        this.notifyListeners();
      }
    };
    
    // Modern approach
    mediaQuery.addEventListener('change', handleChange);
  }
}

// Create and export singleton instance
const themeService = new ThemeService();
export default themeService;