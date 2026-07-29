export function chunkDocuments(
  documents,
  chunkSize = 500,
  overlap = 100
) {

  const chunks = [];

  for (const document of documents) {

    const text = document.content;

    let start = 0;

    while (start < text.length) {

      const end = start + chunkSize;

      chunks.push({

        id: `${document.id}-${chunks.length + 1}`,

        source: document.source,

        text: text.slice(start, end),

      });

      start += chunkSize - overlap;

    }

  }

  return chunks;

}