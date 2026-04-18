import { MessageSquare, Phone, Clock, Zap } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Toggle from '../ui/Toggle';

export default function AgentCard({ agent, onToggle }) {
  const isActive = agent.status === 'active';

  return (
    <Card className="p-6 relative overflow-hidden" hover>
      {/* Subtle gradient accent for active agents */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-400" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
            isActive
              ? 'bg-gradient-to-br from-primary-50 to-primary-100'
              : 'bg-gray-100'
          }`}>
            <MessageSquare size={20} className={isActive ? 'text-primary-600' : 'text-gray-400'} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-[15px]">{agent.name}</h3>
            <Badge variant={isActive ? 'success' : 'neutral'}>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <Toggle enabled={isActive} onChange={() => onToggle(agent)} />
      </div>

      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{agent.description}</p>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Phone size={13} className="text-gray-400" />
          <span className="text-[11px] text-gray-500 truncate">{agent.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-gray-400" />
          <span className="text-[11px] text-gray-500">{agent.lastActive}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={13} className="text-gray-400" />
          <span className="text-[11px] text-gray-500 font-medium">{agent.messagesHandled.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
