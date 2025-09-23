import { gql } from "apollo-server-express"

export const typeDefs = gql`
  enum Station {
    ELENGA
    SIRAJGONJ
    SHERPUR
    BOGURA
    POLASHBARI
    RANGPUR_HUB
  }

  enum PackageStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    OUT_FOR_DELIVERY
    DELIVERED
  }

  type Coordinates {
    lat: Float!
    lng: Float!
  }

  type HistoryRecord {
    status: PackageStatus!
    date: String!
  }

  type Package {
    id: String!
    trackingNumber: String!
    sender: String!
    receiver: String!
    destination: String!
    status: PackageStatus!
    history: [HistoryRecord!]
    createdAt: String!
    updatedAt: String!
    ownerId: String
    station: Station
    coordinates: Coordinates
  }

  type Query {
    getPackages: [Package!]
    getPackage(id: String!): Package
    getPackageByTrackingNumber(trackingNumber: String!): Package
  }

  type Mutation {
    createPackage(
      sender: String!
      receiver: String!
      destination: String!
      ownerId: String!
      station: Station
    ): Package!

    updatePackageStatus(id: String!, status: String!, location: String): Package
    updatePackageStation(id: String!, station: Station!): Package
  }
`
