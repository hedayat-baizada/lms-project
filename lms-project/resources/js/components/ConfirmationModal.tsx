type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmColor?: 'green' | 'red' | 'yellow';
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmationModal({
    open,
    title,
    message,
    confirmText,
    confirmColor = 'green',
    loading = false,
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    const colors = {
        green: 'bg-green-600 hover:bg-green-700',
        red: 'bg-red-600 hover:bg-red-700',
        yellow: 'bg-yellow-500 hover:bg-yellow-600',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                <h2 className="text-2xl font-bold">
                    {title}
                </h2>

                <p className="mt-4 text-gray-600">
                    {message}
                </p>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border px-5 py-3"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className={`rounded-xl px-5 py-3 font-semibold text-white disabled:bg-gray-400 ${colors[confirmColor]}`}
                    >
                        {loading ? 'Please wait...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}