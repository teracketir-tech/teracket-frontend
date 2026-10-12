import RelationFilter from "@/components/pages/scheduling/RelationFilter";
import RelationsTable from "@/components/pages/scheduling/RelationsTable";
import Empty from "@/components/shared/Empty";
import Pagination from "@/components/shared/Pagination";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const EXPAND = "expand=project, predecessor, successor";
/**
 * بند ۱: `TaskRelation::get_all` پیش‌فرض ۱۰۰ ردیف در صفحه می‌گیرد و همه‌ی
 * روابط در همان صفحه‌ی اول می‌نشینند؛ `Pagination` صفحه‌ی تکی را مخفی
 * می‌کند، پس اندازه‌ی پیش‌فرض را خودمان می‌فرستیم (همان ۱۰ِ لیست اشخاص).
 */
const DEFAULT_PER_PAGE = "10";

/**
 * ایشوی ۵: عینِ لیستِ تسک‌ها، بدونِ پروژهٔ انتخاب‌شده نه لیستی هست و نه
 * درخواستی؛ گرفتنِ همهٔ روابطِ همهٔ پروژه‌ها نه کند است و نه خوانا.
 */
export default function RelationList() {
    const [searchParams] = useSearchParams();
    const [relations, setRelations] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const projectId = searchParams.get("project_id") || "";

    const fetchRelations = async () => {
        const query = searchParams.toString();

        setLoading(true);

        try {
            // اگر خودِ کاربر در URL اندازه گذاشته باشد همان ملاک است
            const perPage = searchParams.has("per-page") ? "" : `per-page=${DEFAULT_PER_PAGE}&`;
            const res = await api(`task-relation?${query ? `${query}&` : ""}${perPage}${EXPAND}`, "GET");
            setRelations(res);
        } catch {
            // api() خودش پیام خطا را نمایش داده است
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (relation: any) => {
        const res = await api(`task-relation/${relation.id}`, "DELETE");

        if (res?.success) {
            toast.success("رابطه با موفقیت حذف شد.");
            fetchRelations();
        }
    };

    useEffect(() => {
        if (!projectId) {
            setRelations({});
            setLoading(false);
            return;
        }

        fetchRelations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, projectId]);

    if (!projectId) {
        return (
            <div className="w-full">
                <RelationFilter loading={loading} />

                <Empty text="برای مشاهده روابط، ابتدا پروژه را انتخاب کنید" />
            </div>
        );
    }

    return (
        <div className="w-full">
            <RelationFilter loading={loading} />

            <RelationsTable relations={relations?.data ?? []} loading={loading} onDelete={handleDelete} />

            <Pagination totalPage={relations.pages} defaultPerPage={DEFAULT_PER_PAGE} />
        </div>
    );
}
