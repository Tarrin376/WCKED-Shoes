import { useState, createContext } from "react";

interface Props {
    children: React.ReactNode,
}

type TDefaultTheme = {
    darkMode: boolean,
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const ThemeContext = createContext<TDefaultTheme | null>(null);

export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
            {children}
        </ThemeContext.Provider>
    </div>
  )
};
