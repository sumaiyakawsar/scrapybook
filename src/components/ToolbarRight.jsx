import "./ToolbarRight.css";
import { useTheme } from "../contexts/ThemeContext";
import { FaMoon } from "react-icons/fa";
import { AiFillSun } from "react-icons/ai";

export default function ToolbarRight({ color, thickness, onColorChange, onDesignChange, currentDesign, onThicknessChange }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="toolbar-right">
            <button title="User">👤</button>
            <input
                type="color"
                className="color-picker"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
            />

            <input
                type="range"
                min="1"
                max="20"
                value={thickness}
                onChange={(e) => onThicknessChange(Number(e.target.value))}
            />

            <button title="Page Design" onClick={onDesignChange}>
                {currentDesign === "dotted" ? "•" : currentDesign === "ruled" ? "▭" : "◻️"}
            </button>

            <button onClick={toggleTheme} title="Toggle Theme">
                {theme === "light" ? <FaMoon className="icon moon" /> : <AiFillSun className="icon sun" />}
            </button>
        </div>
    );
}
