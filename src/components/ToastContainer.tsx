import type { Toast, ToastVariant } from "../hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-emerald-600 text-white ring-emerald-500/30",
  error: "bg-red-600 text-white ring-red-500/30",
  info: "bg-espresso text-white ring-espresso/30",
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[500] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ring-1 ${variantStyles[toast.variant]} animate-[slideUp_0.3s_ease-out]`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
