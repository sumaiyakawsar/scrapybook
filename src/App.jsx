import { useState } from 'react'
import { useScrapbook } from "./contexts/ScrapbookContext";
import Toolbar from "./components/Toolbar";
import CanvasPage from "./components/CanvasPage";
import "./style/style.scss"
import Canvas from './components/Canvas';
import ToolbarLeft from './components/ToolbarLeft';

function App() {
  // const { currentPageIndex, pages, updateCurrentPage, undo, redo, exportJSON, exportImage, printPage } = useScrapbook();
  const [tool, setTool] = useState("none"); // pen | note | text | table


  return (
    <div className="app">

      {/* <Toolbar
        onAddNote={addStickyNote}
        onAddTable={addTable}
        onUndo={undo}
        onRedo={redo}
        onExportJSON={exportJSON}
        onExportImage={exportImage}
        onPrint={printPage}
      /> */}

      <Canvas />
      {/* <CanvasPage /> */}
    </div>
  )
}

export default App
