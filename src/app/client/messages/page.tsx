'use client';

import { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Mail, MailOpen, Clock } from 'lucide-react';

interface Message {
  id: string;
  sujet: string;
  contenu: string;
  lu: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (messageId: string) => {
    const user = await getCurrentUser();
    if (!user) return;

    await supabase
      .from('messages')
      .update({ lu: true })
      .eq('id', messageId)
      .eq('client_id', user.id);

    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, lu: true } : msg
    ));
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.lu) {
      markAsRead(message.id);
    }
  };

  const unreadCount = messages.filter(m => !m.lu).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Mes <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Messages</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {unreadCount > 0 ? (
              <>Vous avez <span className="text-[#6F3FFF] font-semibold">{unreadCount}</span> nouveau{unreadCount > 1 ? 'x' : ''} message{unreadCount > 1 ? 's' : ''}</>
            ) : (
              'Tous vos messages sont lus'
            )}
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-12 text-center">
            <Mail className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-400 text-lg">Aucun message pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedMessage?.id === message.id
                      ? 'bg-gradient-to-r from-[#6F3FFF]/20 to-[#7A8FFF]/20 border-[#6F3FFF]'
                      : message.lu
                      ? 'bg-[#060010] border-[#392e4e] hover:border-[#6F3FFF]/50'
                      : 'bg-[#0f0a20] border-[#6F3FFF]/50 hover:border-[#6F3FFF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.lu ? (
                      <MailOpen className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                    ) : (
                      <Mail className="text-[#6F3FFF] flex-shrink-0 mt-1" size={20} />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold mb-1 truncate ${
                        message.lu ? 'text-gray-300' : 'text-white'
                      }`}>
                        {message.sujet}
                      </h3>
                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(message.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {!message.lu && (
                      <div className="w-2 h-2 bg-[#6F3FFF] rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-8">
                  <div className="mb-6 pb-6 border-b border-[#392e4e]">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-3xl font-bold text-white">{selectedMessage.sujet}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedMessage.lu 
                          ? 'bg-gray-400/10 text-gray-400' 
                          : 'bg-[#6F3FFF]/20 text-[#6F3FFF]'
                      }`}>
                        {selectedMessage.lu ? 'Lu' : 'Nouveau'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock size={16} />
                      {new Date(selectedMessage.created_at).toLocaleString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.contenu}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-12 flex flex-col items-center justify-center h-full">
                  <Mail className="text-gray-400 mb-4" size={64} />
                  <p className="text-gray-400 text-lg">Sélectionnez un message pour le lire</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
