import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import AgentCard from '../components/agents/AgentCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [confirmAgent, setConfirmAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw new Error(error.message);

      const mapped = (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        status: row.status || 'inactive',
        phone: row.phone || '',
        lastActive: row.last_active || 'Never',
        messagesHandled: row.messages_handled || 0,
      }));

      setAgents(mapped);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleToggle = (agent) => {
    setConfirmAgent(agent);
  };

  const confirmToggle = async () => {
    if (!confirmAgent) return;
    setToggling(true);

    const newStatus = confirmAgent.status === 'active' ? 'inactive' : 'active';

    try {
      const { error } = await supabase
        .from('agents')
        .update({ status: newStatus, last_active: 'Just now' })
        .eq('id', confirmAgent.id);

      if (error) throw new Error(error.message);

      setAgents((prev) =>
        prev.map((a) =>
          a.id === confirmAgent.id
            ? { ...a, status: newStatus, lastActive: 'Just now' }
            : a
        )
      );

      toast.success(
        `${confirmAgent.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
        { duration: 3000 }
      );
    } catch (err) {
      console.error('Failed to update agent:', err);
      toast.error('Failed to update agent status');
    } finally {
      setToggling(false);
      setConfirmAgent(null);
    }
  };

  const activeCount = agents.filter((a) => a.status === 'active').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 size={32} className="text-primary-400 animate-spin mb-3" />
        <p className="text-sm text-gray-400 font-medium">Loading agents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-semibold text-primary-700">{activeCount} Active</span>
          </div>
          <span className="text-sm text-gray-400">of {agents.length} agents</span>
        </div>
        <button
          onClick={fetchAgents}
          className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 font-medium">No agents found</p>
          <p className="text-[13px] text-gray-300 mt-1">Add agents in your Supabase database</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onToggle={handleToggle} />
          ))}
        </div>
      )}

      <Modal
        open={!!confirmAgent}
        onClose={() => setConfirmAgent(null)}
        title="Confirm Action"
      >
        {confirmAgent && (
          <div>
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                confirmAgent.status === 'active'
                  ? 'bg-red-50 text-red-500'
                  : 'bg-emerald-50 text-emerald-500'
              }`}>
                {confirmAgent.status === 'active' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Are you sure you want to{' '}
                  <span className="font-bold text-gray-900">
                    {confirmAgent.status === 'active' ? 'deactivate' : 'activate'}
                  </span>{' '}
                  <span className="font-bold text-gray-900">{confirmAgent.name}</span>?
                </p>
                {confirmAgent.status === 'active' && (
                  <p className="text-[13px] text-gray-400 mt-1.5">
                    This will stop the agent from handling WhatsApp messages.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmAgent(null)}>Cancel</Button>
              <Button
                variant={confirmAgent.status === 'active' ? 'danger' : 'success'}
                onClick={confirmToggle}
                disabled={toggling}
              >
                {toggling ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  confirmAgent.status === 'active' ? 'Deactivate' : 'Activate'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
