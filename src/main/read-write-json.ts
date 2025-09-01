import { join } from 'path'
import fs from 'node:fs'

export function getFilePath(fileName: string, dirName: string): string {
  return join(dirName, `/${fileName}.json`)
}

export function writeJSONFile(content: string, fileName: string, dirName: string): boolean {
  const logFile = getFilePath(fileName, dirName)
  try {
    fs.writeFileSync(logFile, content, { encoding: 'utf8', flag: 'w' })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export function getFileList(dirName: string): string[] {
  if (fs.existsSync(dirName)) {
    const files = fs.readdirSync(dirName)
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''))
      .sort()
  }
  return []
}

export function readFile(fileName: string, dirName: string): string {
  const theFile = join(dirName, `/${fileName}.json`)
  if (fs.existsSync(theFile)) {
    return fs.readFileSync(theFile, { encoding: 'utf8' })
  } else {
    return ''
  }
}
