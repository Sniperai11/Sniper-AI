import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Server, Search, Filter, ShieldAlert, Cpu, 
  Globe, Database, Cloud, Network, Shield,
  MoreVertical, ExternalLink, Activity, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAssets, useCreateAsset } from '../hooks/api/useAssets';
import { useScanProfiles, useTriggerScan } from '../hooks/api/useQuickScan';

const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Infrastructure': return <Server className="h-4 w-4 text-cyan-400" />;
    case 'Security': return <Shield className="h-4 w-4 text-emerald-400" />;
    case 'Data Storage': return <Database className="h-4 w-4 text-purple-400" />;
    case 'Application': return <Globe className="h-4 w-4 text-blue-400" />;
    case 'Network': return <Network className="h-4 w-4 text-indigo-400" />;
    default: return <Cloud className="h-4 w-4 text-slate-400" />;
  }
};

const getRiskBadge = (risk: string) => {
  const r = (risk || '').toLowerCase();
  if (r.includes('crit') || r.includes('حرج')) return <Badge variant="destructive" className="border-0">حرج</Badge>;
  if (r.includes('high') || r.includes('عال')) return <Badge variant="warning" className="border-0 bg-amber-500/20 text-amber-400">عالي</Badge>;
  if (r.includes('med') || r.includes('متوسط')) return <Badge variant="secondary" className="border-0 text-slate-300 bg-slate-800">متوسط</Badge>;
  if (r.includes('low') || r.includes('منخفض')) return <Badge variant="outline" className="border-slate-700 text-slate-400">منخفض</Badge>;
  return <Badge variant="outline">{risk}</Badge>;
};

