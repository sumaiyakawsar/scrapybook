import { useState } from "react"; 

export default function StickyNote({ x, y, text, onChange }) {
    const [value, setValue] = useState(text);
    
    const handleDrag = (e) => {
        const note = e.currentTarget;
        const offsetX = e.clientX - note.offsetLeft;
        const offsetY = e.clientY - note.offsetTop;

        const move = (moveEvent) => {
            const newX = moveEvent.clientX - offsetX;
            const newY = moveEvent.clientY - offsetY;
            note.style.left = `${newX}px`;
            note.style.top = `${newY}px`;
        };

        const up = () => {
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerup", up);
            onChange(value, parseInt(note.style.left), parseInt(note.style.top));
        };

        document.addEventListener("pointermove", move);
        document.addEventListener("pointerup", up);
    };

    return (
        <textarea
            className="sticky-note"
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.value, x, y);
            }}
            onPointerDown={handleDrag}
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
        />


    );
}
