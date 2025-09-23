import { PackageRepository } from "../repositories/packageRepository"
import { Station } from "../repositories/stations"
import { pubsub } from "./pubsub"

type Ctx = { userId: string | null; isAdmin: boolean }

const PACKAGE_UPDATED = "PACKAGE_UPDATED"

export const resolvers = {
  Subscription: {
    packageUpdated: {
      subscribe: () => pubsub.asyncIterableIterator([PACKAGE_UPDATED]),
    },
  },
  Query: {
    getPackages: (_: any, __: any, ctx: Ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return ctx.isAdmin
        ? PackageRepository.findAll()
        : PackageRepository.findAllByOwner(ctx.userId)
    },
    getPackage: (_: any, { id }: { id: string }, ctx: Ctx) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return PackageRepository.findById(id)
    },
    getPackageByTrackingNumber: (
      _: any,
      { trackingNumber }: { trackingNumber: string },
      ctx: Ctx
    ) => {
      if (!ctx.userId) throw new Error("Unauthorized")
      return PackageRepository.findByTrackingNumber(trackingNumber)
    },
  },

  Mutation: {
    createPackage: (
      _: any,
      {
        sender,
        receiver,
        destination,
        userId,
      }: {
        sender: string
        receiver: string
        destination: string
        userId: string
      },
      ctx: Ctx
    ) => {
      if (!ctx.isAdmin) throw new Error("Forbidden")
      const trackingNumber = `PKG-${Date.now()}`
      return PackageRepository.create(
        trackingNumber,
        sender,
        receiver,
        destination,
        userId
      )
    },
    updatePackageStation: (
      _: any,
      { id, station }: { id: string; station: string },
      ctx: Ctx
    ) => {
      if (!ctx.isAdmin) throw new Error("Forbidden")
      return PackageRepository.updatePackageStation(id, station as Station)
    },
    updatePackageStatus: (
      _: any,
      { id, status }: { id: string; status: string },
      ctx: Ctx
    ) => {
      if (!ctx.isAdmin) throw new Error("Forbidden")
      return PackageRepository.updateStatusById(id, status)
    },
  },
}
