import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface Step {
    title: string;
}

interface StepperProps {
    steps: Step[];
    current: number;
}

export function Stepper({ steps, current }: StepperProps) {
    return (
        <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => {
                const isActive = index === current - 1;
                const isDone = index < current - 1;

                return (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div
                            className={cn(
                                "size-9 rounded-full flex items-center justify-center border-4 transition-all pt-1 z-40",
                                isActive && "bg-white border-primary text-primary",
                                isDone && "bg-primary text-white border-primary pt-0",
                                !isActive && !isDone && "bg-white border-gray-300 text-secondary",
                            )}
                        >
                            {isDone ? <CheckCircle2 /> : index + 1}
                        </div>

                        <span
                            className={cn(
                                "mt-2 text-sm",
                                isActive && "text-primary font-medium",
                                isDone && "text-primary",
                                !isActive && !isDone && "text-secondary",
                            )}
                        >
                            {step.title}
                        </span>

                        {index <= steps.length - 1 && (
                            <div
                                className={cn(
                                    "h-1 -mt-12",
                                    isDone ? "bg-primary" : "bg-gray-300",
                                    [0, steps.length - 1].includes(index) ? "w-1/2" : "w-full",
                                    index === 0 ? "mr-auto" : "",
                                    index === steps.length - 1 ? "ml-auto" : "",
                                )}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
