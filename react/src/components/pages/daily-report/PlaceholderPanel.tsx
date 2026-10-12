/**
 * جای‌گیرِ تب‌هایی که هنوز ساخته نشده‌اند.
 *
 * ایشوی ۸ «فعالیت‌ها» و ایشوی ۹ پنج جدول زیرمجموعه + «پیش‌نمایش» را می‌سازد و
 * در `panels.tsx` جایگزین این کامپوننت می‌شوند.
 */
export default function PlaceholderPanel({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md py-14">
            <p className="text-sm font-medium text-[#777777]">بخش «{title}»</p>
            <p className="text-xs text-[#777777]">در مرحله‌ی بعدی ساخته می‌شود</p>
        </div>
    );
}
