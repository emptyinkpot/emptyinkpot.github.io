export async function listReaderMemory() {
  return [
    {
      objectType: 'book',
      objectId: 'designing-data-intensive-applications',
      progress: 0.42,
      location: { page: 168 }
    },
    {
      objectType: 'book',
      objectId: 'shape-up',
      progress: 0.9,
      location: { page: 92 }
    }
  ];
}
