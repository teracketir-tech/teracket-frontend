import { routes } from "@/routes/routes";
import { clsx, type ClassValue } from "clsx";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { DateObject } from "react-multi-date-picker";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatNumber = (number: any, showCurrency = false, fixed?: number | undefined) => {
    if (number?.toString()?.endsWith(".")) return number;

    if (fixed !== undefined) return `${Number(Number(number || 0)?.toFixed(fixed)).toLocaleString()}${showCurrency ? " ریال" : ""}`;

    const arr = number?.toString()?.split(".");

    return `${Number(arr?.[0] || 0)?.toLocaleString()}${arr?.[1] ? `.${arr[1]}` : ""}${showCurrency ? " ریال" : ""}`;
};

export const formatDateToFa = (date: string | DateObject, showTime?: boolean) => {
    const format = showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";

    return new DateObject({
        date,
        format,
        calendar: gregorian,
        locale: gregorian_en,
    })
        .convert(persian, persian_fa)
        .format(showTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD");
};

export const formatDateToEn = (date: string | DateObject, showTime?: boolean) => {
    const format = showTime ? "YYYY/M/D HH:mm" : "YYYY/M/D";

    return new DateObject({
        date,
        format,
        calendar: persian,
        locale: persian_fa,
    })
        .convert(gregorian, gregorian_en)
        .format(showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD");
};

function findRouteTitle(routeList: any, pathname: string) {
    for (const route of routeList) {
        if (route?.items) {
            for (const item of route?.items) {
                if (item.path === pathname && item.title) {
                    return item.title;
                }

                if (item.children?.length) {
                    const found = findRouteTitle(item.children, pathname) as any;
                    if (found) return found;
                }
            }

            //
        } else {
            if (route.path === pathname && route.title) {
                return route.title;
            }

            if (route.children?.length) {
                const found = findRouteTitle(route.children, pathname) as any;
                if (found) return found;
            }
        }
    }

    return "";
}

export function pageTitle() {
    const location = useLocation();
    const normalized = location.pathname.replace(/\/\d+/g, "/:id");

    return findRouteTitle(routes, normalized);
}

export function pathName() {
    const location = useLocation();
    const normalized = location.pathname.replace(/\/\d+/g, "/:id");

    return normalized;
}

export const objectToFormData = (obj: any, formData = new FormData(), parentKey = "", simple = false) => {
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const value = obj[key];

        if (simple) {
            formData.append(key, value);

            // just for order form
        } else {
            const formKey = parentKey ? `${parentKey}[${key}]` : key;

            if (value instanceof File) {
                // File input
                const meta = obj; // parent object contains field_id + field_type
                const fileKey = `extra_file_field_${meta.field_id}_type_${meta.field_type}`;
                formData.append(fileKey, value);
                continue;
            } else if (Array.isArray(value)) {
                // Array handling
                value.forEach((item, index) => {
                    objectToFormData(item, formData, `${formKey}[${index}]`);
                });
            } else if (value !== null && typeof value === "object") {
                // Nested object
                objectToFormData(value, formData, formKey);
            } else {
                // Primitive values
                formData.append(formKey, isNaN(value) || (value?.toString()?.startsWith("0") && value.length === 11) ? value : Number(value));
            }
        }
    }

    return formData;
};

export function in_array(arr: any) {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const roles = JSON.parse(auth?.roles || "[]");

    for (const key in roles) {
        if (arr.includes(Number(roles[key]))) return true;
    }

    return false;
}

export const checkAccess = (access_id: any) => {
    return in_array(access_id);
};

export const persianNumberToEn = (number: any) => {
    const en = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

    const newArray = [] as any;
    const array = number.toString().split("");

    array.forEach((ar: any) => {
        const index = persian.findIndex((p: any) => p == ar);

        if (index == -1) newArray.push(ar);
        else newArray.push(en[index]);
    });

    return newArray.join("");
};

export const truncateByWord = (str: string, maxLen = 30) => {
    if (str.length <= maxLen) return str;

    let trimmed = str.slice(0, maxLen - 1);

    const lastSpace = trimmed.lastIndexOf(" ");

    if (lastSpace > 0) trimmed = trimmed.slice(0, lastSpace);

    return trimmed + "…";
};

export const exportToExcel = async (data: any, columns: any, sheetName: string, fileName: string) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns.map((col: any) => ({
        header: col.header,
        key: col.key,
        width: col.width || 20,
    }));

    data.forEach((item: any) => {
        worksheet.addRow(item);
    });

    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4CAF50" },
    };

    worksheet.eachRow((row: any, rowNumber: number) => {
        row.eachCell((cell: any, colNumber: number) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin", color: { argb: "FFD9D9D9" } },
                bottom: { style: "thin", color: { argb: "FFD9D9D9" } },
                left: { style: "thin", color: { argb: "FFD9D9D9" } },
                right: { style: "thin", color: { argb: "FFD9D9D9" } },
            };
            if (columns[colNumber - 1].key === "مشاهده" && rowNumber > 1) {
                cell.font = { color: { argb: "FF0000FF" }, underline: true };
                cell.value = {
                    text: "مشاهده",
                    hyperlink: data[rowNumber - 2].link,
                };
            }
        });

        if (rowNumber % 2 === 0 && rowNumber > 1) {
            row.eachCell((cell: any) => {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF3F3F3" },
                };
            });
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
};

