const fs = require('fs');
let code = fs.readFileSync('src/pages/AssetIntelligence.tsx', 'utf8');

code = code.replace(/          <Link to="\/attack-surface">\n            <Button className="gap-2 flex-1 sm:flex-none justify-center bg-cyan-600 hover:bg-cyan-500 text-white">\n              <span className="hidden sm:inline">\+ إضافة اصل<\/span>\n              <span className="sm:hidden">\+ إضافة<\/span>\n            <\/Button>\n          <\/Link>/g, 
`          <Button className="gap-2 flex-1 sm:flex-none justify-center bg-cyan-600 hover:bg-cyan-500 text-white" onClick={() => alert("سيتم توفير واجهة إضافة الأصول قريباً")}>\n            <span className="hidden sm:inline">+ إضافة اصل</span>\n            <span className="sm:hidden">+ إضافة</span>\n          </Button>`);

fs.writeFileSync('src/pages/AssetIntelligence.tsx', code);
