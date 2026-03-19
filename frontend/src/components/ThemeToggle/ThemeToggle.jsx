import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${theme === "dark" ? "theme-toggle--dark" : "theme-toggle--light"}`}
      aria-label="Toggle Themes"
    >
      <div className="theme-toggle__icon-wrapper">
        <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
      </div>
    </button>
  );
};

export default ThemeToggle;
