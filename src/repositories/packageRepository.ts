import { readDb, writeDb, PackageRecord } from "../db/database"
import { STATION_COORDINATES, Station } from "./stations"
import { pubsub } from "../graphql/pubsub"
const PACKAGE_UPDATED = "PACKAGE_UPDATED"

export const PackageRepository = {
  findAll(): PackageRecord[] {
    return readDb()
  },

  findAllByOwner(ownerId: string): PackageRecord[] {
    return readDb().filter((p) => p.ownerId === ownerId)
  },

  findByTrackingNumber(trackingNumber: string): PackageRecord | undefined {
    return readDb().find((p) => p.trackingNumber === trackingNumber)
  },

  findById(id: string): PackageRecord | undefined {
    return readDb().find((p) => p.id === id)
  },

  create(
    trackingNumber: string,
    sender: string,
    receiver: string,
    destination: string,
    ownerId: string
  ): PackageRecord {
    const db = readDb()
    const now = new Date().toISOString()
    let coordinates = STATION_COORDINATES.ELENGA
    let station = "ELENGA"

    const newPkg: PackageRecord = {
      id: `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      trackingNumber,
      sender,
      receiver,
      destination,
      status: "PENDING",
      history: [{ status: "PENDING", date: now }],
      createdAt: now,
      updatedAt: now,
      ownerId,
      station,
      coordinates,
    }
    db.push(newPkg)
    writeDb(db)
    return newPkg
  },

  updatePackageStation(id: string, station: Station): PackageRecord | null {
    const db = readDb()
    const idx = db.findIndex((p) => p.id === id)
    if (idx === -1) return null
    const coordinates = STATION_COORDINATES[station]
    db[idx] = {
      ...db[idx],
      station,
      coordinates,
      updatedAt: new Date().toISOString(),
    }
    writeDb(db)
    pubsub.publish(`${PACKAGE_UPDATED}_${id}`, { packageUpdated: db[idx] })
    return db[idx]
  },

  updateStatus(trackingNumber: string, status: string): PackageRecord | null {
    const db = readDb()
    const idx = db.findIndex((p) => p.trackingNumber === trackingNumber)
    if (idx === -1) return null
    const prev = db[idx]
    const entry = { status, date: new Date().toISOString() }
    const history = Array.isArray(prev.history)
      ? [...prev.history, entry]
      : [entry]
    db[idx] = { ...prev, status, updatedAt: entry.date, history }
    writeDb(db)
    return db[idx]
  },

  updateStatusById(id: string, status: string): PackageRecord | null {
    const db = readDb()
    const idx = db.findIndex((p) => p.id === id)
    if (idx === -1) return null
    const prev = db[idx]
    const entry = { status, date: new Date().toISOString() }
    const history = Array.isArray(prev.history)
      ? [...prev.history, entry]
      : [entry]
    db[idx] = { ...prev, status, updatedAt: entry.date, history }
    writeDb(db)
    pubsub.publish(`${PACKAGE_UPDATED}_${id}`, { packageUpdated: db[idx] })
    return db[idx]
  },
}
