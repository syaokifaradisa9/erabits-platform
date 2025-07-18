import { Link } from "@inertiajs/react";

export default function Button({
    label,
    type = "button",
    onClick,
    className = "",
    isLoading,
    icon,
    href,
    target,
    disabled,
    variant = "primary",
    ...props
}) {
    const renderContent = () => (
        <>
            {isLoading && (
                <svg
                    className="mr-2 -ml-1 text-white animate-spin size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {!isLoading && icon && <span className="mr-2">{icon}</span>}
            <span className="text-sm font-medium">
                {isLoading ? "Loading..." : label}
            </span>
        </>
    );

    const variantClasses = {
        primary:
            "bg-primary text-white hover:bg-darkprimary focus:ring-blue-300 dark:focus:ring-blue-800",
        secondary:
            "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-800",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-900",
        success:
            "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300 dark:focus:ring-green-800",
        warning:
            "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300 dark:focus:ring-yellow-800",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-200/50 dark:text-gray-300 dark:hover:bg-gray-700/50 focus:ring-transparent",
    };

    const baseClasses = `
        inline-flex items-center justify-center
        px-5 py-2.5
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-4
        ${
            isLoading || disabled
                ? "bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400"
                : variantClasses[variant]
        }
        ${className}
    `.trim();

    if (href) {
        if (href.startsWith("http") || target === "_blank") {
            return (
                <a
                    href={href}
                    target={target}
                    rel={
                        target === "_blank" ? "noopener noreferrer" : undefined
                    }
                    className={baseClasses}
                    {...props}
                >
                    {renderContent()}
                </a>
            );
        }

        return (
            <Link href={href} className={baseClasses} {...props}>
                {renderContent()}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={!isLoading && !disabled ? onClick : undefined}
            className={baseClasses}
            disabled={isLoading || disabled}
            {...props}
        >
            {renderContent()}
        </button>
    );
}
