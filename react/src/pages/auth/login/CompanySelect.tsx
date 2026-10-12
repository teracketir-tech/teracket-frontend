import { CheckIcon } from "lucide-react";
import { companyLabel } from "@/lib/company";
import type { LoginCompany } from "./types";

interface Props {
    companies: LoginCompany[];
    selectedId: number | null;
    onSelect: (userId: number) => void;
    onBack: () => void;
}

/**
 * The company list shown when one phone holds several accounts this panel
 * admits.
 *
 * The password never appears here - it was proved against the phone itself on
 * the previous screen - so the list only has to say which company the attempt
 * should land in. It stays on screen after the choice so the row can be
 * switched before the login is fired.
 */
export default function CompanySelect({ companies, selectedId, onSelect, onBack }: Props) {
    return (
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-1">
                <p className="text-sm font-bold">با کدام شرکت وارد میشوید</p>
                <p className="text-xs text-muted-foreground">شرکت مورد نظر را انتخاب کنید و روی ورود بزنید</p>
            </div>

            <div className="flex flex-col gap-2">
                {companies.map((company) => {
                    const isActive = company.user_id === selectedId;

                    return (
                        <button
                            key={company.user_id}
                            type="button"
                            onClick={() => onSelect(company.user_id)}
                            className={`flex items-center justify-between rounded border px-3 py-2 text-sm transition-all cursor-pointer ${
                                isActive ? "border-primary text-primary bg-primary/5" : "border-secondary hover:border-primary"
                            }`}
                        >
                            <span>{companyLabel(company.company_id, company.company_name)}</span>
                            {isActive && <CheckIcon className="size-4" />}
                        </button>
                    );
                })}
            </div>

            <button type="button" onClick={onBack} className="self-start underline text-blue-600 text-[0.8rem] cursor-pointer">
                انتخاب شماره موبایل دیگر
            </button>
        </div>
    );
}
