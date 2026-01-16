'use client';

import { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { FileText, CheckCircle, Clock, Download } from 'lucide-react';

interface Invoice {
  id: string;
  montant: number;
  statut: string;
  created_at: string;
  due_date: string;
  projects?: {
    titre: string;
  };
}

export default function FacturePage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const fetchInvoices = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('invoices')
      .select(`
        *,
        projects (
          titre
        )
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setInvoices(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(i => i.statut === filter);

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.montant, 0);
  const paidAmount = invoices.filter(i => i.statut === 'payee').reduce((sum, inv) => sum + inv.montant, 0);
  const pendingAmount = totalAmount - paidAmount;

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
            Mes <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Factures</span>
          </h1>
          <p className="text-gray-400 text-lg">Gérez et consultez toutes vos factures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="text-[#6F3FFF]" size={24} />
              <h3 className="text-gray-400 font-semibold">Montant Total</h3>
            </div>
            <p className="text-3xl font-bold text-white">{totalAmount.toFixed(2)} €</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-green-400" size={24} />
              <h3 className="text-gray-400 font-semibold">Payé</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">{paidAmount.toFixed(2)} €</p>
          </div>

          <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="text-yellow-400" size={24} />
              <h3 className="text-gray-400 font-semibold">En attente</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{pendingAmount.toFixed(2)} €</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Toutes ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('payee')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'payee'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Payées ({invoices.filter(i => i.statut === 'payee').length})
          </button>
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              filter === 'en_attente'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            En attente ({invoices.filter(i => i.statut === 'en_attente').length})
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#060010]">
                <tr className="border-b border-[#392e4e]">
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Date</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Projet</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Montant</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Statut</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Échéance</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      Aucune facture dans cette catégorie
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className="border-b border-[#392e4e]/50 hover:bg-[#060010]/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-300">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6 text-white font-semibold">
                        {invoice.projects?.titre || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-white font-bold">
                        {invoice.montant.toFixed(2)} €
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 ${
                          invoice.statut === 'payee'
                            ? 'bg-green-400/10 text-green-400'
                            : 'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {invoice.statut === 'payee' ? (
                            <>
                              <CheckCircle size={16} />
                              Payée
                            </>
                          ) : (
                            <>
                              <Clock size={16} />
                              En attente
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#6F3FFF]/20 hover:bg-[#6F3FFF]/30 text-[#8FA5FF] rounded-lg transition border border-[#6F3FFF]/50">
                          <Download size={16} />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
