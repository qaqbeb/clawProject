const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hiddenInset',
  });

  win.loadFile('index.html');
  
  // 开发时打开开发者工具
  // win.webContents.openDevTools();
  
  // 渲染完成后获取 DOM 快照
  win.webContents.on('did-finish-load', () => {
    const checkInterval = setInterval(() => {
      win.webContents.executeJavaScript(`
        (function() {
          const cards = document.querySelectorAll('[style*="card"]');
          const searchInput = document.querySelector('input[type="text"]');
          if (cards.length > 0 || searchInput) {
            return true;
          }
          return false;
        })()
      `).then(ready => {
        if (ready) {
          clearInterval(checkInterval);
          return win.webContents.executeJavaScript('document.documentElement.outerHTML');
        }
      }).then(html => {
        if (!html) return;
        fs.writeFileSync('/tmp/pokemon-dom.html', html);
        
        return win.webContents.executeJavaScript(`
          JSON.stringify({
            title: document.title,
            pokemonCount: document.querySelectorAll('[style*="grid"] > div').length,
            searchInput: document.querySelector('input[type="text"]') ? 'exists' : 'missing',
            filterSelects: document.querySelectorAll('select').length,
            typeChartButton: document.body.innerText.includes('属性相克表'),
            favoritesText: document.body.innerText.includes('收藏'),
            evolutionChain: document.body.innerText.includes('进化链'),
            compareButton: document.body.innerText.includes('对比'),
            statsSection: document.body.innerText.includes('种族值'),
          })
        `);
      }).then(result => {
        if (result) {
          fs.writeFileSync('/tmp/pokemon-state.json', result);
          console.log('DOM captured successfully');
        }
      }).catch(err => console.error('Error:', err));
    }, 1000); // 每秒检查一次
    
    // 超时保护
    setTimeout(() => clearInterval(checkInterval), 30000);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
