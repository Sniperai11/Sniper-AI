const http = require('http');

const endpoints = [
  '/api/auth/me',
  '/api/command-center/stats',
  '/api/command-center/trend',
  '/api/command-center/distribution',
  '/api/command-center/alerts',
  '/api/projects',
  '/api/scans',
  '/api/vulnerabilities',
  '/api/remediations',
  '/api/bugbounty/data'
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + endpoint, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${endpoint}`);
        if (res.statusCode === 500) {
          console.log(data);
        }
        resolve();
      });
    }).on('error', (e) => {
      console.error(`Error on ${endpoint}: ${e.message}`);
      resolve();
    });
  });
}

(async () => {
  for (const ep of endpoints) {
    await testEndpoint(ep);
  }
})();
