import CompanySelect from "@/components/shared/CompanySelect";
import Filters from "@/components/shared/Filters";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import UserSelect from "@/components/shared/UserSelect";
import { positionOptions, typeOptions } from "@/lib/positions";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterForm({ loading }: { loading: boolean }) {
    const { auth } = useAuth();
    const [open, setOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            id: "",
            fname: "",
            lname: "",
            type: "",
            position_id: "",
            mobile: "",
            created_by: "",
            company_id: auth?.company_id || "",
        },
        onSubmit,
        validationSchema: false,
    });

    function onSubmit(data: object) {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(data).forEach(([key, value]) => {
            if (value) params.set(key, value.toString());
            else params.delete(key);
        });

        setSearchParams(params);
    }

    useEffect(() => {
        if (open) {
            Object.entries(formik.values).forEach(([key]) => {
                if (searchParams.get(key)) formik.setFieldValue(key, searchParams.get(key)?.toString());
            });
        }
    }, [open]);

    return (
        <Filters open={open} setOpen={setOpen} loading={loading} formik={formik}>
            <form className="w-full grid grid-cols-5 gap-5">
                <CompanySelect formik={formik} required={false} />
                <Input name="id" title="شناسه" formik={formik} required={false} />
                <Input name="fname" title="نام" formik={formik} required={false} />
                <Input name="lname" title="نام خانوادگی" formik={formik} required={false} />
                {/* issue 2.1: "type" is the same two-value list everywhere */}
                <Select name="type" title="نوع" formik={formik} options={typeOptions()} required={false} isClearable />
                {/* issue 2.2: position filter, matched exactly against contact.position_id */}
                <Select name="position_id" title="سمت" formik={formik} options={positionOptions()} required={false} isClearable />
                <Input name="mobile" title="موبایل" formik={formik} required={false} />
                <UserSelect name="created_by" title="کاربر ثبت کننده" formik={formik} />
            </form>
        </Filters>
    );
}
