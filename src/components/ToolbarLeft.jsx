import { useScrapbook } from "../contexts/ScrapbookContext";
import { CiEraser } from "react-icons/ci";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoMdImages, IoIosPrint } from "react-icons/io";
import { FaUndo, FaRedo, FaStickyNote, FaPencilAlt } from "react-icons/fa";
import { AiOutlineTable } from "react-icons/ai";
import { MdNoteAdd } from "react-icons/md";


export default function ToolbarLeft({ onAction, clearCanvas }) {

    const { addPage, addStickyNote, addTable, undo, redo, printPage } = useScrapbook();

    return (
        <div className="toolbar-left">
            <button onClick={addPage} title="Add Page"><MdNoteAdd /></button>

            <button onClick={() => onAction("fullscreen")}>
                <BsArrowsFullscreen />
            </button>
            <button onClick={() => onAction("image")}>
                <IoMdImages />
            </button>

            <button onClick={printPage} title="Print Page">
                <IoIosPrint />
            </button>
            <hr />
            <button onClick={() => onAction("pen")}>
                <FaPencilAlt />

            </button>
            <button onClick={addStickyNote}>
                <FaStickyNote className="icon sticky" />
            </button>

            <button onClick={() => onAction("text")}>T</button>
            <button onClick={addTable}>
                <AiOutlineTable />
            </button>

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
