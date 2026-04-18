export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm ${
        hover ? 'hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/80 transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
