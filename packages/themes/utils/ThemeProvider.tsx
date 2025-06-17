import React, { createContext, useContext, useEffect } from 'react';
import { Theme } from '../Theme';

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  // Generate CSS variables from theme
  useEffect(() => {
    const root = document.documentElement;
    
    // Generate CSS variables for each color array
    Object.entries(theme.colors).forEach(([colorName, colorArray]) => {
      colorArray.forEach((color, index) => {
        const shade = index * 100; // 0, 100, 200, 300, etc.
        root.style.setProperty(`--color-${colorName}-${shade}`, color);
      });
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}; 