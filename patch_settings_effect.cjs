const fs = require('fs');
let code = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");

code = code.replace(/  const \[companyName, setCompanyName\] = useState\(companyProfile\.name \|\| 'شركة قناص الأمن السيبراني'\);\n/m, `  const [companyName, setCompanyName] = useState(companyProfile.name || 'شركة قناص الأمن السيبراني');\n\n  useEffect(() => {\n    if (profile?.company?.name) {\n      setCompanyName(profile.company.name);\n    }\n  }, [profile]);\n`);

fs.writeFileSync('src/pages/Settings.tsx', code);
