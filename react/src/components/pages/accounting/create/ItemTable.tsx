import AccountingDataSelect from "@/components/shared/AccountingDataSelect";
import Input from "@/components/shared/inputs";
import Select from "@/components/shared/inputs/Select";
import Pagination from "@/components/shared/Pagination";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ItemTable({ contacts, banks, items, setItems, formik }: { contacts: any; banks: any; items: any; setItems: any; formik?: any }) {
    const [page, setPage] = useState(1);

    const offset = (page - 1) * 10;

    const formatedRows = items?.slice(offset, page * 10);

    useEffect(() => {
        console.log(page);
    }, [page]);

    return (
        <>
            <div className="w-full flex flex-col items-center border rounded-t-md text-sm">
                <div className="w-full flex items-center justify-center bg-secondary h-10 rounded-t-md">
                    <p className="h-full border-l border-gray-300 w-[5%] flex items-center justify-center">#</p>
                    <p className="h-full border-x border-gray-300 w-1/5 flex items-center justify-center">حساب</p>
                    <p className="h-full border-x border-gray-300 w-1/5 flex items-center justify-center">تفصیل</p>
                    <p className="h-full border-x border-gray-300 w-1/5 flex items-center justify-center">شرح</p>
                    <p className="h-full border-x border-gray-300 w-1/5 flex items-center justify-center">بدهکار (ریال)</p>
                    <p className="h-full border-x border-gray-300 w-1/5 flex items-center justify-center">بستانکار (ریال)</p>
                    <p className="h-full border-r border-gray-300 w-[5%] flex items-center justify-center">عملیات</p>
                </div>

                <div className="w-full">
                    {formatedRows?.map((item: any, index: number) => (
                        <div key={index} className="w-full flex items-center justify-center border h-12">
                            <div className="w-[5%] h-full border-l border-gray-200 flex items-center justify-center">
                                <p>{index + 1 + (page - 1) * 10}</p>
                            </div>

                            <div className="w-1/5 p-2 h-full border-x border-gray-200 flex items-center justify-center">
                                <AccountingDataSelect
                                    title=""
                                    formik={formik}
                                    disableParent={true}
                                    name={`accounting_data_id_${item.id}`}
                                    value={item.accounting_data_id}
                                    onChange={(accounting_data_id: any, acc: any) => {
                                        console.log(acc);

                                        let details = [] as any;

                                        switch (acc?.detail_name) {
                                            case "contact_id":
                                                details = contacts;
                                                break;

                                            case "bank_id":
                                                details = banks;
                                                break;

                                            default:
                                                break;
                                        }

                                        setItems((prev: any) =>
                                            prev.map((p: any) => (p.id == item.id ? { ...p, accounting_data_id, details, detail_id: "" } : p)),
                                        );
                                    }}
                                />
                            </div>

                            <div className="w-1/5 p-2 h-full border-x border-gray-200 flex items-center justify-center">
                                {item?.details?.length > 0 ? (
                                    <Select
                                        title=""
                                        name={`detail_id_${item.id}`}
                                        required={false}
                                        options={item?.details || []}
                                        value={item.detail_id}
                                        onChange={(detail_id: any) =>
                                            setItems((prev: any) => prev.map((p: any) => (p.id == item.id ? { ...p, detail_id } : p)))
                                        }
                                    />
                                ) : (
                                    <p className="text-gray-300">---</p>
                                )}
                            </div>

                            <div className="w-1/5 p-2 h-full border-x border-gray-200 flex items-center justify-center">
                                <Input
                                    title=""
                                    name={`description_${item.id}`}
                                    required={false}
                                    value={item.description}
                                    onChange={(description: any) =>
                                        setItems((prev: any) => prev.map((p: any) => (p.id == item.id ? { ...p, description } : p)))
                                    }
                                />
                            </div>

                            <div className="w-1/5 p-2 h-full border-x border-gray-200 flex items-center justify-center">
                                <Input
                                    type="number"
                                    title=""
                                    name={`debit_${item.id}`}
                                    required={false}
                                    value={item.debit}
                                    onChange={(debit: any) => setItems((prev: any) => prev.map((p: any) => (p.id == item.id ? { ...p, debit } : p)))}
                                />
                            </div>

                            <div className="w-1/5 p-2 h-full border-x border-gray-200 flex items-center justify-center">
                                <Input
                                    type="number"
                                    title=""
                                    name={`credit_${item.id}`}
                                    required={false}
                                    value={item.credit}
                                    onChange={(credit: any) => setItems((prev: any) => prev.map((p: any) => (p.id == item.id ? { ...p, credit } : p)))}
                                />
                            </div>

                            <div className="w-[5%] h-full border-r border-gray-200 flex items-center justify-center">
                                <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        const newItems = items.filter((p: any) => p.id !== item.id);

                                        if (newItems?.slice(offset, page * 10)?.length === 0) setPage(page - 1);

                                        setItems(newItems);
                                    }}
                                >
                                    <Trash2 className="size-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Pagination allowNavigate={false} totalPage={Math.ceil(items?.length / 10)} onPageChange={(p: any) => setPage(p)} />
        </>
    );
}
