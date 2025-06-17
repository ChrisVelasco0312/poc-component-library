import React, { createContext, useContext, useRef, useEffect } from 'react';
import { Theme } from '../Theme';

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate CSS variables from theme
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Generate CSS variables for each color array
    Object.entries(theme.colors).forEach(([colorName, colorArray]) => {
      colorArray.forEach((color, index) => {
        const shade = index * 100; // 0, 100, 200, 300, etc.
        const propertyName = `--color-${colorName}-${shade}`;
        container.style.setProperty(propertyName, color);
      });
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div ref={containerRef} style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}; 