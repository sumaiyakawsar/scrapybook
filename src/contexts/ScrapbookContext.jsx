import { createContext, useContext, useState } from "react";

import { useLocalStorage } from "../utils/useLocalStorage";

const ScrapbookContext = createContext();

export function ScrapbookProvider({ children }) {
    const [data, setData] = useLocalStorage("scrapbook", {
        pages: [],
        currentPageIndex: 0,
    });

    const pages = data.pages;
    const currentPageIndex = data.currentPageIndex;
    const [history, setHistory] = useState([]);

    const [redoStack, setRedoStack] = useState([]);
    const currentPage = pages[currentPageIndex] || null;

    const updateCurrentPage = (updates) => {
        const updatedPage = { ...currentPage, ...updates };
        const updatedPages = [...pages];
        updatedPages[currentPageIndex] = updatedPage;

        // For undo
        setHistory([...history, currentPage]);
        setRedoStack([]);

        setData({ ...data, pages: updatedPages });

    };

    const addPage = () => {
        const newPage = {
            id: `page-${Date.now()}`,
            elements: [],
            design: "plain", // default

        };

        setData({
            ...data,
            pages: [...pages, newPage],
            currentPageIndex: pages.length,
        });
    };

    const goToPage = (index) => {
        if (index >= 0 && index < pages.length) {
            setData({ ...data, currentPageIndex: index });

        }
    };

    const setPageDesign = (design) => {
        updateCurrentPage({ design });
    };


    const addStickyNote = () => {

        // 1. Create the new note object
        const newNote = {
            type: "note",
            x: 100 + Math.random() * 100,
            y: 100 + Math.random() * 100,
            text: "New note",
        };

        // 2. Build the updated page
        const updatedPage = {
            ...currentPage,
            elements: [
                ...(currentPage.elements || []),
                newNote
            ],
        };

        // 3. Create a new pages array with that updated page
        const updatedPages = [
            ...data.pages.slice(0, currentPageIndex),
            updatedPage,
            ...data.pages.slice(currentPageIndex + 1)
        ];

        setData({
            ...data,
            pages: updatedPages,
        });
    };

    const addTable = () => {
        const newTable = {
            type: "table",
            x: 150,
            y: 150,
            rows: 3,
            cols: 3,
            data: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ],
        };


        const updatedPage = {
            ...currentPage,
            elements: [...(currentPage.elements || []), newTable],
        };

        const updatedPages = [...data.pages];
        updatedPages[currentPageIndex] = updatedPage;

        setData({ ...data, pages: updatedPages });
    };

    const addText = (fontSize = "16px", color = "#000000") => {
        const newText = {
            type: "text",
            x: 120,
            y: 120,
            content: "Double-click to edit",
            size: fontSize,
            color: color,
        };

        const updatedPage = {
            ...currentPage,
            elements: [...(currentPage.elements || []), newText],
        };

        const updatedPages = [...data.pages];
        updatedPages[currentPageIndex] = updatedPage;

        setData({ ...data, pages: updatedPages });
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



    const printPage = () => {
        window.print();
    };

    return (



        <ScrapbookContext.Provider
            value={{
                data,
                setData,
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
                addText,
                printPage
            }}
        >
            {children}
        </ScrapbookContext.Provider>
    );
}

export const useScrapbook = () => useContext(ScrapbookContext);
