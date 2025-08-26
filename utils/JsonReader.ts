import * as fs from "fs";

/**
 * Reads a JSON file asynchronously and returns the parsed object.
 *
 * @param filePath - Path to the JSON file (relative to project root)
 * @returns Parsed JSON object
 */
export function readJSON<T>(filePath: string): T {
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as T;
}
