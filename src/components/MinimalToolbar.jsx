import { useScrapbook } from "../contexts/ScrapbookContext";
import { useTheme } from "../contexts/ThemeContext";
import { FaMoon } from "react-icons/fa";
import { AiFillSun } from "react-icons/ai";
import { MdNoteAdd } from "react-icons/md";
import logo from "../assets/Scrapybook-icon.png"

export default function MinimalToolbar() {
    const { addPage } = useScrapbook();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`minimal-toolbar ${theme}`}>
            <div className="toolbar-inner">
                <img src={logo} alt="logo" />
                <h1>📔 Your Scrapbook is Empty</h1>
                <p>Start adding creative pages to bring your memories to life!</p>

                <div className="btn__container">
                    <button className="add-button bounce" onClick={addPage}>
                        <MdNoteAdd />
                    </button>

                    <button className="theme-toggle" onClick={toggleTheme}>
                        {theme === "light" ? <FaMoon className="icon moon" /> : <AiFillSun className="icon sun" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
