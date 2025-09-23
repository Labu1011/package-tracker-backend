export enum PackageStatus {
  PENDING,
  CONFIRMED,
  PROCESSING,
  SHIPPED,
  OUT_FOR_DELIVERY,
  DELIVERED,
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
