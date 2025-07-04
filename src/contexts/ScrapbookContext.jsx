import { createContext, useContext, useState, useEffect } from "react";

import { useLocalStorage } from "../utils/useLocalStorage";

const ScrapbookContext = createContext();

export function ScrapbookProvider({ children }) {
    const [pages, setPages] = useState([]);

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [history, setHistory] = useState([]);

    const [redoStack, setRedoStack] = useState([]);

    // 
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("scrapbook"));
        if (saved?.pages) {
            setPages(saved.pages);
            setCurrentPageIndex(saved.currentPageIndex || 0);
        } else {
            // Default blank page
            setPages([{ elements: [], design: "dotted" }]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("scrapbook", JSON.stringify({ pages, currentPageIndex }));
    }, [pages, currentPageIndex]);

    const currentPage = pages[currentPageIndex];
    // 




    const updateCurrentPage = (updates) => {
        const updatedPage = { ...currentPage, ...updates };
        const newPages = [...pages];
        newPages[currentPageIndex] = updatedPage;

        // For undo
        setHistory([...history, currentPage]);
        setRedoStack([]);

        setPages(newPages);
    };

    const addPage = () => {
        const newPage = {
            id: `page-${Date.now()}`,
            elements: [],
            design: "plain", // default

        };
        setPages([...pages, newPage]);
        setCurrentPageIndex(pages.length); // go to new page
    };

    const goToPage = (index) => {
        if (index >= 0 && index < pages.length) {
            setCurrentPageIndex(index);
        }
    };

    const setPageDesign = (design) => {
        updateCurrentPage({ design });
    };


    const addStickyNote = () => {
        const newNote = {
            type: "note",
            x: 100 + Math.random() * 100,
            y: 100 + Math.random() * 100,
            text: "New note",
        };

        const updatedPage = {
            ...pages[currentPageIndex],
            elements: [...(pages[currentPageIndex].elements || []), newNote],
        };

        updateCurrentPage(updatedPage);
    };

    const addTable = () => {
        const newTable = {
            type: "table",
            x: 150,
            y: 150,
            rows: 3,
            cols: 3,
        };

        const updatedPage = {
            ...pages[currentPageIndex],
            elements: [...(pages[currentPageIndex].elements || []), newTable],
        };

        updateCurrentPage(updatedPage);
    };


    const undo = () => {
        if (history.length === 0) return;
        const prev = history.pop();
        const newPages = [...pages];
        newPages[currentPageIndex] = prev;
        setPages(newPages);
        setHistory([...history]);
        setRedoStack([...redoStack, currentPage]);
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const next = redoStack.pop();
        const newPages = [...pages];
        newPages[currentPageIndex] = next;
        setPages(newPages);
        setRedoStack([...redoStack]);
        setHistory([...history, currentPage]);
    };

    // const exportJSON = () => {
    //     const data = JSON.stringify(currentPage);
    //     const blob = new Blob([data], { type: "application/json" });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = "scrapbook-page.json";
    //     link.click();
    // };

    // const exportImage = () => {
    //     const canvasElement = document.querySelector(".canvas");

    //     html2canvas(canvasElement).then((canvas) => {
    //         const link = document.createElement("a");
    //         link.href = canvas.toDataURL("image/png");
    //         link.download = "scrapbook.png";
    //         link.click();
    //     });
    // };

    const printPage = () => {
        window.print();
    };

    return (



        <ScrapbookContext.Provider
            value={{
                pages,
                currentPage,
                currentPageIndex,
                updateCurrentPage,
                addPage,
                goToPage,
                setPageDesign,
                undo,
                redo,
                addStickyNote,
                addTable,
                //    exportJSON, exportImage, printPage
            }}
        >
            {children}
        </ScrapbookContext.Provider>
    );
}

export const useScrapbook = () => useContext(ScrapbookContext);
