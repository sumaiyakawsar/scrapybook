import { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import { useScrapbook } from "../../contexts/ScrapbookContext";
import { IoMdClose } from "react-icons/io";

export default function TextBox({ el, currentPage, updateCurrentPage }) {
    const { selectedTool } = useScrapbook();

    const targetRef = useRef(null);
    const [frame, setFrame] = useState({
        translate: [el.x, el.y],
        rotate: el.rotate || 0,
        width: el.width || 200,
        height: el.height || 50,
    });

    const updateElement = (newProps) => {
        const updated = currentPage.elements.map((item) =>
            item.id === el.id ? { ...item, ...newProps } : item
        );
        updateCurrentPage({ elements: updated });
    };
    const deleteElement = () => {
        const updated = currentPage.elements.filter((item) => item.id !== el.id);
        updateCurrentPage({ elements: updated });
    };

    useEffect(() => {
        updateElement({
            x: frame.translate[0],
            y: frame.translate[1],
            rotate: frame.rotate,
            width: frame.width,
            height: frame.height,
        });
    }, [frame]);



    return (
        <>


            <div
                ref={targetRef}
                className="box-wrapper"
                style={{
                    position: "absolute",
                    transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`,
                    width: frame.width,
                    height: frame.height,
                }}
                onClick={() => {
                    targetRef.current?.focus();
                }}

            >
                <div
                    className="text-box"
                    contentEditable
                    suppressContentEditableWarning
                    style={{
                        fontSize: el.size || "16px",
                        color: el.color || "#000",
                        fontStyle: el.style || "normal",
                        fontWeight: el.weight || "normal",
                        textDecoration: el.decoration || "none",
                    }}
                    onBlur={(e) => {
                        updateElement({ content: e.target.innerText });
                    }}
                >
                    {el.content}
                </div>

                <button className="delete-btn" onClick={deleteElement} title="Delete">
                    <IoMdClose />
                </button>
            </div>

            {/* {selectedTool === "text" && ( */}
            <Moveable
                target={targetRef}
                draggable={selectedTool === "text"}
                resizable={selectedTool === "text"}
                rotatable={selectedTool === "text"}
                // draggable
                onDrag={({ beforeTranslate }) => {
                    setFrame(f => ({ ...f, translate: beforeTranslate }));
                }}
                snappable
                // resizable
                onResize={({ width, height, drag }) => {
                    const [x, y] = drag.beforeTranslate;
                    setFrame(f => ({ ...f, width, height, translate: [x, y] }));

                }}

                // rotatable
                throttleRotate={0}
                rotationPosition={"top"}
                onRotate={({ beforeRotate }) => {
                    setFrame(f => ({ ...f, rotate: beforeRotate }));
                }}

                visible={selectedTool === "text"} // Optional visual toggle

            />


            {/* )} */}
        </>
    );
}
