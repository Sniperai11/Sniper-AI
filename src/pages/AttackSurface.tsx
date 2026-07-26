import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Globe, Server, Cpu, Network, Search, Filter, 
  ShieldAlert, ShieldCheck, MoreVertical, ExternalLink,
  Plus, RefreshCw, X, Play, CheckCircle
} from 'lucide-react';
import { useAssets, useCreateAsset } from '../hooks/api/useAssets';
import { Link, useNavigate } from 'react-router-dom';
import { eventBus } from '../realtime/eventBus';
import { apiClient } from '../api/client';

const getRiskBadge = (risk: string) => {
  switch(risk.toLowerCase()) {
    case 'critical': return <Badge variant="destructive" className="border-0">Critical</Badge>;
    case 'high': return <Badge variant="warning" className="border-0 bg-amber-500/20 text-amber-400">High</Badge>;
    case 'medium': return <Badge variant="secondary" className="border-0 text-slate-300 bg-slate-800">Medium</Badge>;
    case 'low': return <Badge variant="outline" className="border-slate-700 text-slate-400">Low</Badge>;
    default: return <Badge variant="outline">{risk}</Badge>;
  }
};

export const AttackSurface = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Infrastructure');
  const [newIp, setNewIp] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: assets, isLoading, refetch } = useAssets({ search: searchTerm });
  const createAsset = useCreateAsset();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    createAsset.mutate(
      {
        name: newName,
        type: newType || 'API Server',
        category: newCategory,
        ipAddress: newIp || '10.0.0.1',
        risk: 'Medium',
        tags: ['Discovered', 'External'],
        owner: 'SecOps Team'
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewName('');
          setNewType('');
          setNewIp('');
          showToast(`Target asset ${newName} added successfully!`);
        }
      }
    );
  };

  const handleForceSync = async () => {
    await refetch();
    showToast('Attack surface synchronized with active discovery agents.');
  };

  const handleLaunchScanForTarget = async (assetName: string) => {
    let scanId = '';
    try {
      const res = await apiClient.post(`/targets/${encodeURIComponent(assetName)}/scan`, {
        scanType: 'Full Penetration Test'
      });
      const serverScanJob = res.data?.data?.scanJob || res.data?.scanJob;
      scanId = serverScanJob?.id || `SCN-TARGET-${Date.now().toString().slice(-4)}`;
    } catch {
      scanId = `SCN-TARGET-${Date.now().toString().slice(-4)}`;
    }
    
    eventBus.publish('SCAN_PROGRESS', {
      scanId: `${scanId} (${assetName})`,
      currentPhase: 'Reconnaissance',
      progressPercentage: 10,
      findingsCount: 0
    });
    showToast(`Autonomous Pentest launched for ${assetName}`);
    navigate('/pentest');
  };

  const filteredAssets = assets?.filter(a => {
    if (selectedRiskFilter === 'All') return true;
    return a.risk.toLowerCase() === selectedRiskFilter.toLowerCase();
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-cyan-950 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="h-5 w-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Attack Surface</h1>
          <p className="text-slate-400 text-sm mt-1">Continuous discovery and mapping of internet-facing assets</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button onClick={handleForceSync} variant="outline" className="gap-2 flex-1 sm:flex-none justify-center border-slate-800">
            <RefreshCw className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Force Sync</span>
            <span className="sm:hidden">Sync</span>
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 flex-1 sm:flex-none justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-medium">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Target</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-slate-900/40 border-slate-800/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Monitored Assets</p>
                <h3 className="text-2xl font-black text-white mt-1">{assets?.length || 0}</h3>
              </div>
              <Globe className="h-5 w-5 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Critical Risks</p>
                <h3 className="text-2xl font-black text-red-400 mt-1">
                  {assets?.filter(a => a.risk === 'Critical').length || 0}
                </h3>
              </div>
              <ShieldAlert className="h-5 w-5 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">External Hosts</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">
                  {assets?.filter(a => a.category === 'Infrastructure' || a.category === 'Network').length || 0}
                </h3>
              </div>
              <Server className="h-5 w-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Clean Assets</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">
                  {assets?.filter(a => a.risk === 'Low').length || 0}
                </h3>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Asset Table */}
      <Card className="bg-slate-900/40 border-slate-800/60 overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-800/60">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search domain or IP..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-slate-950/50 py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
            
            <div className="relative">
              <Button 
                onClick={() => setShowFilterMenu(!showFilterMenu)} 
                variant="outline" 
                size="sm" 
                className="px-3 border-slate-800 text-slate-300"
              >
                <Filter className="h-4 w-4 mr-2 text-cyan-400" />
                <span>Risk: {selectedRiskFilter}</span>
              </Button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-20 py-1 text-xs">
                  {['All', 'Critical', 'High', 'Medium', 'Low'].map(risk => (
                    <button
                      key={risk}
                      onClick={() => { setSelectedRiskFilter(risk); setShowFilterMenu(false); }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-800 ${selectedRiskFilter === risk ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Domain / Asset</th>
                  <th className="px-6 py-4 font-medium">Category / Type</th>
                  <th className="px-6 py-4 font-medium">Owner</th>
                  <th className="px-6 py-4 font-medium">Tags</th>
                  <th className="px-6 py-4 font-medium">Risk</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading inventory...</td>
                  </tr>
                ) : filteredAssets?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No assets found matching query.</td>
                  </tr>
                ) : filteredAssets?.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200 flex items-center gap-2">
                          <Link to={`/assets/${asset.id}`} className="hover:text-cyan-400 transition-colors">
                            {asset.name}
                          </Link>
                          <ExternalLink className="h-3 w-3 text-slate-500" />
                        </span>
                        <span className="text-xs text-slate-500">{asset.ipAddress || '10.0.0.1'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-200">{asset.type}</span>
                        <span className="text-xs text-slate-500">{asset.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {asset.owner}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRiskBadge(asset.risk)}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Button 
                        onClick={() => handleLaunchScanForTarget(asset.name)}
                        size="sm" 
                        className="h-8 bg-cyan-950/60 text-cyan-400 hover:bg-cyan-600 hover:text-white border border-cyan-500/30 gap-1 text-xs"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        Scan
                      </Button>
                      <Link to={`/assets/${asset.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-300 hover:text-white hover:bg-slate-800">
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1c] border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Target Asset</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Asset Domain / FQDN</label>
                <input 
                  type="text" 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. auth-gateway.prod.corp" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Asset Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Application">Application</option>
                  <option value="Security">Security</option>
                  <option value="Data Storage">Data Storage</option>
                  <option value="Network">Network</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Asset Type</label>
                <input 
                  type="text" 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="e.g. API Gateway / Database" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">IP Address</label>
                <input 
                  type="text" 
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="e.g. 192.168.1.100" 
                  className="w-full h-10 rounded bg-slate-900 border border-slate-800 px-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-800">
                  Cancel
                </Button>
                <Button type="submit" disabled={createAsset.isPending} className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium">
                  {createAsset.isPending ? 'Adding...' : 'Add Target'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

