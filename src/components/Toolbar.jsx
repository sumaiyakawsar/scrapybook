import { useScrapbook } from "../contexts/ScrapbookContext";
import { FaStickyNote, FaMoon } from "react-icons/fa";


export default function Toolbar({ onAddNote, onAddTable, onExportJSON, onExportImage, onPrint }) {
    const { addPage, currentPageIndex, setCurrentPageIndex, pages } = useScrapbook();





    return (
        <div className="toolbar">

            {/* <button onClick={addPage} title="Add Page">➕</button> */}
            {/* <button
                onClick={() => setCurrentPageIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentPageIndex === 0}
                title="Previous Page"
            >⬅️</button>
            <button
                onClick={() => setCurrentPageIndex((prev) => Math.min(prev + 1, pages.length - 1))}
                disabled={currentPageIndex === pages.length - 1}
                title="Next Page"
            >➡️</button>
            <hr /> */}


            <button title="Draw Tool">✏️</button>

            <button onClick={onAddNote} title="Add Note">
                <FaStickyNote className="icon sticky" />
            </button>
            <button onClick={onAddTable} title="Add Table">📊</button>
            <hr />
            {/* <button onClick={onUndo} title="Undo">↩️</button>
            <button onClick={onRedo} title="Redo">↪️</button> */}
            <hr />
            <button onClick={onExportJSON} title="Export JSON">💾</button>
            <button onClick={onExportImage} title="Export Image">🖼️</button>
            <button onClick={onPrint} title="Print Page">🖨️</button>

        </div>
    );
}

