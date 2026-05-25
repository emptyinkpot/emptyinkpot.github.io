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

export async function getReaderMemory(bookId: string) {
  return (await listReaderMemory()).find((item) => item.objectId === bookId) ?? null;
}

export async function saveReaderMemory(record: unknown) {
  return {
    ok: true,
    record
  };
}
