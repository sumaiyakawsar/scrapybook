import { useEffect, useRef, useState } from "react";
import { useScrapbook } from "../contexts/ScrapbookContext";



import ToolbarLeft from "./ToolbarLeft";
import ToolbarRight from "./ToolbarRight";
import PageNav from "./PageNav";
import "./Canvas.css";

export default function Canvas() {
    const {
        pages,
        currentPage,
        updateCurrentPage,
        goToPage,
        setPageDesign,
        currentPageIndex,
    } = useScrapbook();


    const [tool, setTool] = useState("none"); // pen | note | text | table
    const [color, setColor] = useState("#ff0000");
    const [thickness, setThickness] = useState(3);

    // const [pageDesign, setPageDesign] = useState("dotted");

    // 🧠 Drawing
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    // const [paths, setPaths] = useState([]); // Array of drawn paths
    const [currentPath, setCurrentPath] = useState([]);

    // ✏️ Notes / Tables
    // const [elements, setElements] = useState([]);

   

    const paths = currentPage?.elements?.filter((el) => el.type === "draw") || [];
    const elements = currentPage?.elements?.filter((el) => el.type !== "draw") || [];
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
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = canvas.offsetWidth || 800;
        canvas.height = canvas.offsetHeight || 600;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctxRef.current = ctx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach((el) => {
            if (el.type === "draw") drawPath(el, ctx);
        });
    }, [paths, color, thickness]);

    // useEffect(() => {
    //     const canvas = canvasRef.current;

    //     // ✅ Bail out if canvas isn't ready
    //     if (!canvas) return;

    //     canvas.width = canvas.offsetWidth;
    //     canvas.height = canvas.offsetHeight;

    //     const ctx = canvas.getContext("2d");
    //     ctx.lineCap = "round";
    //     ctx.lineJoin = "round";
    //     ctx.strokeStyle = color;
    //     ctx.lineWidth = thickness;
    //     ctxRef.current = ctx;

    //     // Redraw all paths
    //     // ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     // paths.forEach(p => drawPath(p, ctx));

    //     if (currentPage?.elements) {
    //         currentPage.elements.forEach((el) => {
    //             if (el.type === "draw") {
    //                 drawPath(ctx, el.path, el.color, el.thickness);
    //             }
    //         });
    //     }
    //     // }, [paths]);
    // }, [currentPage]);

    // useEffect(() => {
    //     if (ctxRef.current) {
    //         ctxRef.current.strokeStyle = color;
    //         ctxRef.current.lineWidth = thickness;
    //     }
    // }, [color, thickness]);

    // const drawPath = ({ points, color, thickness }, ctx = ctxRef.current) => {
    //     if (!points.length) return;
    //     ctx.strokeStyle = color;
    //     ctx.lineWidth = thickness;
    //     ctx.beginPath();
    //     ctx.moveTo(points[0][0], points[0][1]);
    //     for (let i = 1; i < points.length; i++) {
    //         ctx.lineTo(points[i][0], points[i][1]);
    //     }
    //     ctx.stroke();
    // };
    // const drawPath = (ctx, path, strokeColor, lineWidth) => {
    //     ctx.strokeStyle = strokeColor;
    //     ctx.lineWidth = lineWidth;
    //     ctx.beginPath();
    //     for (let i = 0; i < path.length; i++) {
    //         const [x, y] = path[i];
    //         if (i === 0) {
    //             ctx.moveTo(x, y);
    //         } else {
    //             ctx.lineTo(x, y);
    //         }
    //     }
    //     ctx.stroke();
    // };

    const drawPath = ({ path, color, thickness }, ctx = ctxRef.current) => {
        if (!path?.length) return;

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const [x, y] = path[i];
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        // ctx.moveTo(path[0][0], path[0][1]);
        // for (let i = 1; i < path.length; i++) {
        //     ctx.lineTo(path[i][0], path[i][1]);
        // }
        ctx.stroke();
    };
    const handlePointerDown = (e) => {
        if (tool !== "pen") return;


        setIsDrawing(true);

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
        setCurrentPath([[x, y]]);
    };

    const handlePointerMove = (e) => {
        if (!isDrawing || tool !== "pen") return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
        setCurrentPath((prev) => [...prev, [x, y]]);
    };


    const handlePointerUp = () => {
        setIsDrawing(false);
        if (currentPath.length < 2) return;

        const newPath = {
            type: "draw",
            path: currentPath,
            color,
            thickness,
        };

        updateCurrentPage({
            elements: [...(currentPage.elements || []), newPath],
        });

        setCurrentPath([]);
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

            const updated = [...elements];
            updated[index].x = parseInt(el.style.left);
            updated[index].y = parseInt(el.style.top);
            setElements(updated);
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
    const clearCanvas = () => {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        updateCurrentPage({ elements: (currentPage.elements || []).filter(el => el.type !== "draw") });
    };

    // if (!currentPage) return <div className="canvas">No pages yet!</div>;

    return (
        <>
            <ToolbarLeft onAction={handleToolAction} clearCanvas={clearCanvas}
            />
            <ToolbarRight
                color={color}
                thickness={thickness}
                onColorChange={handleColorChange}
                onDesignChange={handleDesignChange}
                currentDesign={pageDesign} onThicknessChange={setThickness}
            />
            <PageNav onPrev={handlePrevPage} onNext={handleNextPage}
                current={currentPageIndex + 1}
                total={pages.length} />

            <div className={`canvas canvas--${pageDesign}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}>
                <canvas ref={canvasRef} className="drawing-canvas" />


                {elements.map((el, idx) => {
                    // console.log(el.type)
                    if (el.type === "note") {
                        return (
                            <div
                                key={idx}
                                contentEditable
                                className="note"
                                style={{ top: el.y, left: el.x, position: "absolute" }}
                                onPointerDown={(e) => handleDrag(e, idx)}
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                    const updated = [...elements];
                                    updated[idx].content = e.target.innerText;
                                    setElements(updated);
                                }}
                            >
                                {el.content}
                            </div>
                        );
                    } else if (el.type === "table") {
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
                                                        const updated = [...elements];
                                                        updated[idx].data[rIdx][cIdx] = e.target.innerText;
                                                        setElements(updated);
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
                })}







                {tool === "note" && (
                    <div className="note" contentEditable style={{ top: "200px", left: "200px" }}>
                        Write something...
                    </div>
                )}
                {tool === "text" && (
                    <div className="text-box" contentEditable style={{ top: "300px", left: "300px" }}>
                        Editable text
                    </div>
                )}
                {tool === "table" && (
                    <table className="scrapbook-table" style={{ top: "400px", left: "300px" }}>
                        <tbody>
                            <tr>
                                <td>Cell 1</td>
                                <td>Cell 2</td>
                            </tr>
                            <tr>
                                <td>Cell 3</td>
                                <td>Cell 4</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
