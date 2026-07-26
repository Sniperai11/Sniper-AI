const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');

content = content.replace('server: {', `build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react') || id.includes('recharts') || id.includes('framer-motion')) {
                return 'vendor-ui';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {`);

fs.writeFileSync('vite.config.ts', content, 'utf8');
