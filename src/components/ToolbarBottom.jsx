import { TbLetterA } from "react-icons/tb";
import { AiOutlineBold, AiOutlineItalic } from "react-icons/ai";

export default function ToolbarBottom({
    showThickness,
    thickness,
    onThicknessChange,
    showFontSize,
    selectedFontSize,
    onFontSizeChange,
    fontStyle,
    onFontStyleChange,
}) {
    if (!showThickness && !showFontSize && !fontStyle) return null;

    return (
        <div className="toolbar-bottom">
            {showThickness && (
                <div className="thickness-control">
                    <button onClick={() => onThicknessChange(Math.max(1, thickness - 1))}>-</button>
                    <span>{thickness}</span>
                    <button onClick={() => onThicknessChange(Math.min(20, thickness + 1))}>+</button>
                </div>
            )}

            {showFontSize && (
                <div className="font-size-control">
                    {["12px", "14px", "16px", "18px", "24px"].map((size) => (
                        <button
                            key={size}
                            className={selectedFontSize === size ? "active" : ""}
                            onClick={() => onFontSizeChange(size)}
                        >
                            {size.replace("px", "")}
                        </button>
                    ))}
                </div>
            )}

            {/* Font Style Control */}
            {fontStyle !== undefined && (
                <div className="font-style-control">
                    <button
                        className={fontStyle === "normal" ? "active" : ""}
                        onClick={() => onFontStyleChange("normal")}
                        title="Normal"
                    >
                        <TbLetterA size={18} />
                    </button>
                    <button
                        className={fontStyle === "bold" ? "active" : ""}
                        onClick={() => onFontStyleChange("bold")}
                        title="Bold"
                    >
                        <AiOutlineBold size={18} />
                    </button>
                    <button
                        className={fontStyle === "italic" ? "active" : ""}
                        onClick={() => onFontStyleChange("italic")}
                        title="Italic"
                    >
                        <AiOutlineItalic size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
