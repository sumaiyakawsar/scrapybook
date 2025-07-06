// components/ResizableRichTextBox.jsx
import { useRef, useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { ResizableBox } from "react-resizable";

import "react-resizable/css/styles.css";
import "draft-js/dist/Draft.css";
import "./ResizableRichText.css";

export default function ResizableRichText({ x, y, onUpdate }) {
    const nodeRef = useRef(null);

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(100);

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return "handled";
        }
        return "not-handled";
    };

    return (
        <div
            ref={nodeRef}
            className="rich-text-wrapper"
            style={{
                position: "absolute",
                left: x,
                top: y,
                background: "#fff",
                padding: "8px",
                border: "1px solid #ccc",
                cursor: "move",
            }}
        >
            {/* Formatting Toolbar */}
            <div className="format-toolbar">
                <button onMouseDown={(e) => {
                    e.preventDefault();
                    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
                }}>
                    B
                </button>
                <button onMouseDown={(e) => {
                    e.preventDefault();
                    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
                }}>
                    I
                </button>
                <button onMouseDown={(e) => {
                    e.preventDefault();
                    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
                }}>
                    U
                </button>
            </div>

            {/* Resizable Text Box */}
            <ResizableBox
                width={width}
                height={height}
                minConstraints={[150, 50]}
                maxConstraints={[600, 300]}
                onResizeStop={(e, data) => {
                    setWidth(data.size.width);
                    setHeight(data.size.height);
                }}
            >
                <div className="editor-box" style={{ width: "100%", height: "100%", overflow: "auto" }}>
                    <Editor
                        editorState={editorState}
                        onChange={setEditorState}
                        handleKeyCommand={handleKeyCommand}
                        placeholder="Write something..."
                    />
                </div>
            </ResizableBox>
        </div>
    );
}
