import { createContext, useContext, useState, useEffect, useCallback } from 'react';

var ThemeContext = createContext();

function syncDOM(theme) {
  var root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }) {
  var [theme, setTheme] = useState(function () {
    var stored = localStorage.getItem('theme');
    if (stored !== 'light' && stored !== 'dark') {
      stored = 'light';
      localStorage.setItem('theme', stored);
    }
    syncDOM(stored);
    return stored;
  });

  useEffect(function () {
    syncDOM(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  var toggleTheme = useCallback(function () {
    setTheme(function (prev) {
      var next = prev === 'light' ? 'dark' : 'light';
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
