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
  
  // 渲染完成后自动点击进入详情页
  win.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      // 等待页面完全加载后点击第一只宝可梦
      win.webContents.executeJavaScript(`
        (function() {
          // 查找所有卡片
          const gridItems = document.querySelectorAll('[style*="grid"] > div');
          console.log('Found cards:', gridItems.length);
          
          if (gridItems.length > 0) {
            // 模拟点击事件
            const firstCard = gridItems[0];
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            firstCard.dispatchEvent(clickEvent);
            return 'Clicked first card';
          }
          return 'No cards found';
        })()
      `).then(result => {
        console.log('Click result:', result);
      }).catch(err => console.error('Click error:', err));
    }, 5000); // 等待5秒确保页面加载完成
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
