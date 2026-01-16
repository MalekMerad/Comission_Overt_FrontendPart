import React from "react";

export function Pagination({ totalPages, currentPage, handlePageChange }) {
    if (totalPages <= 1) return null;

   return (
    <div className="flex justify-center items-center mt-4 gap-2">
        {/* Bouton page précédente */}
        <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={`px-3 py-1 rounded transition-colors duration-200 
                ${currentPage === 1 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                }`}
        >
            &lt;
        </button>

        { /* Numéros de pages */ }
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded transition-colors duration-200
                    ${page === currentPage 
                        ? "bg-slate-700 text-white cursor-default" 
                        : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                    }`}
            >
                {page}
            </button>
        ))}

        {/* Bouton page suivante */}
        <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            className={`px-3 py-1 rounded transition-colors duration-200 
                ${currentPage === totalPages 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                }`}
        >
            &gt;
        </button>
    </div>
);

}
