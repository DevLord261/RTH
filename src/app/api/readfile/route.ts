import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SHA256 } from "crypto-js";

function hashingpassword(password: string): string {
  return SHA256(password).toString();
}

// Hashing a wordlist passed by user
export async function GET(request: NextRequest) {
  //taking the filename from the url which = to file
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("file");

  if (!filename) {
    return new Response("failed to find file", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
  const filePath = path.join(process.cwd(), "data", filename);
  if (!filePath) {
    return new Response("failed to find file", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  //read the file line by line and hash it then write it to a new file called hashed.txt
  try {
    const content = await fs.readFile(filePath, "utf-8");

    const lines = content.split("\n").filter(Boolean);
    const hashedLines = lines.map((line) => {
      const hash = hashingpassword(line);
      return `${line} | ${hash} `;
    });
    writefile(hashedLines.join("\n"));
    return Response.json({ lines: hashedLines });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Failed to read file" },
      { status: 500 },
    );
  }
}

async function writefile(newData: string) {
  await fs.writeFile(
    path.join(process.cwd(), "data", "hashed.txt"),
    newData,
    "utf-8",
  );
}
