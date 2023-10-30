import crypto from "crypto";

export default function hexGenerator() {
  const randomBytes = crypto.randomBytes(12);
  return randomBytes.toString("hex");
}
