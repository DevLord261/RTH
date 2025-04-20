import path from "path";
import { promises as fs } from "fs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targethash = searchParams.get("hash");

  const filePath = path.join(process.cwd(), "data", "hashed.txt");

  try {
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.split("\n").filter(Boolean);

    for (const line of lines) {
      const [word, hash] = line.split(" | ").map((x) => x.trim());

      if (hash === targethash) {
        return new Response(word, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }

    return new Response("No match found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error reading file: " + error.message, {
      status: 500,
    });
  }
}
