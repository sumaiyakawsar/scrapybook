import { useEffect, useRef, useState } from "react";

import { useScrapbook } from "../contexts/ScrapbookContext";
import StickyNote from "./StickyNote";
import DrawingToolbar from "./DrawingToolbar";


export default function CanvasPage() {

    const { currentPage, updateCurrentPage } = useScrapbook();
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [thickness, setThickness] = useState(3);
    const [currentPath, setCurrentPath] = useState([]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // 💥 Prevent accessing null

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctxRef.current = ctx;

        // Load existing drawings
        if (currentPage?.elements) {
            currentPage.elements.forEach((el) => {
                if (el.type === "draw") {
                    drawPath(ctx, el.path, el.color, el.thickness);
                }
            });
        }
    }, [currentPage]);

    useEffect(() => {
        if (ctxRef.current) {
            ctxRef.current.strokeStyle = color;
            ctxRef.current.lineWidth = thickness;
        }
    }, [color, thickness]);

    const drawPath = (ctx, path, strokeColor, lineWidth) => {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const [x, y] = path[i];
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    };

    const handlePointerDown = (e) => {
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
        setCurrentPath([[x, y]]);
    };


    const handlePointerMove = (e) => {
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
        setCurrentPath((prev) => [...prev, [x, y]]);
    };

    const handlePointerUp = () => {
        setIsDrawing(false);
        if (currentPath.length > 1) {
            const drawElement = {
                type: "draw",
                path: currentPath,
                color,
                thickness,
            };
            updateCurrentPage({
                elements: [...(currentPage.elements || []), drawElement],
            });
        }
        setCurrentPath([]);
    };

    const handleTableDrag = (e, index) => {
        const table = e.currentTarget;
        const offsetX = e.clientX - table.offsetLeft;
        const offsetY = e.clientY - table.offsetTop;

        const move = (moveEvent) => {
            const newX = moveEvent.clientX - offsetX;
            const newY = moveEvent.clientY - offsetY;

            table.style.left = `${newX}px`;
            table.style.top = `${newY}px`;
        };

        const up = () => {
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);

            const updated = [...currentPage.elements];
            updated[index].x = parseInt(table.style.left);
            updated[index].y = parseInt(table.style.top);
            updateCurrentPage({ elements: updated });
        };

        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
    };




    if (!currentPage) return <div className="canvas">No pages yet!</div>;

    return (
        <div className={`canvas canvas--${currentPage.design || "plain"}`}>


            <canvas
                ref={canvasRef}
                className="drawing-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            />

            <DrawingToolbar
                color={color}
                thickness={thickness}
                onColorChange={setColor}
                onThicknessChange={setThickness}
                // clearCanvas={clearCanvas}
            />

            {currentPage.elements?.filter(el => el.type === "note").map((note, i) => (
                <StickyNote
                    key={i}
                    x={note.x}
                    y={note.y}
                    text={note.text}
                    onChange={(newText, newX, newY) => {
                        const updated = [...currentPage.elements];
                        updated[i] = { ...updated[i], text: newText, x: newX, y: newY };
                        updateCurrentPage({ elements: updated });
                    }}
                />
            ))}

            {currentPage.elements?.filter(el => el.type === "table").map((table, i) => (
                <div
                    key={i}
                    className="draggable-table"
                    style={{ left: table.x, top: table.y }}
                    onPointerDown={(e) => handleTableDrag(e, i)}
                >
                    <table>
                        <tbody>
                            {[...Array(table.rows)].map((_, row) => (
                                <tr key={row}>
                                    {[...Array(table.cols)].map((_, col) => (
                                        <td
                                            key={col}
                                            contentEditable
                                            suppressContentEditableWarning={true}
                                        >
                                            {/* Optional: show cell ID like A1, B2 etc. */}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}

        </div>
    );
}
