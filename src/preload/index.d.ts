import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      writeJson: (message: string, fileName?: string, dirName: string) => Promise<boolean>
      getJsonList: (dirName: string) => Promise<string[]>
      readJson: (fileName: string, dirName: string) => Promise<string>
      selectDir: () => Promise<string>
    }
  }
}
