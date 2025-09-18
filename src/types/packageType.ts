export enum PackageStatus {
  PENDING,
  CONFIRMED,
  PROCESSING,
  SHIPPED,
  OUT_FOR_DELIVERY,
  DELIVERED,
}

export interface PackageRow {
  id: number
  trackingNumber: string
  status: PackageStatus
  history: string // stored as JSON string in DB
  sender: string
  receiver: string
  destination: string
}

export interface Package {
  id: string
  trackingNumber: string
  status: PackageStatus
  history: PackageStatus[]
  sender: string
  receiver: string
  destination: string
}
