import fs from "fs"
import path from "path"
import { PackageStatus } from "../types/packageType"

export type HistoryRecord = {
  status: PackageStatus
  date: string
}

export type StatusHistoryEntry = {
  status: string
  date: string
}

export type PackageRecord = {
  id: string
  trackingNumber: string
  sender: string
  receiver: string
  destination: string
  status: PackageStatus
  history?: HistoryRecord[]
  createdAt: string
  updatedAt: string
  ownerId?: string
  station?: string
  coordinates?: Coordinates
}

export type Coordinates = {
  lat: number
  lng: number
}

const DB_PATH = path.join(__dirname, "db.json")

export function readDb(): PackageRecord[] {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]))
  }

  const data = fs.readFileSync(DB_PATH, "utf-8").trim()
  if (data === "") {
    // file exists but empty; initialize
    fs.writeFileSync(DB_PATH, JSON.stringify([]))
    return []
  }
  try {
    const parsed = JSON.parse(data) as unknown
    // Ensure array shape
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([]))
      return []
    }
    // Backfill missing ids
    let changed = false
    const withIds: PackageRecord[] = parsed.map((rec: any) => {
      if (!rec.id) {
        changed = true
        return {
          id: `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          ...rec,
        }
      }
      return rec as PackageRecord
    })
    if (changed) {
      // persist normalized data
      writeDb(withIds)
    }
    return withIds
  } catch (e) {
    // recover from malformed JSON by resetting to empty array
    // you may choose to log the error in real apps
    fs.writeFileSync(DB_PATH, JSON.stringify([]))
    return []
  }
}

export function writeDb(data: PackageRecord[]) {
  // Write atomically to reduce risk of corruption
  const tmpPath = DB_PATH + ".tmp"
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2))
  fs.renameSync(tmpPath, DB_PATH)
}
