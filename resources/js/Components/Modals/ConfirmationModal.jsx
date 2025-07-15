import {
    AlertTriangle,
    CheckCircle,
    ShieldAlert,
    X,
    XCircle,
} from "lucide-react";
import Button from "../Buttons/Button";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmVariant = "primary",
    confirmText = "Konfirmasi",
    cancelText = "Batal",
}) {
    if (!isOpen) {
        return null;
    }

    const themeIcons = {
        primary: <ShieldAlert className="size-12 text-primary" />,
        success: <CheckCircle className="text-green-600 size-12" />,
        warning: <AlertTriangle className="text-yellow-500 size-12" />,
        danger: <XCircle className="text-red-600 size-12" />,
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center transition-opacity bg-black/60"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg p-8 m-4 transition-all transform bg-white shadow-xl rounded-2xl dark:bg-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute text-gray-400 top-4 right-4 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X className="size-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{themeIcons[confirmVariant]}</div>
                    <h3
                        className="text-xl font-bold text-gray-900 dark:text-gray-100"
                        id="modal-title"
                    >
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-base text-gray-500 dark:text-gray-400">
                            {children}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        label={cancelText}
                        className="w-full"
                    />
                    <Button
                        type="button"
                        variant={confirmVariant}
                        onClick={onConfirm}
                        label={confirmText}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
