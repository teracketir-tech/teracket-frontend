// src/pages/hrm/settings/financial-year/index.jsx

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { checkAccess } from "@/lib/utils";
import Loading from "@/components/shared/Loading";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import FinancialYearForm from "./FinancialYearForm";
import FinancialYearList from "./FinancialYearList";

export default function FinancialYearSettings() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState({ data: [], pages: 0, totalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);

    const fetchData = async () => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString();

        setLoading(true);
        const res = await api(`hrm-financial-year?${query}`, "GET");
        setData(res || { data: [], pages: 0 });
        setLoading(false);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleSaveSuccess = () => {
        setEditingItem(null);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [searchParams]);

    return (
        <div className="w-full space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">
                    {editingItem ? "ویرایش سال مالی" : "ثبت سال مالی جدید"}
                </h2>
                <FinancialYearForm
                    editData={editingItem}
                    onCancel={handleCancelEdit}
                    onSuccess={handleSaveSuccess}
                />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loading />
                    </div>
                ) : data?.data?.length === 0 ? (
                    <Empty />
                ) : (
                    <>
                        <FinancialYearList
                            data={data.data}
                            onEdit={handleEdit}
                            onDelete={fetchData}
                        />
                        <Pagination totalPage={data.pages} />
                    </>
                )}
            </div>
        </div>
    );
}