// src/pages/hrm/contract/components/shared/FormSection.jsx

export default function FormSection({ title, icon: Icon, children, className = "" }) {
    return (
        <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                {Icon && <Icon className="w-5 h-5 text-blue-500" />}
                <h3 className="text-sm font-bold text-gray-700">{title}</h3>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}