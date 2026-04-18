const MAX_LENGTH = 1000;

export default function MessageComposer({ value, onChange }) {
  const percentage = value.length / MAX_LENGTH;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
          rows={6}
          placeholder="Type your broadcast message here..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none transition-all bg-gray-50/50 focus:bg-white"
        />
      </div>
      <div className="flex justify-between mt-2">
        <p className="text-[11px] text-gray-400 font-medium">Supports plain text only</p>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentage > 0.9 ? 'bg-red-500' : percentage > 0.7 ? 'bg-amber-500' : 'bg-primary-500'
              }`}
              style={{ width: `${percentage * 100}%` }}
            />
          </div>
          <p className={`text-[11px] font-semibold ${
            percentage > 0.9 ? 'text-red-500' : percentage > 0.7 ? 'text-amber-500' : 'text-gray-400'
          }`}>
            {value.length}/{MAX_LENGTH}
          </p>
        </div>
      </div>
    </div>
  );
}
