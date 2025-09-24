export enum PackageStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
}
export enum Station {
  ELENGA,
  SIRAJGONJ,
  SHERPUR,
  BOGURA,
  POLASHBARI,
  RANGPUR_HUB,
}

export type Coordinates = {
  lat: number
  lng: number
}

export interface PackageRow {
  id: number
  trackingNumber: string
  status: PackageStatus
  history: string // stored as JSON string in DB
  sender: string
  receiver: string
  destination: string
  coordinates: Coordinates
}

export interface Package {
  id: string
  trackingNumber: string
  status: PackageStatus
  history: PackageStatus[]
  sender: string
  receiver: string
  destination: string
  coordinates: Coordinates
}
