import { useScrapbook } from "./contexts/ScrapbookContext";
import "./style/style.scss"
import Canvas from './components/Canvas';
import MinimalToolbar from './components/MinimalToolbar';

function App() {
  const { pages } = useScrapbook();


  return (
    <div className="app">

      {pages.length === 0 ? <MinimalToolbar /> : <Canvas />}

    </div>
  )
}

export default App
