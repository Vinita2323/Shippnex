import React, { useState, useEffect, useCallback } from 'react';
import { SuperAdminHeader } from '../components/SuperAdminHeader';
import { superAdminService } from '../../../services/superAdminService';
import { ShieldAlert, Search, Lock, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';

export const SuperAdminAuditLogs = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await superAdminService.getAuditLogs({ page, limit: 30, search });
        if (res.success) {
          setLogs(res.logs || []);
          setTotal(res.total || 0);
          setPages(res.pages || 1);
        }
      } catch (err) {
        console.error('Fetch audit logs error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="min-h-screen bg-[#020909] text-slate-100 flex flex-col font-sans">
      <SuperAdminHeader
        title="Immutable Financial Audit Trail"
        subtitle="Tamper-proof chronological log of all sensitive monetary operations, payout decisions, and commission mutations"
        onRefresh={() => fetchLogs(true)}
        refreshing={refreshing}
      />

      <div className="p-6 space-y-5 flex-1 max-w-7xl mx-auto w-full">
        {/* Notice & Search */}
        <div className="bg-[#051716] border border-emerald-950 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Log ID, Actor, Entity ID, Remarks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#020b0b] border border-emerald-950 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <Lock size={13} />
            <span>Append-Only Immutable Records</span>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-[#051716] border border-emerald-950/90 rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#03100f] border-b border-emerald-950 text-slate-400 uppercase tracking-wider font-mono text-[10.5px]">
                <th className="py-3.5 px-4 font-bold">Log ID</th>
                <th className="py-3.5 px-4 font-bold">Action</th>
                <th className="py-3.5 px-4 font-bold">Authorized By</th>
                <th className="py-3.5 px-4 font-bold">Target Entity</th>
                <th className="py-3.5 px-4 font-bold">Target ID</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Remarks</th>
                <th className="py-3.5 px-4 font-bold">Timestamp</th>
                <th className="py-3.5 px-4 font-bold text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">Loading audit log entries...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">No financial audit logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-emerald-950/20 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{log.logId}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-[10.5px] font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <div>{log.actorEmail}</div>
                      <span className="text-[10px] text-emerald-400 font-mono">{log.actorRole}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{log.targetEntity}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">{log.targetId || '—'}</td>
                    <td className="py-3.5 px-4 font-bold font-mono text-white">
                      {log.amount ? `₹${Number(log.amount).toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate">{log.remarks || '—'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 rounded-lg border border-emerald-500/30 cursor-pointer"
                        title="View JSON state diff"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-4 bg-[#03100f] border-t border-emerald-950 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Page <span className="text-white font-bold">{page}</span> of{' '}
              <span className="text-white font-bold">{pages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/40 text-slate-300 border border-emerald-950 hover:bg-emerald-900/60 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/40 text-slate-300 border border-emerald-950 hover:bg-emerald-900/60 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#051716] border border-emerald-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">AUDIT INSPECTION</span>
                <h4 className="text-base font-bold text-white m-0">#{selectedLog.logId}</h4>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-transparent border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-emerald-950">
                <span className="text-slate-400">Action</span>
                <span className="font-bold text-white font-mono">{selectedLog.action}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-950">
                <span className="text-slate-400">Target</span>
                <span className="font-mono text-emerald-400">{selectedLog.targetEntity} #{selectedLog.targetId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-950">
                <span className="text-slate-400">Operator</span>
                <span className="text-slate-200">{selectedLog.actorEmail}</span>
              </div>

              {selectedLog.previousValue && (
                <div className="pt-2">
                  <span className="text-slate-400 font-bold block mb-1">Previous State</span>
                  <pre className="p-2.5 bg-[#020b0b] rounded-xl text-[11px] font-mono text-rose-300 border border-emerald-950 overflow-x-auto m-0">
                    {JSON.stringify(selectedLog.previousValue, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newValue && (
                <div className="pt-2">
                  <span className="text-slate-400 font-bold block mb-1">New State</span>
                  <pre className="p-2.5 bg-[#020b0b] rounded-xl text-[11px] font-mono text-emerald-300 border border-emerald-950 overflow-x-auto m-0">
                    {JSON.stringify(selectedLog.newValue, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-2">
                <span className="text-slate-400 font-bold block mb-1">Remarks</span>
                <p className="p-2 bg-[#020b0b] rounded-xl text-slate-300 border border-emerald-950 m-0">
                  {selectedLog.remarks || 'No remarks'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl border-none cursor-pointer mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
