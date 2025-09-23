import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Subscription {
    packageUpdated(id: String!): Package
  }
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

  type Package {
    id: String!
    trackingNumber: String!
    status: PackageStatus!
    history: [PackageStatus!]!
    sender: String!
    receiver: String!
    destination: String!
    userId: String!
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
      userId: String!
      station: Station
    ): Package!

    updatePackageStatus(id: String!, status: String!, location: String): Package
    updatePackageStation(id: String!, station: Station!): Package
  }
`
