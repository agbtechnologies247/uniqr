const http = require('http');

const data = JSON.stringify({
  target: '9049874780',
  channel: 'phone'
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 8080,
  path: '/api/v1/auth/send-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  res.on('data', d => process.stdout.write(d));
});

req.on('error', console.error);
req.write(data);
req.end();
