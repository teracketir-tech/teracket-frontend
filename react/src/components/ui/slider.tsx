import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * اسلایدر (shadcn/Radix) — ایشوی ۱۱: «درصد پیشرفت» و «کیفیت انجام کار».
 *
 * بر خلاف نسخه‌ی آماده‌ی shadcn، قطعات جدا صادر می‌شوند چون رنگِ بازه بسته به
 * فیلد فرق دارد (پیشرفت تیره، کیفیت سبز-آبی) و باید روی `SliderRange` نشست.
 * ریشه‌ی برنامه در `main.tsx` با `DirectionProvider dir="rtl"` پیچیده شده، پس
 * جهتِ حرکتِ گوی از همان‌جا می‌آید و `dir` دستی لازم نیست.
 */
function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
    return <SliderPrimitive.Root data-slot="slider" className={cn("relative flex w-full touch-none select-none items-center", className)} {...props} />;
}

function SliderTrack({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Track>) {
    return (
        <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn("relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted", className)}
            {...props}
        />
    );
}

function SliderRange({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Range>) {
    return <SliderPrimitive.Range data-slot="slider-range" className={cn("absolute h-full bg-primary", className)} {...props} />;
}

function SliderThumb({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Thumb>) {
    return (
        <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className={cn(
                "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                className,
            )}
            {...props}
        />
    );
}

export { Slider, SliderTrack, SliderRange, SliderThumb };
