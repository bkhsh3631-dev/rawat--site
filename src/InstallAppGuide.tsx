import { useState } from "react";
import { Download, Check, Copy } from "lucide-react";

export function InstallAppGuide({ showLabel = true }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const textToCopy = `طريقة تثبيت «منصة روعة الحياة مع علم الأحياء»:
1) افتح الرابط في متصفح كروم أو سفاري.
2) اضغط على زر القائمة أو المشاركة.
3) اختر «إضافة إلى الشاشة الرئيسية» أو «تثبيت التطبيق».`;

    const copyText = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium shadow-md transition-all cursor-pointer"
            >
                <Download className="w-4 h-4" />
                {showLabel && <span>ثبّت التطبيق</span>}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-gray-200 dark:border-gray-800">
                        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                            أضف المنصة إلى شاشتك الرئيسية 📱
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            استخدم المنصة كتطبيق مستقل على جوالك بخطوات بسيطة.
                        </p>

                        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex gap-2 items-start">
                                <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                                <p>افتح الموقع في متصفح <b>Chrome</b> (للأندرويد) أو <b>Safari</b> (للآيفون).</p>
                            </div>
                            <div className="flex gap-2 items-start">
                                <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                                <p>اضغط على زر القائمة (النقاط الثلاث) أو زر المشاركة.</p>
                            </div>
                            <div className="flex gap-2 items-start">
                                <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                                <p>اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.</p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={copyText}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-xl text-sm font-medium transition"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? "تم النسخ" : "نسخ الخطوات"}
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
