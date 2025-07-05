import { useState } from "react";
import { useScrapbook } from "../contexts/ScrapbookContext";
import { useDrawing } from "../hooks/useDrawing";
import ToolbarLeft from "./ToolbarLeft";
import ToolbarRight from "./ToolbarRight";
import PageNav from "./PageNav"; 
import ToolbarBottom from "./ToolbarBottom";

export default function Canvas() {
    const {
        data,
        setData,
        pages,
        currentPage,
        updateCurrentPage,
        goToPage, addText,
        setPageDesign,
        currentPageIndex,
    } = useScrapbook();


    const [tool, setTool] = useState("none"); // pen | note | text | table
    const [color, setColor] = useState("#ff0000");
    const [thickness, setThickness] = useState(3);
    const [selectedFontSize, setSelectedFontSize] = useState("16");
    const [fontStyle, setFontStyle] = useState("normal");

    const {
        canvasRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp, clearCanvas,
    } = useDrawing({ color, thickness, tool });



    const pageDesign = currentPage?.design || "dotted";

    const handleToolAction = (action) => {
        switch (action) {
            case "fullscreen":
                document.documentElement.requestFullscreen?.();
                break;
            case "pen":
                setTool("pen");
                break;
            case "image":
                alert("Image upload coming soon!");
                break;
            case "text":
                setTool("text");
                addText(selectedFontSize, color);
                break;
            default:
                break;
        }
    };

    const handleColorChange = (newColor) => {
        setColor(newColor);
    };

    const handleDesignChange = () => {
        const next =
            pageDesign === "dotted" ? "ruled" : pageDesign === "ruled" ? "plain" : "dotted";
        setPageDesign(next);
    };




    const handleDrag = (e, index) => {
        const el = e.currentTarget;
        const offsetX = e.clientX - el.offsetLeft;
        const offsetY = e.clientY - el.offsetTop;

        const move = (ev) => {
            el.style.left = `${ev.clientX - offsetX}px`;
            el.style.top = `${ev.clientY - offsetY}px`;
        };

        const up = (ev) => {
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);

            const updated = [...currentPage.elements];
            updated[index].x = parseInt(el.style.left);
            updated[index].y = parseInt(el.style.top);
            updateCurrentPage({ elements: updated });
        };

        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
    };




    const handlePrevPage = () => {
        goToPage(currentPageIndex - 1);
    };

    const handleNextPage = () => {
        goToPage(currentPageIndex + 1);
    };


    if (!currentPage) return <div className="canvas">No pages yet!</div>;

    return (
        <>
            <ToolbarLeft
                onAction={handleToolAction}
                clearCanvas={clearCanvas}
            />

            <ToolbarRight
                color={color}
                onColorChange={handleColorChange}
                onDesignChange={handleDesignChange}
                currentDesign={pageDesign}
            />

            <ToolbarBottom
                showThickness={tool === "pen"}
                thickness={thickness}
                onThicknessChange={setThickness}
                showFontSize={tool === "text"}
                selectedFontSize={selectedFontSize} // ✅ Pass current value!
                onFontSizeChange={setSelectedFontSize}
                fontStyle={tool === "text" ? fontStyle : undefined}
                onFontStyleChange={setFontStyle}
            />

            <PageNav onPrev={handlePrevPage} onNext={handleNextPage}
                current={currentPageIndex + 1}
                total={pages.length} />

            <div className={`canvas canvas--${pageDesign}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}>

                <canvas ref={canvasRef} className="drawing-canvas" />

                {currentPage?.elements.map((el, idx) => {
                    if (el.type === "note") {
                        return (
                            <div
                                key={idx}
                                contentEditable
                                className="sticky-note"
                                style={{ top: el.y, left: el.x, position: "absolute" }}
                                onPointerDown={(e) => handleDrag(e, idx)}
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                    const updated = [...currentPage.elements];
                                    updated[idx].content = e.target.innerText;
                                    updateCurrentPage({ elements: updated });
                                }}
                            >
                                {el.content}
                            </div>
                        );
                    }

                    if (el.type === "table") {
                        return (
                            <table
                                key={idx}
                                className="scrapbook-table"
                                style={{ top: el.y, left: el.x, position: "absolute" }}
                                onPointerDown={(e) => handleDrag(e, idx)}
                            >
                                <tbody>
                                    {el.data.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                            {row.map((cell, cIdx) => (
                                                <td
                                                    key={cIdx}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => {
                                                        const updated = [...currentPage.elements];
                                                        updated[idx].data[rIdx][cIdx] = e.target.innerText;
                                                        updateCurrentPage({ elements: updated });
                                                    }}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        );
                    }

                    if (el.type === "text") {
                        return (
                            <div
                                key={idx}
                                contentEditable
                                suppressContentEditableWarning
                                style={{
                                    position: "absolute",
                                    left: el.x,
                                    top: el.y,
                                    background: "transparent",
                                    fontSize: el.size || "16px",
                                    color: el.color || "#000",
                                    cursor: "move",
                                }}
                                onPointerDown={(e) => handleDrag(e, idx)}
                                onBlur={(e) => {
                                    const updated = [...currentPage.elements];
                                    updated[idx].content = e.target.innerText;
                                    updateCurrentPage({ elements: updated });
                                }}
                            >
                                {el.content}
                            </div>
                        );
                    }

                    return null;
                })}



            </div>
        </>
    );
}
