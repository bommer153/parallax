// electron/preload.js
import { contextBridge, ipcRenderer } from 'electron'

// Expose safe APIs to the renderer (React) via window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: send a message to main process
  sendMessage: (msg) => ipcRenderer.send('message', msg),
  // Example: receive a message from main process
  onMessage: (callback) => ipcRenderer.on('reply', (_event, val) => callback(val)),
})