# Package Tracker Backend

A GraphQL-based package tracking system built with Express.js, TypeScript, and Apollo Server. This backend provides real-time package tracking capabilities with authentication and role-based access control.

## 🚀 Features

- **GraphQL API** with queries, mutations, and subscriptions
- **Real-time updates** via WebSocket subscriptions
- **Authentication & Authorization** using Clerk
- **Role-based access control** (Admin/User permissions)
- **Package tracking** with status history
- **Station management** across multiple delivery hubs
- **TypeScript** for type safety

## 📋 Prerequisites

- Node.js (v16 or higher)
- pnpm package manager
- Clerk account for authentication

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd package-tracker-backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```env
PORT=8000
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
ADMIN_USER_IDS=user_id_1,user_id_2
```

5. Start the development server:

```bash
pnpm dev
```

The server will be available at:

- GraphQL Playground: `http://localhost:8000/graphql`
- WebSocket Subscriptions: `ws://localhost:8000/graphql`

## 📚 API Documentation

### Authentication Requirements

All GraphQL operations require authentication via Clerk. Include the authorization token in your request headers:

```
Authorization: Bearer <your-clerk-token>
```

**Admin-only operations:**

- Creating packages
- Updating package status
- Updating package station

**User operations:**

- Viewing own packages (non-admin users see only their packages)
- Viewing package details
- Tracking packages by tracking number

### GraphQL Schema

#### Types

```graphql
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
```

### 🔍 Queries

#### Get All Packages

**Admin:** Returns all packages
**User:** Returns only packages owned by the user

```graphql
query GetPackages {
  getPackages {
    id
    trackingNumber
    sender
    receiver
    destination
    status
    history {
      status
      date
    }
    createdAt
    updatedAt
    ownerId
    station
    coordinates {
      lat
      lng
    }
  }
}
```

#### Get Package by ID

```graphql
query GetPackage($id: String!) {
  getPackage(id: $id) {
    id
    trackingNumber
    sender
    receiver
    destination
    status
    history {
      status
      date
    }
    createdAt
    updatedAt
    ownerId
    station
    coordinates {
      lat
      lng
    }
  }
}
```

**Variables:**

```json
{
  "id": "package-uuid-here"
}
```

#### Get Package by Tracking Number

```graphql
query GetPackageByTrackingNumber($trackingNumber: String!) {
  getPackageByTrackingNumber(trackingNumber: $trackingNumber) {
    id
    trackingNumber
    sender
    receiver
    destination
    status
    history {
      status
      date
    }
    createdAt
    updatedAt
    ownerId
    station
    coordinates {
      lat
      lng
    }
  }
}
```

**Variables:**

```json
{
  "trackingNumber": "PKG-1632845678901"
}
```

### ✏️ Mutations

#### Create Package (Admin Only)

```graphql
mutation CreatePackage(
  $sender: String!
  $receiver: String!
  $destination: String!
  $ownerId: String!
  $station: Station
) {
  createPackage(
    sender: $sender
    receiver: $receiver
    destination: $destination
    ownerId: $ownerId
    station: $station
  ) {
    id
    trackingNumber
    sender
    receiver
    destination
    status
    history {
      status
      date
    }
    createdAt
    updatedAt
    ownerId
    station
    coordinates {
      lat
      lng
    }
  }
}
```

**Variables:**

```json
{
  "sender": "John Doe",
  "receiver": "Jane Smith",
  "destination": "123 Main St, Dhaka",
  "ownerId": "user_abc123",
  "station": "ELENGA"
}
```

#### Update Package Status (Admin Only)

```graphql
mutation UpdatePackageStatus(
  $id: String!
  $status: String!
  $location: String
) {
  updatePackageStatus(id: $id, status: $status, location: $location) {
    id
    trackingNumber
    status
    history {
      status
      date
    }
    updatedAt
  }
}
```

**Variables:**

```json
{
  "id": "package-uuid-here",
  "status": "SHIPPED",
  "location": "Dhaka Distribution Center"
}
```

#### Update Package Station (Admin Only)

```graphql
mutation UpdatePackageStation($id: String!, $station: Station!) {
  updatePackageStation(id: $id, station: $station) {
    id
    trackingNumber
    station
    status
    updatedAt
  }
}
```

**Variables:**

```json
{
  "id": "package-uuid-here",
  "station": "BOGURA"
}
```

### 🔔 Subscriptions

#### Package Updates

Subscribe to real-time package updates:

