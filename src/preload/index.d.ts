import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomAPI {
  exportPDF: (data: unknown) => Promise<void>
  exportCSV: (data: unknown) => Promise<void>
  saveHistory: (entry: unknown) => Promise<void>
  updateTitleBarOverlay: (colors: { color: string; symbolColor: string }) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
