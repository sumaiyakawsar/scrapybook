import { CiEraser } from "react-icons/ci";
import { useScrapbook } from "../contexts/ScrapbookContext";



export default function DrawingToolbar({ color, thickness, onColorChange, onThicknessChange, clearCanvas }) {

    const { currentPage, updateCurrentPage } = useScrapbook();

    return (
        <div className="drawing-toolbar">
            <div className="group">
                <label>✏️</label>
                <input type="color" 
                value={color} 
                onChange={e => onColorChange(e.target.value)} />
            </div>
            <div className="group">
                <label>⬛</label>
                <input type="range" min="1" max="20" 
                value={thickness} 
                onChange={e => onThicknessChange(Number(e.target.value))} />
            </div>

            <button onClick={clearCanvas}><CiEraser /></button>

            <div className="group">
                <label htmlFor="paper-style">📄</label>
                <select
                    id="paper-style"
                    value={currentPage.design || "plain"}
                    onChange={(e) => updateCurrentPage({ design: e.target.value })}
                >
                    <option value="plain">Plain</option>
                    <option value="dotted">Dotted</option>
                    <option value="ruled">Ruled</option>
                </select>
            </div>
        </div>
    );
}
