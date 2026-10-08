interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset" | undefined;
}

const Button = ({ children, onClick, isLoading = false, disabled = false, className = "", type = "button" }: Props) => {
    return (
        <button
            type={type}
            className={`flex items-center justify-center gap-2 px-6 py-3 bg-[#222529] text-white rounded hover:bg-[#343a40] cursor-pointer transition-all text-sm w-full h-10 ${className} ${isLoading || disabled ? "opacity-50 cursor-default!" : ""}`}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? <span className="size-5 rounded-full border border-white border-l-transparent animate-spin" /> : children}
        </button>
    );
};

export default Button;
