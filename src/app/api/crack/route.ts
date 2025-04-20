import path from "path";
import { promises as fs } from "fs";

export async function GET(request: Request) {
  // take the hash from the url query parameter "/crack?hash=<hash>"
  const { searchParams } = new URL(request.url);
  const targethash = searchParams.get("hash");

  // the file wanna read which is the hashed text
  const filePath = path.join(process.cwd(), "data", "hashed.txt");

  try {
    //read its content line by line
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.split("\n").filter(Boolean);

    //iterate over each line
    for (const line of lines) {
      // for simple search we make a map after we split the line  we save the word and the hash to it after that
      // we compare the input hash (given by the user) with the hash from the line
      // return the word if the hash matches
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
