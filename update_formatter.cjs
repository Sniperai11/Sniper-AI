const fs = require('fs');
let code = fs.readFileSync('backend/utils/formatter.ts', 'utf8');

code = code.replace(
  /public static error\(errors: string \| string\[\], message: string = "حدث خطأ أثناء تنفيذ العملية"\): IApiResponse<null> {[\s\S]*?}/,
  `public static error(errors: string | string[], message: string = "حدث خطأ أثناء تنفيذ العملية"): any {
    const errList = Array.isArray(errors) ? errors : [errors];
    return {
      success: false,
      message,
      data: null,
      errors: errList,
      error: {
        code: 500,
        message: message,
        details: errList
      },
      timestamp: new Date().toISOString()
    };
  }`
);

fs.writeFileSync('backend/utils/formatter.ts', code);
console.log("Updated formatter");
