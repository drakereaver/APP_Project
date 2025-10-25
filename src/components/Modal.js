import React, { useEffect } from "react";

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl transform rounded-xl border border-white/10 bg-[#0D1117] p-4 shadow-xl transition-all duration-200 ease-out sm:p-6"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 150ms ease-out" }}
      >
        {title ? <h3 className="mb-4 text-lg font-semibold text-teal-300">{title}</h3> : null}
        <div className="space-y-4">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
      <style>{`@keyframes modalIn{from{opacity:.5;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}
