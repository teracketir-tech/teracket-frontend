// src/components/shared/LoadingOverlay.tsx

import React from 'react';
import { useLoading } from '@/context/LoadingContext';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay() {
    const { isLoading, loadingMessage } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[220px] max-w-[90vw]">
                {/* اسپینر */}
                <div className="relative">
                    <div className="w-14 h-14 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-14 h-14 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                
                {/* پیام */}
                <p className="text-sm font-medium text-gray-700 text-center">
                    {loadingMessage || 'در حال بارگذاری...'}
                </p>
                
                {/* بار پیشرفت متحرک */}
                <div className="w-full max-w-[180px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse w-3/4"></div>
                </div>
            </div>
        </div>
    );
}