import React, { useState } from 'react';
import { Briefcase, Plus, Globe, Server, Code, ShieldAlert, CheckCircle, Trash2, Edit } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState([
    { id: 'a-1', name: 'api.banking-system.com', type: 'API', ip: '192.168.1.100', vulns: 5, status: 'Active' },
    { id: 'a-2', name: 'portal.company.com', type: 'Domain', ip: '104.21.45.12', vulns: 3, status: 'Active' },
    { id: 'a-3', name: 'k8s-cluster-prod', type: 'Cloud Service', ip: '10.0.4.15', vulns: 1, status: 'Active' },
    { id: 'a-4', name: 'mobile-auth-endpoint', type: 'Subdomain', ip: '172.16.0.4', vulns: 0, status: 'Verified' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Domain');
  const [newIp, setNewIp] = useState('');

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAssets(prev => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        name: newName,
        type: newType,
        ip: newIp || 'Auto-Detected',
        vulns: 0,
        status: 'Active'
      }
    ]);
    setNewName('');
    setNewIp('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            Assets Inventory & Management (إدارة وتتبع الأصول الرقمية)
          </h2>
          <p className="text-xs text-slate-400 mt-1">سجل كامل لجميع أصول الشركة (Domains, Subdomains, IPs, Cloud Services, APIs)</p>
        </div>

        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> إضافة أصل جديد (Add Asset)
        </Button>
      </div>

      {/* ASSETS DATA TABLE */}
      <Card variant="cyber" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#070B14] border-b border-slate-800 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-4">Asset Name (اسم الأصل)</th>
                <th className="p-4">Type (النوع)</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Vulnerabilities</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0D111C]">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-4 font-bold text-white font-mono">{asset.name}</td>
                  <td className="p-4 font-mono text-cyan-400">{asset.type}</td>
                  <td className="p-4 font-mono text-slate-300">{asset.ip}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold ${asset.vulns > 0 ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      {asset.vulns} Active
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="success">{asset.status}</Badge>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setAssets(assets.filter(a => a.id !== asset.id))}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD ASSET MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D111C] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">إضافة أصل أمني جديد</h3>
            <form onSubmit={handleAddAsset} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">اسم الأصل أو النطاق</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. api.company.com"
                  className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">نوع الأصل</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="Domain">Domain</option>
                  <option value="Subdomain">Subdomain</option>
                  <option value="IP">IP Address</option>
                  <option value="Cloud Service">Cloud Service</option>
                  <option value="API">API Endpoint</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">عنوان IP (اختياري)</label>
                <input
                  type="text"
                  value={newIp}
                  onChange={e => setNewIp(e.target.value)}
                  placeholder="e.g. 192.168.1.1"
                  className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="text-xs">إلغاء</Button>
                <Button type="submit" className="bg-cyan-600 text-white font-bold text-xs">حفظ الأصل</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
