// src/lib/axios.ts

import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

// ===== متغیرهای سراسری برای لودینگ =====
let loadingContext: any = null;
let activeRequests = 0;

// ===== تابع تنظیم Context =====
export const setLoadingContext = (context: any) => {
    loadingContext = context;
};

// ===== تابع ریست لودینگ =====
export const resetLoading = () => {
    activeRequests = 0;
    if (loadingContext) {
        loadingContext.resetLoading();
    }
};

interface RequestOptions extends AxiosRequestConfig {
    fullUrl?: boolean;
    showLoading?: boolean;      // ← جدید: کنترل نمایش لودینگ
    loadingMessage?: string;    // ← جدید: پیام سفارشی لودینگ
}

export async function api<T = any>(
    url: string,
    method: string = "GET",
    data?: any,
    fullUrl: boolean = false,
    responseType?: AxiosRequestConfig["responseType"],
    contentType: string = "application/json",
    options?: {
        showLoading?: boolean;
        loadingMessage?: string;
    }
): Promise<T> {
    // ===== تنظیمات لودینگ =====
    const showLoading = options?.showLoading !== false; // پیش‌فرض true
    const loadingMessage = options?.loadingMessage || 'در حال بارگذاری...';

    try {
        const token = localStorage.getItem("token");
        const localAuth = JSON.parse(localStorage.getItem("auth") || "{}");

        const isFormData = data instanceof FormData;
        const finalContentType = isFormData ? undefined : contentType;

        let baseUrl = import.meta.env.VITE_API_URL || "";
        let finalUrl = fullUrl ? url : `${baseUrl}${url}`;
        
        if (localAuth?.company_id && !fullUrl) {
            const separator = finalUrl.includes("?") ? "&" : "?";
            finalUrl = `${finalUrl}${separator}company_id=${localAuth.company_id}`;
        }

        // ===== شروع لودینگ =====
        if (showLoading && loadingContext) {
            activeRequests++;
            if (activeRequests === 1) {
                loadingContext.startLoading(loadingMessage);
            }
        }

        const requestOptions: RequestOptions = {
            method,
            url: finalUrl,
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(finalContentType ? { "Content-Type": finalContentType } : {}),
            },
        };

        if (data) {
            requestOptions.data = data;
        }

        if (responseType) requestOptions.responseType = responseType;

        const response: AxiosResponse<T> = await axios(requestOptions);
        
        // ===== پایان لودینگ (موفق) =====
        if (showLoading && loadingContext) {
            activeRequests--;
            if (activeRequests === 0) {
                loadingContext.stopLoading();
            }
        }
        
        return response.data;
        
    } catch (error: any) {
        // ===== پایان لودینگ (خطا) =====
        if (showLoading && loadingContext) {
            activeRequests--;
            if (activeRequests === 0) {
                loadingContext.stopLoading();
            }
        }

        if (url !== "user/login" && error?.response?.status === 401) {
            toast.error("لطفا وارد شوید");
            localStorage.clear();
            window.location.replace("/login");
        } else if (error?.code === 'ECONNABORTED') {
            toast.error('زمان درخواست به پایان رسید');
        } else if (!error?.response) {
            toast.error('خطا در ارتباط با سرور');
        } else {
            toast.error(error?.response?.data?.message || "خطایی رخ داده است. دوباره تلاش کنید");
        }

        throw error?.response?.data || error;
    }
}

// ===== تابع کمکی برای درخواست با لودینگ سفارشی =====
export async function apiWithLoading<T = any>(
    url: string,
    method: string = "GET",
    data?: any,
    loadingMessage: string = 'در حال بارگذاری...',
    fullUrl: boolean = false,
    responseType?: AxiosRequestConfig["responseType"],
    contentType: string = "application/json",
): Promise<T> {
    return api<T>(url, method, data, fullUrl, responseType, contentType, {
        showLoading: true,
        loadingMessage,
    });
}

// ===== تابع کمکی برای درخواست بدون لودینگ =====
export async function apiWithoutLoading<T = any>(
    url: string,
    method: string = "GET",
    data?: any,
    fullUrl: boolean = false,
    responseType?: AxiosRequestConfig["responseType"],
    contentType: string = "application/json",
): Promise<T> {
    return api<T>(url, method, data, fullUrl, responseType, contentType, {
        showLoading: false,
    });
}