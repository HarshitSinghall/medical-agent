import { useState, useEffect } from 'react';
import { Bot, BookOpen, Megaphone, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import StatsCard from '../components/dashboard/StatsCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { knowledgeBase } from '../data/mockData';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const totalArticles = knowledgeBase.length;

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('id, name, status, last_active')
          .order('id', { ascending: true });

        if (error) throw error;

        setAgents(
          (data || []).map((row) => ({
            id: row.id,
            name: row.name,
            status: row.status || 'inactive',
            lastActive: row.last_active || 'Never',
          }))
        );
      } catch (err) {
        console.error('Failed to fetch agents:', err);
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchAgents();
  }, []);

  const activeAgents = agents.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-emerald-800 p-6 sm:p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, Admin 👋</h1>
          <p className="mt-2 text-primary-100/90 text-sm sm:text-base max-w-md">
            Here's a quick overview of your AI agents and knowledge base.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.06] rounded-full" />
        <div className="absolute -bottom-16 -right-8 w-56 h-56 bg-white/[0.04] rounded-full" />
        <div className="absolute top-4 right-32 w-20 h-20 bg-white/[0.05] rounded-full" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          icon={Bot}
          label="Active Agents"
          value={loadingAgents ? '...' : `${activeAgents}/${agents.length}`}
          change={0}
          color="primary"
        />
        <StatsCard icon={BookOpen} label="Knowledge Articles" value={totalArticles} change={5} color="blue" />
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-[15px] font-bold text-gray-900">Agent Status</h3>
            <Link to="/agents" className="text-[13px] font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {loadingAgents ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 size={22} className="text-primary-400 animate-spin mb-2" />
              <p className="text-[12px] text-gray-400">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[12px] text-gray-400">No agents found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      agent.status === 'active' ? 'bg-primary-50' : 'bg-gray-100'
                    }`}>
                      <Bot size={14} className={agent.status === 'active' ? 'text-primary-600' : 'text-gray-400'} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                      <p className="text-[11px] text-gray-400">{agent.lastActive}</p>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'success' : 'neutral'}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    {agent.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-[15px] font-bold text-gray-900">Quick Actions</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <Link to="/broadcast" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50">
                  <Megaphone size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Send Broadcast</p>
                  <p className="text-[11px] text-gray-400">Send messages to your customers</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/knowledge" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50">
                  <BookOpen size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Update Knowledge Base</p>
                  <p className="text-[11px] text-gray-400">Manage articles for your AI agents</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/agents" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary-50">
                  <Bot size={14} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Manage Agents</p>
                  <p className="text-[11px] text-gray-400">Activate or deactivate WhatsApp bots</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
