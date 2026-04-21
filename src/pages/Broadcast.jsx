import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import MessageComposer from '../components/broadcast/MessageComposer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Send, Users, CheckSquare, Square, Radio, RefreshCw, Clock, Loader2 } from 'lucide-react';

export default function Broadcast() {
  const [message, setMessage] = useState('');
  const [databaseLeads, setDatabaseLeads] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [leadsError, setLeadsError] = useState('');

  const fetchRecentChats = useCallback(async () => {
    setLoadingLeads(true);
    setLeadsError('');

    try {
      // Calculate 24 hours ago
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('chat_interacted')
        .select('id, name, number, last_message, last_interacted')
        .gte('last_interacted', twentyFourHoursAgo)
        .order('last_interacted', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      const leads = (data || []).map((row) => ({
        id: row.id,
        name: row.name || 'Unknown',
        phone: row.number || '',
        lastMessage: row.last_message || '',
        lastInteracted: row.last_interacted,
        source: 'database',
        selected: false,
      }));

      setDatabaseLeads(leads);
    } catch (err) {
      console.error('Failed to fetch recent chats:', err);
      setLeadsError(err.message || 'Failed to load recent chats');
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentChats();
  }, [fetchRecentChats]);

  const toggleLead = (id) => {
    setDatabaseLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, selected: !l.selected } : l))
    );
  };

  const selectAll = () => {
    const allSelected = databaseLeads.every((l) => l.selected);
    setDatabaseLeads((prev) => prev.map((l) => ({ ...l, selected: !allSelected })));
  };

  const selectedDbLeads = databaseLeads.filter((l) => l.selected);
  const totalRecipients = selectedDbLeads.length;

  const handleSend = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    if (totalRecipients === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setShowConfirm(false);
    setSending(true);
    setProgress(0);

    // Prepare data
    const payload = {
      message,
      leads: selectedDbLeads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        lastMessage: lead.lastMessage,
        lastInteracted: lead.lastInteracted,
      })),
    };

    // Send to n8n webhook (test URL)
    try {
      await fetch(
        'https://leaduapi.app.n8n.cloud/webhook-test/dcf38fa5-23d0-4958-b4dc-aa83d111463f',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      // Simulate progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSending(false);
            toast.success(`Broadcast sent to ${totalRecipients} recipients!`);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 300);
    } catch (err) {
      setSending(false);
      toast.error('Failed to send data to workflow');
    }
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <MessageComposer value={message} onChange={setMessage} />
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* DB Leads selector — live from Supabase */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Users size={14} className="text-primary-600" />
                </div>
                <div>
                  Recent Chats
                  <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                    <Clock size={9} />
                    Last 24 hours
                  </span>
                </div>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchRecentChats}
                  disabled={loadingLeads}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-all cursor-pointer disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw size={14} className={loadingLeads ? 'animate-spin' : ''} />
                </button>
                {databaseLeads.length > 0 && (
                  <button
                    onClick={selectAll}
                    className="text-[11px] text-primary-600 hover:text-primary-700 font-bold cursor-pointer transition-colors"
                  >
                    {databaseLeads.every((l) => l.selected) ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
            </div>

            {loadingLeads ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 size={24} className="text-primary-400 animate-spin mb-2" />
                <p className="text-[12px] text-gray-400 font-medium">Loading recent chats...</p>
              </div>
            ) : leadsError ? (
              <div className="text-center py-8">
                <p className="text-[12px] text-red-500 mb-2">{leadsError}</p>
                <button
                  onClick={fetchRecentChats}
                  className="text-[12px] text-primary-600 hover:text-primary-700 font-semibold cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : databaseLeads.length === 0 ? (
              <div className="text-center py-8">
                <Users size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-[12px] text-gray-400 font-medium">No chats in the last 24 hours</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {databaseLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => toggleLead(lead.id)}
                    className="w-full flex items-center gap-3 py-2.5 px-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-all text-left"
                  >
                    <span className="shrink-0">
                      {lead.selected ? (
                        <CheckSquare size={17} className="text-primary-600" />
                      ) : (
                        <Square size={17} className="text-gray-300" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatTimeAgo(lead.lastInteracted)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{lead.phone}</p>
                      {lead.lastMessage && (
                        <p className="text-[10px] text-gray-400 truncate mt-0.5 italic">
                          "{lead.lastMessage}"
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {databaseLeads.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 text-center">
                  {databaseLeads.length} contact{databaseLeads.length !== 1 ? 's' : ''} active in the last 24h
                </p>
              </div>
            )}
          </Card>

          {/* Send card */}
          <Card className="p-6 relative overflow-hidden">
            {/* Decorative gradient corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full" />

            <div className="relative text-center space-y-4">
              <div>
                <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{totalRecipients}</p>
                <p className="text-[13px] text-gray-500 font-medium mt-1">Total Recipients</p>
              </div>

              <div className="flex justify-center gap-4 text-[11px]">
                {selectedDbLeads.length > 0 && (
                  <span className="text-gray-400 flex items-center gap-1">
                    <Users size={11} />
                    {selectedDbLeads.length} recent chats
                  </span>
                )}
              </div>

              {sending ? (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300 progress-pulse"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Radio size={12} className="text-primary-500 animate-pulse" />
                    <p className="text-[13px] text-gray-500 font-medium">
                      Sending... {Math.min(Math.round(progress), 100)}%
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleSend}
                  className="w-full"
                  disabled={!message.trim() || totalRecipients === 0}
                >
                  <Send size={15} />
                  Send Broadcast
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Broadcast">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            You are about to send a broadcast message to{' '}
            <span className="font-bold text-gray-900">{totalRecipients} recipients</span>.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{message}</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={confirmSend}>
              <Send size={15} />
              Confirm Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

