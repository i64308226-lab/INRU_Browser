const { app, BrowserWindow, BrowserView } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webviewTag: true
    },
    icon: path.join(__dirname, '../src/assets/icon.png'),
    frame: true,
    backgroundColor: '#ffffff'
  });

  // Загружаем основной интерфейс браузера
  mainWindow.loadFile(path.join(__dirname, '../src/browser.html'));

  // Открываем инструменты разработчика (можно закомментировать в продакшене)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
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

// Обработка навигации
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Разрешаем только определенные протоколы
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      event.preventDefault();
    }
  });
});
