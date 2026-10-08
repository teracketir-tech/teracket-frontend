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

export default function CreateUser({ editMode = 0 }: { editMode?: number }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>({});
    const [groups, setGroups] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const fetchGroups = async () => {
        const res = await api("group?per-page=1000", "GET");
        setGroups(res?.data?.map((g: any) => ({ label: g.name, value: g.id.toString(), company_id: g.company_id })));
    };

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            phone_number: "",
            password_hash: "",
            group_id: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchUser = async () => {
        setLoading(true);
        const res = await api(`user/${id}`, "GET");

        if (res?.success) {
            setUser(res.data);
            formik.setValues(res?.data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchGroups();

        if (editMode && id) fetchUser();
    }, [id, editMode]);

    function onSubmit(data: object) {
        if (!editMode && !formik.values.password_hash) {
            toast.error("لطفا کلمه عبور را وارد کنید");
            return;
        }

        setLoading(true);

        api(editMode ? `user/${id}` : "user", editMode ? "PATCH" : "POST", data)
            .then((res) => {
                if (res?.success) {
                    toast.success("کاربر با موفقیت ثبت شد.");
                    navigate("/user");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const filteredGroups = groups.filter((group: any) => group.company_id == (editMode ? user?.company_id : null));

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش کاربر" : "ثبت کاربر جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full grid grid-cols-3 gap-5 mb-5">
                    {editMode && user?.company?.name ? (
                        <Input type="text" name="company_id" title="شرکت" value={user?.company?.name} autoComplete="off" required={false} disabled />
                    ) : null}
                    <Input type="text" name="first_name" title="نام" formik={formik} autoComplete="off" />
                    <Input type="text" name="last_name" title="نام خانوادگی" formik={formik} autoComplete="off" />
                    <Input type="text" name="phone_number" title="شماره موبایل" formik={formik} autoComplete="off" />
                    <Select title="گروه" name="group_id" formik={formik} options={filteredGroups || []} />
                    <Input type="password" name="password_hash" title="کلمه عبور" formik={formik} autoComplete="new-password" required={!editMode} />
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
