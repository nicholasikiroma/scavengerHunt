import crypto from "crypto";

export function hexGenerator() {
  const randomBytes = crypto.randomBytes(12);
  return randomBytes.toString("hex");
}

export async function tokenIdArrayGenerator(count) {
  const uniqueTokenIds = new Set();
  while (uniqueTokenIds.size < count) {
    uniqueTokenIds.add(crypto.randomBytes(12).toString("hex"));
  }
  return Array.from(uniqueTokenIds);
}
