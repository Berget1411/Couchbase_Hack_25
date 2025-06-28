import fs from "fs";
import path from "path";

export function getStoryContent(): string {
  const filePath = path.join(process.cwd(), "content", "story.md");
  return fs.readFileSync(filePath, "utf8");
}
