import { useScrapbook } from "../contexts/ScrapbookContext";
import "./PageNav.css";

export default function PageNav({ onPrev, onNext }) {
    const { currentPageIndex, pages } = useScrapbook();

    return (
        <div className="page-nav">
            <button onClick={onPrev} disabled={currentPageIndex === 0}>⬅️</button>
            <button onClick={onNext} disabled={currentPageIndex === pages.length - 1}>➡️</button>
        </div>
    );
}
