import { useRef, useState, useEffect } from "react";
import { useScrapbook } from "../contexts/ScrapbookContext";

export function useDrawing({ color, thickness, tool }) {
    const { currentPage, updateCurrentPage } = useScrapbook();

    // 🧠 Drawing
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);

    // Setup canvas when currentPage or size changes
    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;// 💥 Prevent accessing null

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth || 800;
        canvas.height = canvas.offsetHeight || 600;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctxRef.current = ctx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Load existing drawings
        (currentPage?.elements || []).forEach((el) => {
            if (el.type === "draw") {
                drawPath(el, ctx);
            }
        });
    }, [currentPage, color, thickness]);

    const drawPath = ({ path, color, thickness }, ctx = ctxRef.current) => {
        if (!path?.length) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i][0], path[i][1]);
        }
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
        if (!isDrawing || tool !== "pen") return;

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


    const clearCanvas = () => {
        if (!ctxRef.current || !canvasRef.current) return;


        const confirmed = window.confirm("Are you sure you want to clear everything from this page?");
        if (!confirmed) return;
        
        // Clear the actual canvas drawing
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // // Also clear draw elements from current page
        // const remaining = (currentPage.elements || []).filter(el => el.type !== "draw");
        // updateCurrentPage({ elements: remaining });

        // Clear all elements (not just drawings)
        updateCurrentPage({ elements: [] });
    };


    // 💡 Auto-stop drawing if tool switches
    useEffect(() => {
        if (tool !== "pen" && isDrawing) {
            setIsDrawing(false);
            setCurrentPath([]);
        }
    }, [tool]);

    return {
        canvasRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp, 
        clearCanvas,
    };
}
