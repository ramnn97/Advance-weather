// Mock database for demo purposes
const mockDatabase: any = {
  UserPrefs: [],
  SavedSummaries: [],
  Alerts: [],
}

export async function connectToDatabase() {
  // For demo purposes, return a mock database
  // In production, you would use actual MongoDB connection

  const mockClient = {
    connect: () => Promise.resolve(),
    db: () => ({
      collection: (name: string) => ({
        findOne: (query: any) => {
          const collection = mockDatabase[name] || []
          return Promise.resolve(
            collection.find((item: any) => Object.keys(query).every((key) => item[key] === query[key])) || null,
          )
        },
        updateOne: (query: any, update: any, options: any) => {
          const collection = mockDatabase[name] || []
          const existingIndex = collection.findIndex((item: any) =>
            Object.keys(query).every((key) => item[key] === query[key]),
          )

          if (existingIndex >= 0) {
            collection[existingIndex] = { ...collection[existingIndex], ...update.$set }
          } else if (options?.upsert) {
            collection.push({ ...query, ...update.$set })
          }

          mockDatabase[name] = collection
          return Promise.resolve({ acknowledged: true })
        },
      }),
    }),
  }

  return {
    client: mockClient,
    db: mockClient.db(),
  }
}
