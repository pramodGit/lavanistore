import fs from "fs/promises";
import path from "path";

const DOCUMENTS_DIR = path.join(
  process.cwd(),
  "ai",
  "documents"
);

export async function loadDocuments() {

  const files = await fs.readdir(DOCUMENTS_DIR);

  const markdownFiles = files.filter(
    file => file.endsWith(".md")
  );

  const documents = await Promise.all(

    markdownFiles.map(async file => {

      const content = await fs.readFile(
        path.join(DOCUMENTS_DIR, file),
        "utf8"
      );

        return {
            id: file,
            source: file,
            type: "markdown",
            title: path.parse(file).name,
            content,
        };

    })

  );

  return documents;

}