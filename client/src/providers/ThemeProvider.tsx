import { useState, createContext } from "react";

interface Props {
  children: React.ReactNode,
}

type TDefaultTheme = {
  darkMode: boolean,
  toggleTheme: () => void
}

export const ThemeContext = createContext<TDefaultTheme | null>(null);

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const curTheme = localStorage.getItem('darkMode');
  const [darkMode, setDarkMode] = useState(curTheme ? curTheme === "true" : false);

  const toggleTheme = () => {
    setDarkMode((cur) => {
      localStorage.setItem('darkMode', `${!cur}`);
      return !cur;
    });
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <ThemeContext.Provider value={{darkMode, toggleTheme}}>
          {children}
      </ThemeContext.Provider>
    </div>
  )
};
