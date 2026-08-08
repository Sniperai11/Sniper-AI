const http = require('http');

const run = () => {
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/vulnerabilities/vuln-1/ai-analyze',
    method: 'POST'
  }, res => {
    console.log(res.statusCode);
  });
  req.end();
}
run();
