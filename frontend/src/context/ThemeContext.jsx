import { createContext, useContext, useState, useEffect } from 'react';

var ThemeContext = createContext();

export function ThemeProvider({ children }) {
  var [theme, setTheme] = useState(function () {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(function () {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(function (prev) { return prev === 'light' ? 'dark' : 'light'; });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
