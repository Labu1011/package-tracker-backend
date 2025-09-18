import { readDb, writeDb, PackageRecord } from "../db/database"

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
    const newPkg: PackageRecord = {
      id: `pkg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      trackingNumber,
      sender,
      receiver,
      destination,
      status: "Pending",
      createdAt: now,
      updatedAt: now,
      ownerId,
    }
    db.push(newPkg)
    writeDb(db)
    return newPkg
  },

  updateStatus(trackingNumber: string, status: string): PackageRecord | null {
    const db = readDb()
    const idx = db.findIndex((p) => p.trackingNumber === trackingNumber)
    if (idx === -1) return null
    db[idx] = { ...db[idx], status, updatedAt: new Date().toISOString() }
    writeDb(db)
    return db[idx]
  },

  updateStatusById(id: string, status: string): PackageRecord | null {
    const db = readDb()
    const idx = db.findIndex((p) => p.id === id)
    if (idx === -1) return null
    db[idx] = { ...db[idx], status, updatedAt: new Date().toISOString() }
    writeDb(db)
    return db[idx]
  },
}
