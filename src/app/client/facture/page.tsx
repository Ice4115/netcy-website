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
  pdf_url?: string;
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
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Mes <span className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Factures</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Gérez et consultez toutes vos factures</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
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
              <h3 className="text-gray-400 font-semibold">En Attente</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{pendingAmount.toFixed(2)} €</p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-4 mb-6 md:mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Toutes ({invoices.length})
          </button>
          <button
            onClick={() => setFilter('payee')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${
              filter === 'payee'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            Payées ({invoices.filter(i => i.statut === 'payee').length})
          </button>
          <button
            onClick={() => setFilter('en_attente')}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${
              filter === 'en_attente'
                ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] text-white'
                : 'bg-[#060010] border border-[#392e4e] text-gray-400 hover:text-white'
            }`}
          >
            En Attente ({invoices.filter(i => i.statut === 'en_attente').length})
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#060010]">
                <tr className="border-b border-[#392e4e]">
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Date</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Projet</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Montant</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Statut</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Échéance</th>
                  <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-gray-400 font-semibold text-xs sm:text-sm">Actions</th>
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
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-xs sm:text-sm">
                        {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-white font-semibold text-xs sm:text-sm">
                        {invoice.projects?.titre || 'N/A'}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-white font-bold text-xs sm:text-sm">
                        {invoice.montant.toFixed(2)} €
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6">
                        <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-1 sm:gap-2 ${
                          invoice.statut === 'payee'
                            ? 'bg-green-400/10 text-green-400'
                            : 'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {invoice.statut === 'payee' ? (
                            <>
                              <CheckCircle size={14} className="hidden sm:inline" />
                              Payée
                            </>
                          ) : (
                            <>
                              <Clock size={14} className="hidden sm:inline" />
                              <span className="hidden sm:inline">En Attente</span>
                              <span className="sm:hidden">Attente</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-xs sm:text-sm">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6">
                        {invoice.pdf_url ? (
                          <a 
                            href={invoice.pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-[#6F3FFF]/20 hover:bg-[#6F3FFF]/30 text-[#8FA5FF] rounded-lg transition border border-[#6F3FFF]/50 text-xs sm:text-sm"
                          >
                            <Download size={14} />
                            PDF
                          </a>
                        ) : (
                          <span className="text-gray-500 text-xs sm:text-sm">Non disponible</span>
                        )}
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
