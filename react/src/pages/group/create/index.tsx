import Button from "@/components/shared/Button";
import Input from "@/components/shared/inputs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import validationSchema from "./validationSchema";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Checkbox from "@/components/shared/inputs/Checkbox";

export default function CreateGroup({ editMode = 0 }: { editMode?: number }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRoles = async () => {
        const res = await api("user/roles");
        setRoles(res);
    };

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        onSubmit,
        validationSchema,
        validateOnChange: true,
        enableReinitialize: true,
        validateOnMount: true,
    });

    const fetchGroup = async () => {
        setLoading(true);
        const res = await api(`group/${id}`, "GET");

        if (res?.success) {
            const selectedRoles = JSON.parse(res?.data?.roles || "[]");
            const data = res?.data;

            selectedRoles.forEach((role: any) => (data[role] = true));

            formik.setValues(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchRoles();

        if (editMode && id) fetchGroup();
    }, [id, editMode]);

    function onSubmit(data: any) {
        const selectedRoles = Object.entries(data)
            .filter(([key, value]: [any, any]) => !isNaN(key) && value)
            .map((list: any) => list[0]);

        setLoading(true);

        api(editMode ? `group/${id}` : "group", editMode ? "PATCH" : "POST", { name: data.name, roles: JSON.stringify(selectedRoles) })
            .then((res) => {
                if (res?.success) {
                    toast.success("گروه با موفقیت ثبت شد.");
                    navigate("/group");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card className="w-full">
            <CardHeader className="mb-5">
                <CardTitle>{editMode ? "ویرایش گروه" : "ثبت گروه جدید"}</CardTitle>
                <CardDescription>تکمیل فیلدهایی که با * مشخص شده اند الزامی می باشد</CardDescription>
            </CardHeader>

            <CardContent>
                <form className="w-full flex flex-col gap-4 mb-5">
                    <Input type="text" name="name" title="نام" formik={formik} autoComplete="off" />
                    <div className="flex flex-col gap-5">
                        <p>دسترسی ها</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 h-[46vh] overflow-y-auto pl-3">
                            {roles.map((role: any, index: number) => (
                                <div key={index} className="flex flex-col gap-2 rounded-md p-3 border">
                                    <p className="pb-2 mb-1 border-b border-gray-300">{role.name}</p>
                                    <div className="flex flex-col gap-2">
                                        {role.children.map((child: any) => (
                                            <>
                                                {child?.indent ? (
                                                    <div className={`mr-${7 * child?.indent}`}>
                                                        {child.has_child && <p className="text-[0.8rem] my-1.5">{child.name}</p>}
                                                        <div className={`mr-${7 * child?.indent}`}>
                                                            <Checkbox key={child.id} title={child.name} name={child.id.toString()} formik={formik} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Checkbox key={child.id} title={child.name} name={child.id.toString()} formik={formik} />
                                                )}
                                            </>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
