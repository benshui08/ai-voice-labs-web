'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAdminBullBearConfig,
  updateAdminBullBearConfig,
  getAdminBullBearStats,
  getAdminBullBearRounds,
  type AdminBullBearConfig,
  type AdminBullBearStats,
  type AdminBullBearRound,
} from '@/actions/admin/bull-bear';

export default function BullBearAdminPage() {
  const [config, setConfig] = useState<AdminBullBearConfig | null>(null);
  const [stats, setStats] = useState<AdminBullBearStats | null>(null);
  const [rounds, setRounds] = useState<AdminBullBearRound[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [roundsLoading, setRoundsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [statusFilter, setStatusFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [configData, statsData] = await Promise.all([
          getAdminBullBearConfig(),
          getAdminBullBearStats(),
        ]);
        setConfig(configData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load bull bear data:', error);
      }
    })();
  }, []);

  const loadRounds = useCallback(async () => {
    setRoundsLoading(true);
    try {
      const result = await getAdminBullBearRounds({
        page,
        pageSize: 20,
        status: statusFilter || undefined,
        userId: userIdFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setRounds(result.rounds);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to load rounds:', error);
    } finally {
      setRoundsLoading(false);
      setLoading(false);
    }
  }, [page, statusFilter, userIdFilter, startDate, endDate]);

  useEffect(() => {
    loadRounds();
  }, [loadRounds]);

  const resetFilters = () => {
    setStatusFilter('');
    setUserIdFilter('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const result = await updateAdminBullBearConfig(config);
      if (result.success) {
        alert('Configuration saved successfully');
      } else {
        alert('Failed to save: ' + result.error);
      }
    } catch {
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bull or Bear</h1>
        <p className="text-gray-600 mt-1">Game configuration, statistics, and round history</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Rounds', value: stats.totalRounds.toLocaleString() },
            { label: 'Total Bets', value: stats.totalBetAmount.toLocaleString() },
            { label: 'House Profit', value: stats.houseProfit.toLocaleString(), color: stats.houseProfit >= 0 ? 'text-green-600' : 'text-red-600' },
            { label: 'Won / Lost / Draw', value: `${stats.winCount} / ${stats.lossCount} / ${stats.drawCount}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-lg font-bold mt-1 ${stat.color || 'text-gray-900'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Config Form */}
      {config && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="block">
              <span className="text-sm text-gray-600">Enabled</span>
              <select
                value={config.enabled ? 'true' : 'false'}
                onChange={(e) => setConfig({ ...config, enabled: e.target.value === 'true' })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Min Bet</span>
              <input
                type="number"
                value={config.minBet}
                onChange={(e) => setConfig({ ...config, minBet: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Max Bet</span>
              <input
                type="number"
                value={config.maxBet}
                onChange={(e) => setConfig({ ...config, maxBet: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Multiplier 30s</span>
              <input
                type="number"
                step="0.01"
                value={config.multiplier30s}
                onChange={(e) => setConfig({ ...config, multiplier30s: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Multiplier 60s</span>
              <input
                type="number"
                step="0.01"
                value={config.multiplier60s}
                onChange={(e) => setConfig({ ...config, multiplier60s: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Multiplier 120s</span>
              <input
                type="number"
                step="0.01"
                value={config.multiplier120s}
                onChange={(e) => setConfig({ ...config, multiplier120s: Number(e.target.value) })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Durations (JSON)</span>
              <input
                type="text"
                value={config.availableDurations}
                onChange={(e) => setConfig({ ...config, availableDurations: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="flex items-end">
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
              >
                {saving ? 'Saving...' : 'Save Config'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rounds Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Round History ({total})</h2>
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="text-xs text-gray-500">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              >
                <option value="">All</option>
                <option value="won">won</option>
                <option value="lost">lost</option>
                <option value="draw">draw</option>
                <option value="expired">expired</option>
                <option value="active">active</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">User ID</span>
              <input
                type="text"
                value={userIdFilter}
                onChange={(e) => { setUserIdFilter(e.target.value); setPage(1); }}
                placeholder="Search user ID..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">Start Date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              />
            </label>
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">User</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Dir</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Bet</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Entry $</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Settle $</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Profit</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roundsLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                  </td>
                </tr>
              ) : rounds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">No rounds found</td>
                </tr>
              ) : (
                rounds.map((round) => (
                  <tr key={round.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{round.roundId.substring(0, 8)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{round.userId.substring(0, 12)}...</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${round.direction === 'bull' ? 'text-green-600' : 'text-red-600'}`}>
                        {round.direction === 'bull' ? '↑' : '↓'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{round.betAmount}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{round.entryPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{round.settlePrice != null ? round.settlePrice.toFixed(2) : '-'}</td>
                    <td className={`px-4 py-3 text-right font-medium ${(round.profit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {round.profit != null ? round.profit.toFixed(1) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        round.status === 'won' ? 'bg-green-100 text-green-700' :
                        round.status === 'lost' ? 'bg-red-100 text-red-700' :
                        round.status === 'draw' ? 'bg-amber-100 text-amber-700' :
                        round.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {round.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(round.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
