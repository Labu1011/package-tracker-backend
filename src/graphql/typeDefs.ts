import { gql } from "apollo-server-express"

export const typeDefs = gql`
  enum PackageStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    OUT_FOR_DELIVERY
    DELIVERED
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
    ): Package!

    updatePackageStatus(id: String!, status: String!, location: String): Package
  }
`
