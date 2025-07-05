 import { useTheme } from "../contexts/ThemeContext";
import { FaMoon } from "react-icons/fa";
import { AiFillSun } from "react-icons/ai";
import { TbGridDots } from "react-icons/tb";
import { MdOutlineDensitySmall } from "react-icons/md";
import { TfiNotepad } from "react-icons/tfi";

export default function ToolbarRight({
    color,
    onColorChange,
    onDesignChange,
    currentDesign,
}) {
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


            <button title="Page Design" onClick={onDesignChange}>
                {currentDesign === "dotted" ? <TbGridDots />
                    : currentDesign === "ruled" ? <MdOutlineDensitySmall />
                        : <TfiNotepad />
                }
            </button>

            <button onClick={toggleTheme} title="Toggle Theme">
                {theme === "light" ? <FaMoon className="icon moon" /> : <AiFillSun className="icon sun" />}
            </button>

        </div>
    );
}