export const AssetIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: assets = [], isLoading, refetch } = useAssets({ search: searchTerm });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState('Website');
  const [newAssetCategory, setNewAssetCategory] = useState('Application');
  const [quickScan, setQuickScan] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  
  const { mutateAsync: createAsset } = useCreateAsset();
  const { data: scanProfiles = [] } = useScanProfiles();
  const { mutateAsync: triggerScan } = useTriggerScan();
  
  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;
    
    try {
      const asset = await createAsset({
        name: newAssetName,
        type: newAssetType,
        category: newAssetCategory as any
      });
      
      if (quickScan && selectedProfileId && asset?.id) {
        await triggerScan({ targetId: asset.id, profileId: selectedProfileId });
        alert('تم إضافة الأصل وبدء الفحص السريع بنجاح');
      } else {
        alert('تم إضافة الأصل بنجاح');
      }
      
      setIsAddModalOpen(false);
      setNewAssetName('');
      setQuickScan(false);
    } catch (e) {
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  const totalAssetsCount = assets.length;
  const criticalCount = assets.filter(a => a.risk?.toLowerCase() === 'critical').length;
  const highCount = assets.filter(a => a.risk?.toLowerCase() === 'high').length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">استخبارات وسجل الأصول</h1>
          <p className="text-slate-400 text-sm mt-1">سجل شامل واستكشاف تفصيلي لجميع الأصول الرقمية المربوطة بالخادم</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => refetch()} className="gap-2 flex-1 sm:flex-none justify-center">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">تحديث الأصول</span>
            <span className="sm:hidden">تحديث</span>
          </Button>
          <Button className="gap-2 flex-1 sm:flex-none justify-center bg-cyan-600 hover:bg-cyan-500 text-white" onClick={() => setIsAddModalOpen(true)}>
            <span className="hidden sm:inline">+ إضافة اصل</span>
            <span className="sm:hidden">+ إضافة</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">إجمالي الأصول المدارة</span>
          <span className="text-xl sm:text-3xl font-black text-white mt-1">{isLoading ? '...' : totalAssetsCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">الأهداف الخارجية النشطة</span>
          <span className="text-xl sm:text-3xl font-black text-cyan-400 mt-1">{isLoading ? '...' : totalAssetsCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">أصول ذات خطورة عالية</span>
          <span className="text-xl sm:text-3xl font-black text-amber-400 mt-1">{isLoading ? '...' : highCount}</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs sm:text-sm font-medium text-slate-400">أصول ذات خطورة حرجة</span>
          <span className="text-xl sm:text-3xl font-black text-red-400 mt-1">{isLoading ? '...' : criticalCount}</span>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-slate-900/40 border-slate-800/60">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <CardTitle className="text-base font-medium">سجل وتصنيف الأصول</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو النوع..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-slate-950/50 py-1.5 pr-9 pl-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-right"
              />
            </div>
            <Button variant="outline" size="sm" className="px-3 shrink-0 hidden sm:flex border-slate-800">
              <Filter className="h-4 w-4 ml-2" />
              تصفية
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          
          {/* Mobile List View */}
          <div className="grid grid-cols-1 divide-y divide-slate-800/60 lg:hidden">
            {assets.map((asset) => (
              <div key={asset.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                      {getCategoryIcon(asset.category)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link to={`/assets/${asset.id}`} className="font-bold text-cyan-400 hover:text-cyan-300">
                        {asset.name}
                      </Link>
                      <span className="text-xs text-slate-500">{asset.category} • {asset.type}</span>
                    </div>
                  </div>
                  {getRiskBadge(asset.risk)}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {(asset.tags || []).map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50">
                  <span className="text-xs text-slate-500">المالك: {asset.owner}</span>
                  <Link to={`/assets/${asset.id}`} className="w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent border-slate-700">
                      التفاصيل
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-right" dir="rtl">
              <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium text-right">اسم الأصل</th>
                  <th className="px-6 py-4 font-medium text-right">الفئة</th>
                  <th className="px-6 py-4 font-medium text-right">الوسوم</th>
                  <th className="px-6 py-4 font-medium text-right">المالك</th>
                  <th className="px-6 py-4 font-medium text-right">المخاطرة</th>
                  <th className="px-6 py-4 font-medium text-right">آخر ظهور</th>
                  <th className="px-6 py-4 text-left font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center border border-slate-700">
                          {getCategoryIcon(asset.category)}
                        </div>
                        <div className="flex flex-col">
                          <Link to={`/assets/${asset.id}`} className="font-medium text-slate-200 hover:text-cyan-400 transition-colors">
                            {asset.name}
                          </Link>
                          <span className="text-xs text-slate-500">{asset.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{asset.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(asset.tags || []).map(tag => (
                          <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {asset.owner}
                    </td>
                    <td className="px-6 py-4">
                      {getRiskBadge(asset.risk)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {asset.lastSeen}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <Link to={`/assets/${asset.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-800">
                          فحص تفصيلي
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
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-bold text-white text-lg">إضافة أصل جديد</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleAddAsset} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">اسم الأصل / الرابط</label>
                <input 
                  type="text" 
                  value={newAssetName}
                  onChange={e => setNewAssetName(e.target.value)}
                  placeholder="مثال: api.company.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">النوع</label>
                  <select 
                    value={newAssetType}
                    onChange={e => setNewAssetType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none"
                  >
                    <option value="Website">موقع إلكتروني</option>
                    <option value="API">واجهة برمجية API</option>
                    <option value="Server">خادم</option>
                    <option value="Network">شبكة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">الفئة</label>
                  <select 
                    value={newAssetCategory}
                    onChange={e => setNewAssetCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none"
                  >
                    <option value="Application">تطبيق</option>
                    <option value="Infrastructure">بنية تحتية</option>
                    <option value="Data Storage">تخزين بيانات</option>
                    <option value="Security">أمان</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={quickScan}
                      onChange={(e) => setQuickScan(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${quickScan ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                    <div className={`absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${quickScan ? '-translate-x-4' : ''}`}></div>
                  </div>
                  <span className="text-sm font-medium text-slate-200">إجراء فحص أمني سريع (Quick Scan)</span>
                </label>
              </div>

              {quickScan && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">ملف الفحص (Scan Profile)</label>
                  <select 
                    value={selectedProfileId}
                    onChange={e => setSelectedProfileId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-cyan-100 focus:outline-none focus:border-cyan-500 appearance-none"
                    required={quickScan}
                  >
                    <option value="" disabled>اختر ملف الفحص...</option>
                    {scanProfiles.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} - {p.type}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                    سيتم إرسال طلب لجدولة المهمة في الخلفية فور الإضافة.
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white border-0">
                  حفظ {quickScan ? 'وبدء الفحص' : ''}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
