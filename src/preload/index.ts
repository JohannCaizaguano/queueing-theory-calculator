import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer — future desktop native features
const api = {
  // Placeholder: Export report to PDF
  exportPDF: (data: unknown): Promise<void> => ipcRenderer.invoke('export-pdf', data),
  // Placeholder: Export data to CSV
  exportCSV: (data: unknown): Promise<void> => ipcRenderer.invoke('export-csv', data),
  // Placeholder: Save calculation history
  saveHistory: (entry: unknown): Promise<void> => ipcRenderer.invoke('save-history', entry),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
