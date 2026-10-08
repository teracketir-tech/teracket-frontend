"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
    totalPage: number;
    paramsName?: string;
    allowNavigate?: boolean;
    onPageChange?: (page: number) => void;
}

const Pagination = ({ totalPage, paramsName = "page", allowNavigate = true, onPageChange = () => {} }: Props) => {
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const onChange = (p: number) => {
        if (p < 1 || p > totalPage) return;
        setPage(p);

        if (allowNavigate) {
            const params = new URLSearchParams(searchParams.toString());
            params.set(paramsName, p.toString());
            navigate(`?${params.toString()}`);
        }
    };

    useEffect(() => {
        const p = searchParams.get(paramsName);
        setPage(p ? parseInt(p) : 1);
    }, [searchParams, paramsName]);

    useEffect(() => {
        onPageChange(page);
    }, [page]);

    if (totalPage === 1 || !totalPage) return null;

    let pagesToShow: (number | string)[] = [];
    if (totalPage <= 7) {
        for (let i = 1; i <= totalPage; i++) {
            pagesToShow.push(i);
        }
    } else {
        if (page <= 3) {
            pagesToShow = [1, 2, 3, 4, 5, "...", totalPage];
        } else if (page >= totalPage - 2) {
            pagesToShow = [1, "...", totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
        } else {
            pagesToShow = [1, "...", page - 2, page - 1, page, page + 1, page + 2, "...", totalPage];
        }
    }

    return (
        <div className="flex items-center justify-center gap-2 my-5">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm disabled:opacity-40 cursor-pointer"
                aria-label="قبلی"
            >
                <ArrowRightIcon size={17} />
            </button>

            {pagesToShow.map((num, idx) =>
                typeof num === "number" ? (
                    <button
                        type="button"
                        key={num}
                        onClick={() => onChange(num)}
                        className={`w-10 h-10 flex items-center justify-center border rounded-sm cursor-pointer ${
                            num === page ? "border-black font-bold" : "border-gray-300"
                        }`}
                    >
                        {num}
                    </button>
                ) : (
                    <button
                        type="button"
                        key={"ellipsis-" + idx}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm disabled:opacity-40 cursor-pointer"
                        aria-label="بیشتر"
                    >
                        ...
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page === totalPage}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm disabled:opacity-40 cursor-pointer"
                aria-label="بعدی"
            >
                <ArrowLeftIcon size={17} />
            </button>
        </div>
    );
};

export default Pagination;
