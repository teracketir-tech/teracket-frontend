import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Select from "@/components/shared/inputs/Select";
import CompanySelect from "@/components/shared/CompanySelect";
import AccountingDataSelect from "@/components/shared/AccountingDataSelect";
import { useAuth } from "@/context/AuthContext";
import { loadDictionaries, type DictOption } from "@/components/shared/dictionaries";

/**
 * ثبت/ویرایش کالا — ایشوی ۸: فیلد «واحد».
 *
 * واحد از واژه‌نامه‌ی فرم گزارش (یک درخواستِ کش‌شده) می‌آید چون فهرستِ واحدها
 * همان است که فرمِ مصالح/تحویل هم از آن استفاده می‌کند؛ اینجا فقط ستونِ
 * `unit_id` پر می‌شود و بقیه‌ جاها از همان خوانده می‌شود (منبع واحد حقیقت).
 */
export default function CreateProduct({ editMode = 0 }: { editMode?: number }) {
    const { auth } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState<DictOption[]>([]);

    useEffect(() => {
        let alive = true;
        loadDictionaries().then((dicts) => alive && setUnits(dicts.units));
        return () => {
            alive = false;
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            company_id: auth?.company_id || "",
            accounting_data_id: "",
            unit_id: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchProduct = async () => {
        setLoading(true);
        const res = await api(`product/${id}`, "GET");

        if (res?.success) formik.setValues(res?.data);

        setLoading(false);
    };

    useEffect(() => {
        if (editMode && id) fetchProduct();
    }, [id, editMode]);

    function onSubmit(data: object) {
        setLoading(true);

        api(editMode ? `product/${id}` : "product", editMode ? "PATCH" : "POST", data)
            .then((res) => {
                if (res?.success) {
                    toast.success("کالا با موفقیت ثبت شد.");
                    navigate("/product");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش کالا" : "ثبت کالا جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    <CompanySelect formik={formik} />
                    <Input type="text" name="name" title="نام" formik={formik} autoComplete="off" />
                    <AccountingDataSelect formik={formik} required />
                    {/* ایشوی ۸: واحدِ کالا — مبنای نمایشِ «مقدار (واحد)» در فرم مصالح */}
                    <Select name="unit_id" title="واحد" formik={formik} options={units} required={false} placeholder={units.length ? "انتخاب کنید" : "موردی ثبت نشده است"} />
                </form>
            </CardContent>

            <CardFooter>
                <Button onClick={formik.handleSubmit} className="mt-5" isLoading={loading} disabled={!formik.isValid}>
                    ثبت
                </Button>
            </CardFooter>
        </Card>
    );
}
