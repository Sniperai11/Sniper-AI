const http = require('http');
const endpoints = [
  '/api/command-center/stats',
  '/api/command-center/trend',
  '/api/command-center/distribution',
  '/api/command-center/alerts',
  '/api/user/profile',
  '/api/audit-logs',
  '/api/projects',
  '/api/scans',
  '/api/scan-profiles',
  '/api/assets',
  '/api/notifications',
  '/api/vulnerabilities',
  '/api/reports/history',
  '/api/bugbounty/data',
  '/api/ai-consultations',
  '/api/remediations',
  '/api/tasks'
];

async function run() {
  for (const endpoint of endpoints) {
    await new Promise(resolve => {
      http.get('http://localhost:3000' + endpoint, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
           console.log(`${res.statusCode} - ${endpoint}`);
           if (res.statusCode === 500) {
              console.log('Body:', body);
           }
           resolve();
        });
      }).on('error', (e) => {
        console.error(`Error on ${endpoint}: ${e.message}`);
        resolve();
      });
    });
  }
}
run();
