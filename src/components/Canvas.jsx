import { useState, useRef } from "react";
import { useScrapbook } from "../contexts/ScrapbookContext";
import { useDrawing } from "../hooks/useDrawing";

import ToolbarLeft from "./ToolbarLeft";
import ToolbarRight from "./ToolbarRight";
import ToolbarBottom from "./ToolbarBottom";
import PageNav from "./PageNav";
import StickyNote from "./Elements/StickyNote";
import TextBox from "./Elements/TextBox";
import TableBox from "./Elements/TableBox";

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
        selectedTool,
        setSelectedTool,
        textColor,
        setTextColor,
        drawingColor,
        setDrawingColor,
        selectedNoteId,
        setSelectedNoteId,
    } = useScrapbook();

 
    const [color, setColor] = useState("#ff0000");
    const [thickness, setThickness] = useState(3);
    const [selectedFontSize, setSelectedFontSize] = useState("16");
    const [fontStyle, setFontStyle] = useState("normal");
    const [fontWeight, setFontWeight] = useState("normal");
    const [textDecoration, setTextDecoration] = useState("none");

    const {
        canvasRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp, clearCanvas,
    } = useDrawing({ color, thickness, selectedTool });



    const pageDesign = currentPage?.design || "dotted";

    const handleToolAction = (action) => {
        switch (action) {
            case "fullscreen":
                setSelectedTool("none"); // stop drawing
                document.documentElement.requestFullscreen?.();
                break;
            case "pen":
                setSelectedTool("pen");
                break;
            case "image":
                setSelectedTool("none"); // stop drawing
                alert("Image upload coming soon!");
                break;
            case "text":
                setSelectedTool("text");
                addText(selectedFontSize, color, fontStyle, fontWeight, textDecoration);
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


    const handlePrevPage = () => {
        goToPage(currentPageIndex - 1);
    };

    const handleNextPage = () => {
        goToPage(currentPageIndex + 1);
    };

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
                showThickness={selectedTool === "pen"}
                thickness={thickness}
                onThicknessChange={setThickness}
                showFontSize={selectedTool === "text"}
                selectedFontSize={selectedFontSize} // ✅ Pass current value!
                onFontSizeChange={setSelectedFontSize}
                fontStyle={selectedTool === "text" ? fontStyle : undefined}
                onFontStyleChange={setFontStyle}
                fontWeight={fontWeight}
                onFontWeightChange={setFontWeight}
                textDecoration={textDecoration}
                onTextDecorationChange={setTextDecoration}
            />

            <PageNav onPrev={handlePrevPage} onNext={handleNextPage}
                current={currentPageIndex + 1}
                total={pages.length} />

            <div className={`canvas canvas--${pageDesign} ${selectedTool === "pen" ? "canvas--drawing" : ""}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}>

                <canvas ref={canvasRef} className="drawing-canvas" />

                {currentPage?.elements.map((el, idx) => {

                    if (el.type === "note") {
                        return (
                            <StickyNote
                                key={el.id}
                                el={el}
                                currentPage={currentPage}
                                updateCurrentPage={updateCurrentPage}
                                selectedNoteId={selectedNoteId}
                                setSelectedNoteId={setSelectedNoteId}
                            />
                        );
                    }

                    if (el.type === "table") {
                        return (
                            <TableBox
                                key={el.id}
                                el={el}
                                currentPage={currentPage}
                                updateCurrentPage={updateCurrentPage}
                            />
                        );
                    }

                    if (el.type === "text") {
                        return (
                            <TextBox
                                key={el.id}
                                el={el}
                                currentPage={currentPage}
                                updateCurrentPage={updateCurrentPage}
                            />


                        );
                    }

                    return null;
                })}



            </div>
        </>
    );
}
