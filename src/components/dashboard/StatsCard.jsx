import Card from '../ui/Card';

export default function StatsCard({ icon: Icon, label, value, change, color = 'primary' }) {
  const colors = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-600', ring: 'ring-primary-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  };

  const c = colors[color];

  return (
    <Card className="p-6 group" hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
          {change != null && (
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                change > 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : change < 0
                  ? 'bg-red-50 text-red-500'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change)}%
              </span>
              <span className="text-[11px] text-gray-400">vs last week</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.bg} ${c.text} ring-1 ${c.ring} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
