import dns from 'dns';

// Force DNS lookup configuration before importing handlers
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

import http from 'http';
import url from 'url';

// Dynamically import handlers so the DNS configuration runs first
const dbHandler = (await import('../api/db.js')).default;
const uploadHandler = (await import('../api/upload.js')).default;
const filesHandler = (await import('../api/files.js')).default;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    if (!res.writableEnded) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    }
    return res;
  };
  res.send = (data) => {
    if (!res.writableEnded) {
      res.end(data);
    }
    return res;
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = {};
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const dataStr = Buffer.concat(buffers).toString();
      if (dataStr) {
        body = JSON.parse(dataStr);
      }
    } catch (e) {
      console.error('Error parsing JSON body:', e.message);
    }
  }
  req.body = body;

  console.log(`[local-server] ${req.method} ${pathName}`);

  try {
    if (pathName.startsWith('/api/db/')) {
      const table = pathName.substring('/api/db/'.length);
      req.query = { ...parsedUrl.query, table };
      await dbHandler(req, res);
    } else if (pathName === '/api/upload') {
      req.query = parsedUrl.query;
      await uploadHandler(req, res);
    } else if (pathName.startsWith('/api/files/')) {
      const filePath = decodeURIComponent(pathName.substring('/api/files/'.length));
      req.query = { ...parsedUrl.query, path: filePath };
      await filesHandler(req, res);
    } else {
      res.status(404).json({ error: 'Route not found' });
    }
  } catch (error) {
    console.error('Server error handling route:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Nexora Local Backend Server listening on http://localhost:${PORT}`);
});
