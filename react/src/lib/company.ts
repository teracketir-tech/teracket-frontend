/**
 * The name of the company an account belongs to, in the one shape both the
 * login picker and the sidebar badge need.
 *
 * Both places ask the same question, so they must not spell the answer twice:
 * the API sends `company_id` + `company_name` and leaves the label of a
 * company-less account to the front end, because only the front end knows
 * that such an account belongs to this very panel.
 */

/** An account without a company is an account of the HQ panel itself. */
export const HQ_LABEL = "HQ";

/** Company name for the badge/picker; an account of this panel reads `HQ`. */
export const companyLabel = (companyId?: number | string | null, companyName?: string | null): string => {
    if (companyId === null || companyId === undefined || companyId === "") return HQ_LABEL;

    return companyName || "نامشخص";
};
