import { useEffect, useState } from "react";
import { loadContactOptions, type ContactOption } from "@/lib/contacts";
import Select from "./inputs/Select";

interface Props {
    name?: any;
    title?: any;
    formik?: any;
    /**
     * "type" (`contact.type`) the contacts must have — the accounting pages keep
     * filtering on it. Ignored when `position` is given (issue 2.3).
     */
    type?: number | null;
    /**
     * Position (`contact.position_id`) the contacts must have — used by the daily
     * report (issue 2.3). When set it replaces the type filter.
     */
    position?: number | null;
    required?: boolean;
    /** When given, the component fetches nothing (a page that already has the list) */
    options?: ContactOption[];
    isLoading?: boolean;
    /** For the read-only case (a submitted report) */
    disabled?: boolean;
}

/**
 * Contact picker. It fetches its own options unless `options` is passed — then
 * it reuses that outer list so no duplicate request is made.
 */
export default function ContactSelect({
    name = "contact_id",
    title = "شخص",
    formik,
    type = 1,
    position = null,
    required = false,
    options,
    isLoading = false,
    disabled = false,
}: Props) {
    const external = options !== undefined;
    const [loading, setLoading] = useState(!external);
    const [contacts, setContacts] = useState<ContactOption[]>([]);

    useEffect(() => {
        if (external) return;

        let alive = true;

        loadContactOptions(type, formik?.values?.company_id, position).then((list) => {
            if (!alive) return;
            setContacts(list);
            setLoading(false);
        });

        return () => {
            alive = false;
        };
    }, [external, type, position, formik?.values?.company_id]);

    return (
        <Select
            name={name}
            title={title}
            formik={formik}
            options={options ?? contacts}
            isLoading={isLoading || loading}
            required={required}
            disabled={disabled}
        />
    );
}
