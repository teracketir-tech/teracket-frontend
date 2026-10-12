interface Props {
    text: string;
}

/**
 * پیامِ حالتِ خالی/پیش‌نیازِ نرسیده در همه‌ی تب‌های گزارش روزانه —
 * متن توسط خودِ تب داده می‌شود تا یک متن کپی‌نشده در چند جا نباشد.
 */
export default function Notice({ text }: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md py-10">
            <p className="text-xs text-[#777777]">{text}</p>
        </div>
    );
}
