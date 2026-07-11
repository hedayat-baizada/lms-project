import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Flash = {
    message?: string | null;
    success?: string | null;
    error?: string | null;
    warning?: string | null;
};

export default function FlashToast() {
    const { flash } = usePage<{ flash: Flash }>().props;

    const [visible, setVisible] = useState(false);

    const text =
    flash.success ||
    flash.error ||
    flash.warning ||
    flash.message;

const type = flash.error
    ? 'error'
    : flash.warning
      ? 'warning'
      : 'success';

    useEffect(() => {
        if (!text) return;

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [text]);

    if (!text || !visible) {
        return null;
    }

    return (
        <div className="fixed right-6 top-6 z-50">
            <div
                className={`rounded-2xl px-5 py-4 shadow-xl ${
                type === 'error'
                    ? 'bg-red-600 text-white'
                    : type === 'warning'
                    ? 'bg-orange-500 text-white'
                    : 'bg-green-600 text-white'
            }`}
            >
                <div className="flex items-start gap-3">
                    <span className="text-xl">
                        {type === 'error'
                        ? '❌'
                        : type === 'warning'
                        ? '🟠'
                        : '✅'}
                    </span>

                    <div>
                        <p className="font-semibold">
                          {type === 'error'
                        ? 'Rejected'
                        : type === 'warning'
                        ? 'Correction Requested'
                        : 'Success'}
                        </p>

                        <p className="text-sm opacity-90">
                            {text}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setVisible(false)}
                        className="ml-4 text-white/80 hover:text-white"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}