```graphql
subscription PackageUpdated {
  packageUpdated {
    id
    trackingNumber
    sender
    receiver
    destination
    status
    history {
      status
      date
    }
    createdAt
    updatedAt
    ownerId
    station
    coordinates {
      lat
      lng
    }
  }
}
```

**WebSocket Connection:**

```javascript
import { createClient } from "graphql-ws"

const client = createClient({
  url: "ws://localhost:8000/graphql",
  connectionParams: {
    // Add authentication headers if needed
    authorization: "Bearer your-clerk-token",
  },
})

const unsubscribe = client.subscribe(
  {
    query: `
      subscription {
        packageUpdated {
          id
          trackingNumber
          status
          updatedAt
        }
      }
    `,
  },
  {
    next: (data) => {
      console.log("Package updated:", data)
    },
    error: (err) => {
      console.error("Subscription error:", err)
    },
    complete: () => {
      console.log("Subscription completed")
    },
  }
)
```

## 🏗️ Project Structure

```
src/
├── index.ts              # Server entry point
├── db/
│   ├── database.ts       # Database connection
│   └── db.json          # JSON database file
├── graphql/
│   ├── typeDefs.ts      # GraphQL schema definitions
│   ├── resolvers.ts     # GraphQL resolvers
│   └── pubsub.ts        # Pub/Sub for subscriptions
├── repositories/
│   ├── packageRepository.ts  # Package data access layer
│   └── stations.ts          # Station definitions
└── types/
    └── packageType.ts   # TypeScript type definitions
```

## 🚀 Deployment

### Build for production:

```bash
pnpm build
```

### Start production server:

```bash
pnpm start
```

## 📝 Sample Input/Output

### Creating a Package

**Input:**

```json
{
  "sender": "ABC Company",
  "receiver": "John Customer",
  "destination": "House 45, Road 12, Dhanmondi, Dhaka-1205",
  "ownerId": "user_2abc123def456",
  "station": "ELENGA"
}
```

**Output:**

```json
{
  "data": {
    "createPackage": {
      "id": "pkg_abc123def456",
      "trackingNumber": "PKG-1693847562341",
      "sender": "ABC Company",
      "receiver": "John Customer",
      "destination": "House 45, Road 12, Dhanmondi, Dhaka-1205",
      "status": "PENDING",
      "history": [
        {
          "status": "PENDING",
          "date": "2024-09-24T10:30:00.000Z"
        }
      ],
      "createdAt": "2024-09-24T10:30:00.000Z",
      "updatedAt": "2024-09-24T10:30:00.000Z",
      "ownerId": "user_2abc123def456",
      "station": "ELENGA",
      "coordinates": {
        "lat": 23.8103,
        "lng": 90.4125
      }
    }
  }
}
```

### Tracking a Package

**Input:**

```json
{
  "trackingNumber": "PKG-1693847562341"
}
```

**Output:**

```json
{
  "data": {
    "getPackageByTrackingNumber": {
      "id": "pkg_abc123def456",
      "trackingNumber": "PKG-1693847562341",
      "sender": "ABC Company",
      "receiver": "John Customer",
      "destination": "House 45, Road 12, Dhanmondi, Dhaka-1205",
      "status": "OUT_FOR_DELIVERY",
      "history": [
        {
          "status": "PENDING",
          "date": "2024-09-24T10:30:00.000Z"
        },
        {
          "status": "CONFIRMED",
          "date": "2024-09-24T11:00:00.000Z"
        },
        {
          "status": "PROCESSING",
          "date": "2024-09-24T14:00:00.000Z"
        },
        {
          "status": "SHIPPED",
          "date": "2024-09-25T09:00:00.000Z"
        },
        {
          "status": "OUT_FOR_DELIVERY",
          "date": "2024-09-26T08:00:00.000Z"
        }
      ],
      "createdAt": "2024-09-24T10:30:00.000Z",
      "updatedAt": "2024-09-26T08:00:00.000Z",
      "ownerId": "user_2abc123def456",
      "station": "RANGPUR_HUB",
      "coordinates": {
        "lat": 25.7439,
        "lng": 89.2752
      }
    }
  }
}
```

## 🔒 Error Handling

The API returns standard GraphQL errors:

```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["getPackages"]
    }
  ],
  "data": null
}
```

Common error messages:

- `"Unauthorized"` - Missing or invalid authentication token
- `"Forbidden"` - User lacks required permissions (admin-only operations)
- `"Package not found"` - Invalid package ID or tracking number

For more information or support, please contact the development team.
