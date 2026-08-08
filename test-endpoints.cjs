const http = require('http');
const endpoints = [
  '/api/command-center/stats',
  '/api/command-center/trends',
  '/api/command-center/assets',
  '/api/command-center/alerts',
  '/api/scans',
  '/api/reports',
  '/api/projects',
  '/api/vulnerabilities',
  '/api/assets',
  '/api/tasks',
  '/api/bounty/submissions',
  '/api/bounty/leaderboard',
  '/api/chat/history'
];

async function run() {
  for (const endpoint of endpoints) {
    await new Promise(resolve => {
      http.get('http://localhost:3000' + endpoint, (res) => {
        console.log(`${res.statusCode} - ${endpoint}`);
        res.resume();
        resolve();
      }).on('error', (e) => {
        console.error(`Error on ${endpoint}: ${e.message}`);
        resolve();
      });
    });
  }
}
run();
