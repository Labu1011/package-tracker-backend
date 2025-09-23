export const STATION_COORDINATES = {
  ELENGA: { lat: 24.3167, lng: 89.9167 },
  SIRAJGONJ: { lat: 24.4539, lng: 89.7 },
  SHERPUR: { lat: 25.0206, lng: 90.0174 },
  BOGURA: { lat: 24.8465, lng: 89.3776 },
  POLASHBARI: { lat: 25.3282, lng: 89.3915 },
  RANGPUR_HUB: { lat: 25.7439, lng: 89.2752 },
} as const

export type Station = keyof typeof STATION_COORDINATES