export const exportAccounting = async (data: any) => {
    const exportData = data.map((item: any) => ({
        id: item.id,
        date_exac: item?.flag == 0 ? "---" : item?.flag == 1 ? "بله" : "خیر",
        created_at: formatDateToFa(item.created_at),
        date: formatDateToFa(item.date),
        approve_date: item?.approve_date ? formatDateToFa(item.approve_date) : "---",
        description: item.description,
        debit: Math.round(item.total_debit).toLocaleString(),
        credit: Math.round(item.total_credit).toLocaleString(),
        status: item.status == 1 ? "پیش‌نویس" : "تایید شده",
        items: item.items
            ?.map(
                (ai: any) =>
                    `${ai?.parents?.length > 0 ? ai?.parents.reverse().join(", ") + ", " : ""}${ai.accountingData.title}${
                        ai.contact?.alias || ai.bank?.name ? ` - ${ai.contact?.alias || ai.bank?.name}` : ""
                    }`,
            )
            .join(" / "),
        company: item?.company?.name || "---",
        user: item?.user ? `${item.user.first_name} ${item.user.last_name}` : "---",
        user_os: item.user_os,
        user_ip: item.user_ip,
    }));

    const columns = [
        { header: "شناسه", key: "id", width: 20 },
        { header: "عدم تطابق تاریخ سند و تاریخ روز", key: "date_exac", width: 40 },
        { header: "تاریخ روز", key: "created_at", width: 20 },
        { header: "تاریخ سند", key: "date", width: 20 },
        { header: "تاریخ تایید", key: "approve_date", width: 20 },
        { header: "شرح", key: "description", width: 50 },
        { header: "مبلغ بدهکار", key: "debit", width: 30 },
        { header: "مبلغ بستانکار", key: "credit", width: 30 },
        { header: "وضعیت", key: "status", width: 15 },
        { header: "حساب/تفضیل", key: "items", width: 30 },
        { header: "شرکت", key: "company", width: 20 },
        { header: "نام ثبت کننده", key: "user", width: 20 },
        { header: "سیستم عامل", key: "user_os", width: 20 },
        { header: "آی پی", key: "user_ip", width: 20 },
    ];

    await exportToExcel(exportData, columns, "Accounting", "Accounting.xlsx");
};

export const exportAccountingItems = async (data: any) => {
    const exportData = data.map((item: any) => ({
        id: item.id,
        date_exac: item?.accounting?.flag == 0 ? "---" : item?.accounting?.flag == 1 ? "بله" : "خیر",
        created_at: formatDateToFa(item?.accounting?.created_at),
        date: formatDateToFa(item?.accounting?.date),
        accounting_id: item.accounting_id,
        accounting_data: item?.accountingData?.title,
        description: item.description,
        bank_id: item?.bank?.name || "---",
        contact_id: item?.contact?.alias || "---",
        company: item?.company?.name || "---",
        debit: item.debit,
        credit: item.credit,
        total: item.total,
    }));

    const columns = [
        { header: "شناسه", key: "id", width: 20 },
        { header: "عدم تطابق تاریخ سند و تاریخ روز", key: "date_exac", width: 40 },
        { header: "تاریخ روز", key: "created_at", width: 20 },
        { header: "تاریخ سند", key: "date", width: 20 },
        { header: "شناسه سند", key: "accounting_id", width: 20 },
        { header: "حساب", key: "accounting_data", width: 20 },
        { header: "شرح", key: "description", width: 50 },
        { header: "نام بانک", key: "bank_id", width: 20 },
        { header: "نام شخص", key: "contact_id", width: 20 },
        { header: "شرکت", key: "company", width: 20 },
        { header: "مبلغ بدهکار", key: "debit", width: 30 },
        { header: "مبلغ بستانکار", key: "credit", width: 30 },
        { header: "مجموع", key: "total", width: 30 },
    ];

    await exportToExcel(exportData, columns, "Accounting Items", "AccountingItems.xlsx");
};

export const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

export const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
