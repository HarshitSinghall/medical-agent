const variants = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  danger: 'bg-red-50 text-red-700 ring-red-600/10',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  neutral: 'bg-gray-100 text-gray-600 ring-gray-500/10',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ring-inset ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
