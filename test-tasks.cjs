const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/tasks/1/ai-remediate',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log(res.statusCode, data));
});
req.write(JSON.stringify({ taskId: '1' }));
req.end();
