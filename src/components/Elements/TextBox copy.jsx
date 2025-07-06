// import { useRef, useState, useEffect } from "react";
// import Moveable from "react-moveable";
// import { useScrapbook } from "../../contexts/ScrapbookContext";
// import { IoMdClose } from "react-icons/io";

// export default function TextBox({ el, currentPage, updateCurrentPage }) {
//     return (
//         <Rnd
//             key={el.id}
//             default={{
//                 x: el.x,
//                 y: el.y,
//                 width: el.width || 200,
//                 height: el.height || 100,
//             }}
//             onDragStop={(e, d) => {
//                 const updated = currentPage.elements.map((item) =>
//                     item.id === el.id ? { ...item, x: d.x, y: d.y } : item
//                 );
//                 updateCurrentPage({ elements: updated });
//             }}
//             onResizeStop={(e, direction, ref, delta, position) => {
//                 const updated = currentPage.elements.map((item) =>
//                     item.id === el.id
//                         ? {
//                             ...item,
//                             width: ref.style.width,
//                             height: ref.style.height,
//                             x: position.x,
//                             y: position.y,
//                         }
//                         : item
//                 );
//                 updateCurrentPage({ elements: updated });
//             }}
//             bounds="parent"
//             minWidth={100}
//             minHeight={50}
//         >
//             <div className="box-wrapper"
//                 style={{
//                     transform: `rotate(${el.rotate || 0}deg)`,
//                     width: "100%",
//                     height: "100%",
//                 }}>
//                 <div
//                     className="text-box"
//                     contentEditable
//                     suppressContentEditableWarning
//                     style={{
//                         fontSize: el.size || "16px",
//                         color: el.color || "#000",
//                         fontStyle: el.style || "normal",      // ✅ italic, normal
//                         fontWeight: el.weight || "normal",    // (optional) bold
//                         textDecoration: el.decoration || "none", // (optional) underline

//                     }}
//                     onBlur={(e) => {
//                         const updated = currentPage.elements.map((item) =>
//                             item.id === el.id ? { ...item, content: e.currentTarget.innerText } : item
//                         );
//                         updateCurrentPage({ elements: updated });
//                     }}
//                 >
//                     {el.content}
//                 </div>


//             </div>
//         </Rnd>
//     );
// }








 