import { toast } from "sonner";

/**
 * خطاهای برگشتی سرور را روی فرم Formik می‌نشاند.
 *
 * سرور دو شکل پاسخ می‌دهد:
 *   { success: false, errors: { فیلد: ["پیام"] } }  → خطای فیلد
 *   { success: false, message: "پیام" }             → پیام عمومی (toast)
 *
 * @returns true اگر پاسخ ناموفق بود و پردازش شد
 */
export function applyApiErrors(res: any, formik: { setFieldError: (field: string, message?: string) => void }): boolean {
    if (!res || res.success !== false) return false;

    const errors = res.errors;

    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
        Object.entries(errors).forEach(([field, message]) => {
            const text = Array.isArray(message) ? message[0] : message;
            formik.setFieldError(field, String(text ?? ""));
        });

        return true;
    }

    if (res.message) toast.error(res.message);

    return true;
}
