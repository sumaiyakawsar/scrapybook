import { useScrapbook } from "../contexts/ScrapbookContext";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";

export default function PageNav({ onPrev, onNext }) {
    const { currentPageIndex, pages } = useScrapbook();

    const currentPageNum = currentPageIndex + 1;
    const totalPages = pages.length;

    return (
        <div className="page-nav">
            <button onClick={onPrev} disabled={currentPageIndex === 0}>
                <GrFormPreviousLink />
            </button>

            <span className="page-number">
                {totalPages === 0 ? "No pages" : `${currentPageNum} / ${totalPages}`}
            </span>

            <button onClick={onNext} disabled={currentPageIndex === totalPages - 1}>
                <GrFormNextLink />
            </button>
        </div>
    );
}
