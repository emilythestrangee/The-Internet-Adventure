import React, { useEffect } from 'react';

interface CountryThemeProps {
  countryName: string;
  children: React.ReactNode;
}

// Define country flag colors
const countryColors: Record<string, { primary: string, secondary: string, accent: string }> = {
  'Egypt': {
    primary: '#E4312B',   // Red
    secondary: '#FFFFFF', // White
    accent: '#000000'     // Black
  },
  'Bahrain': {
    primary: '#CE1126',   // Red
    secondary: '#FFFFFF', // White
    accent: '#FFFFFF'     // White (duplicated for simplicity)
  },
  'India': {
    primary: '#FF9933',   // Saffron
    secondary: '#FFFFFF', // White
    accent: '#138808'     // Green
  },
  'Germany': {
    primary: '#000000',   // Black
    secondary: '#FF0000', // Red
    accent: '#FFCC00'     // Gold
  },
  'Mexico': {
    primary: '#006847',   // Green
    secondary: '#FFFFFF', // White
    accent: '#CE1126'     // Red
  },
  'Brazil': {
    primary: '#009C3B',   // Green
    secondary: '#FFDF00', // Yellow
    accent: '#002776'     // Blue
  },
  'Australia': {
    primary: '#00008B',   // Dark Blue
    secondary: '#FFFFFF', // White
    accent: '#FF0000'     // Red
  },
  'Research Station': {
    primary: '#5089C6',   // Pale Blue (representing ice)
    secondary: '#FFFFFF', // White
    accent: '#0038A8'     // Deep Blue
  }
};

const CountryTheme: React.FC<CountryThemeProps> = ({ countryName, children }) => {
  useEffect(() => {
    // Get country colors
    const colors = countryColors[countryName] || {
      primary: '#0284c7',   // Default blue
      secondary: '#FFFFFF', // White
      accent: '#f97316'     // Orange
    };
    
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--color-primary-600', colors.primary);
    document.documentElement.style.setProperty('--color-secondary-600', colors.secondary);
    document.documentElement.style.setProperty('--color-accent-600', colors.accent);
    
    // Generate lighter and darker shades for primary
    document.documentElement.style.setProperty('--color-primary-100', adjustColor(colors.primary, 80));
    document.documentElement.style.setProperty('--color-primary-500', adjustColor(colors.primary, -10));
    document.documentElement.style.setProperty('--color-primary-700', adjustColor(colors.primary, -20));
    document.documentElement.style.setProperty('--color-primary-800', adjustColor(colors.primary, -30));
    
    // Generate lighter and darker shades for secondary
    document.documentElement.style.setProperty('--color-secondary-100', adjustColor(colors.secondary, 80));
    document.documentElement.style.setProperty('--color-secondary-500', adjustColor(colors.secondary, -10));
    document.documentElement.style.setProperty('--color-secondary-700', adjustColor(colors.secondary, -20));
    document.documentElement.style.setProperty('--color-secondary-800', adjustColor(colors.secondary, -30));
    
    // Generate lighter and darker shades for accent
    document.documentElement.style.setProperty('--color-accent-100', adjustColor(colors.accent, 80));
    document.documentElement.style.setProperty('--color-accent-500', adjustColor(colors.accent, -10));
    document.documentElement.style.setProperty('--color-accent-700', adjustColor(colors.accent, -20));
    document.documentElement.style.setProperty('--color-accent-800', adjustColor(colors.accent, -30));
    
    return () => {
      // Reset to default colors when component unmounts
      const defaultColors = {
        primary: '#0284c7',   // Default blue
        secondary: '#7c3aed', // Default purple
        accent: '#f97316'     // Default orange
      };
      
      document.documentElement.style.setProperty('--color-primary-600', defaultColors.primary);
      document.documentElement.style.setProperty('--color-secondary-600', defaultColors.secondary);
      document.documentElement.style.setProperty('--color-accent-600', defaultColors.accent);
      
      // Reset other shades
      document.documentElement.style.setProperty('--color-primary-100', '#e0f2fe');
      document.documentElement.style.setProperty('--color-primary-500', '#0ea5e9');
      document.documentElement.style.setProperty('--color-primary-700', '#0369a1');
      document.documentElement.style.setProperty('--color-primary-800', '#075985');
      
      document.documentElement.style.setProperty('--color-secondary-100', '#ede9fe');
      document.documentElement.style.setProperty('--color-secondary-500', '#8b5cf6');
      document.documentElement.style.setProperty('--color-secondary-700', '#6d28d9');
      document.documentElement.style.setProperty('--color-secondary-800', '#5b21b6');
      
      document.documentElement.style.setProperty('--color-accent-100', '#ffedd5');
      document.documentElement.style.setProperty('--color-accent-500', '#f97316');
      document.documentElement.style.setProperty('--color-accent-700', '#c2410c');
      document.documentElement.style.setProperty('--color-accent-800', '#9a3412');
    };
  }, [countryName]);
  
  return <>{children}</>;
};

// Helper function to adjust hex color brightness
function adjustColor(color: string, percent: number): string {
  // Convert hex to RGB
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // Adjust brightness
  r = Math.min(255, Math.max(0, r + Math.round(percent / 100 * 255)));
  g = Math.min(255, Math.max(0, g + Math.round(percent / 100 * 255)));
  b = Math.min(255, Math.max(0, b + Math.round(percent / 100 * 255)));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default CountryTheme;