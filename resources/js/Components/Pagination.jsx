import React from "react";
import { Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function Pagination({ currentPage, lastPage, onPageChange }) {
    const getPageNumbers = () => {
        const pageNumbers = [];

        if (lastPage <= 5) {
            // Show all page numbers if there are 5 or fewer
            for (let i = 1; i <= lastPage; i++) {
                pageNumbers.push(i);
            }
        } else {
            // For larger number of pages, keep only first, last, and pages around currentPage
            if (currentPage < 3) {
                pageNumbers.push(1, 2, 3, "...", lastPage);
            } else if (currentPage > lastPage - 2) {
                pageNumbers.push(
                    1,
                    "...",
                    lastPage - 2,
                    lastPage - 1,
                    lastPage
                );
            } else {
                pageNumbers.push(
                    1,
                    "...",
                    currentPage,
                    currentPage + 1,
                    "...",
                    lastPage
                );
            }
        }

        return pageNumbers;
    };

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="text"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                } flex items-center gap-2`}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-2">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() =>
                            typeof page === "number" && onPageChange(page)
                        }
                        disabled={page === "..."}
                        className={`px-3 py-1 rounded ${
                            page === currentPage
                                ? "bg-gray-900 text-white"
                                : "text-gray-900"
                        } ${page === "..." ? "cursor-default" : ""}`}
                    >
                        {String(page)}
                    </button>
                ))}
            </div>

            <Button
                variant="text"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className={`${
                    currentPage === lastPage
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                } flex items-center gap-2`}
            >
                Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}
