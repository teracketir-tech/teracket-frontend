 
export interface FinancialYear {
    id: number;
    year: number;
    status: 0 | 1;
    salary: number;
    coupon: number;
    housing_benefits: number;
    day_count_months: Record<number, number>
    registration_time: string;
}

export interface MonthDay {
    month: number;
    name: string;
    days: number;
}