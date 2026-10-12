/** One row a phone holds, exactly as `user/login` sends it to the picker. */
export interface LoginCompany {
    user_id: number;
    company_id: number | null;
    company_name: string | null;
}
