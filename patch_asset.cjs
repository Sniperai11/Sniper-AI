const fs = require('fs');
let code = fs.readFileSync('src/pages/AssetIntelligence.tsx', 'utf8');

const importsTarget = "import { useAssets } from '../hooks/api/useAssets';";
const importsReplacement = `import { useAssets, useCreateAsset } from '../hooks/api/useAssets';
import { useScanProfiles, useTriggerScan } from '../hooks/api/useQuickScan';`;

code = code.replace(importsTarget, importsReplacement);

const stateTarget = `export const AssetIntelligence = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: assets = [], isLoading, refetch } = useAssets({ search: searchTerm });`;
const stateReplacement = `export const AssetIntelligence = () => {
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
  };`;

code = code.replace(stateTarget, stateReplacement);

const btnTarget = `onClick={() => alert("سيتم توفير واجهة إضافة الأصول قريباً")}`;
const btnReplacement = `onClick={() => setIsAddModalOpen(true)}`;

code = code.replace(btnTarget, btnReplacement);

const modalAdd = `
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
                    <div className={\`block w-10 h-6 rounded-full transition-colors \${quickScan ? 'bg-cyan-500' : 'bg-slate-700'}\`}></div>
                    <div className={\`absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform \${quickScan ? '-translate-x-4' : ''}\`}></div>
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
      )}`;

code = code.replace("    </div>\n  );\n};", `    </div>\n${modalAdd}\n  );\n};`);

fs.writeFileSync('src/pages/AssetIntelligence.tsx', code);
