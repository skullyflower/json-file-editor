import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  writeJson: (message: string, fileName: string, dirName: string): Promise<boolean> => {
    return ipcRenderer.invoke('write-json', message, fileName, dirName)
  },
  getJsonList: (dirName: string): Promise<string[]> => {
    return ipcRenderer.invoke('get-file-list', dirName)
  },
  readJson: (fileName: string, dirName: string): Promise<string> => {
    return ipcRenderer.invoke('read-file', fileName, dirName)
  },
  selectDir: (): Promise<string> => {
    return ipcRenderer.invoke('select-json-directory')
  }
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
