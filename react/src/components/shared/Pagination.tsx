"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "./inputs/Select";

interface Props {
    totalPage: number;
    paramsName?: string;
    allowNavigate?: boolean;
    onPageChange?: (page: number) => void;
    defaultPerPage?: string;
}

const Pagination = ({ totalPage, paramsName = "page", allowNavigate = true, onPageChange = () => {}, defaultPerPage = "10" }: Props) => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(defaultPerPage);

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

    const onPerPageChange = (pp: string) => {
        if (allowNavigate) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("per-page", pp);
            params.delete("page");

            setPerPage(pp);

            navigate(`?${params.toString()}`);
        }
    };

    useEffect(() => {
        const p = searchParams.get(paramsName);
        const pp = searchParams.get("per-page");

        setPage(p ? parseInt(p) : 1);
        setPerPage(pp || defaultPerPage);
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
        <div className="flex items-center justify-center gap-5 my-10">
            <div className="flex items-center justify-center gap-2">
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
                                num === page ? "bg-primary text-white font-bold" : "border-gray-300"
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

            <div>
                <Select
                    name="per-page"
                    value={perPage}
                    onChange={(pp: string) => {
                        setPage(1);
                        onPerPageChange(pp);
                    }}
                    isClearable={false}
                    options={[
                        { label: "10", value: "10" },
                        { label: "15", value: "15" },
                        { label: "20", value: "20" },
                        { label: "30", value: "30" },
                        { label: "50", value: "50" },
                        { label: "100", value: "100" },
                        { label: "300", value: "300" },
                        { label: "500", value: "500" },
                    ]}
                />
            </div>
        </div>
    );
};

export default Pagination;
