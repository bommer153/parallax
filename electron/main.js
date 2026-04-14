// electron/main.js
import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      // Preload script for secure Node.js <-> Renderer communication
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,   // Security: isolates renderer from Node.js
      nodeIntegration: false,   // Security: never expose Node.js to renderer
    },
  })

  if (isDev) {
    // In dev: load from Vite dev server
    win.loadURL('http://localhost:5177')
    win.webContents.openDevTools() // Opens DevTools automatically in dev
  } else {
    // In prod: load the built index.html
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  // macOS: re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})