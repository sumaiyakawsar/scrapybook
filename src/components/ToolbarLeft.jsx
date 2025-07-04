import { useScrapbook } from "../contexts/ScrapbookContext";
import "./ToolbarLeft.css";
import { CiEraser } from "react-icons/ci";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { FaUndo, FaRedo } from "react-icons/fa";

export default function ToolbarLeft({ onAction, clearCanvas }) {

    const { addPage, addStickyNote, addTable, undo, redo } = useScrapbook();

    return (
        <div className="toolbar-left">
            <button onClick={addPage} title="Add Page">➕</button>

            <button onClick={() => onAction("fullscreen")}>
                <BsArrowsFullscreen />
            </button>
            <button onClick={() => onAction("image")}>
                <IoMdImages />
            </button>
            <hr />
            <button onClick={() => onAction("pen")}>✏️</button>
            <button onClick={addStickyNote}>🗒️</button>
            {/* <button onClick={() => onAction("text")}>T</button> */}
            <button onClick={addTable}>📊</button>
            
            <hr />

            <button onClick={undo} title="Undo">
                <FaUndo />
            </button>
            <button onClick={redo} title="Redo">
                <FaRedo />
            </button>
            <button onClick={clearCanvas} title="Clear">
                <CiEraser />
            </button>

        </div>
    );
}
