import { Rnd } from "react-rnd";

export default function TableBox({ el, currentPage, updateCurrentPage }) {
    return (
        <Rnd
            key={el.id}
            default={{
                x: el.x,
                y: el.y,
                width: el.width || 300,
                height: el.height || 200,
            }}
            onDragStop={(e, d) => {
                const updated = currentPage.elements.map((item) =>
                    item.id === el.id ? { ...item, x: d.x, y: d.y } : item
                );
                updateCurrentPage({ elements: updated });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                const updated = currentPage.elements.map((item) =>
                    item.id === el.id
                        ? {
                            ...item,
                            width: ref.style.width,
                            height: ref.style.height,
                            x: position.x,
                            y: position.y,
                        }
                        : item
                );
                updateCurrentPage({ elements: updated });
            }}
            bounds="parent"
            minWidth={150}
            minHeight={100}
        >
            <div className="box-wrapper">
                <table className="scrapbook-table" style={{ width: "100%", height: "100%" }}>
                    <tbody>
                        {el.data.map((row, rIdx) => (
                            <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                    <td
                                        key={cIdx}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updated = [...currentPage.elements];
                                            updated.find(i => i.id === el.id).data[rIdx][cIdx] = e.target.innerText;
                                            updateCurrentPage({ elements: updated });
                                        }}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    className="delete-btn"
                    onClick={() => {
                        const updated = currentPage.elements.filter(item => item.id !== el.id);
                        updateCurrentPage({ elements: updated });
                    }}
                    title="Delete"
                >
                    ×
                </button>
            </div>
        </Rnd>
    );
}
