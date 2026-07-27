const fs = require('fs');
let code = fs.readFileSync('backend/controllers/scanController.ts', 'utf8');

const profilesMethod = `
  public getScanProfiles = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const profiles = [
        { id: 'prof-owasp', name: 'OWASP Top 10', description: 'فحص شامل لثغرات OWASP العشر', type: 'Web' },
        { id: 'prof-full', name: 'فحص شامل (Full Scan)', description: 'فحص عميق لجميع المنافذ والخدمات', type: 'Network' },
        { id: 'prof-fast', name: 'فحص سريع (Fast Scan)', description: 'فحص سريع للمنافذ الشائعة والثغرات المعروفة', type: 'Network' },
        { id: 'prof-api', name: 'فحص واجهات برمجة التطبيقات (API)', description: 'فحص مخصص لثغرات الـ APIs', type: 'API' }
      ];
      return res.json(Formatter.success(profiles, "تم جلب ملفات الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
`;

code = code.replace(/export const scanController = new ScanController\(\);/, profilesMethod + '\nexport const scanController = new ScanController();');

fs.writeFileSync('backend/controllers/scanController.ts', code);
