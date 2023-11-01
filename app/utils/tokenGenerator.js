import { randomInt } from "crypto";

function generateRandomToken(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomInt(0, characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

async function generateUniqueTokens(count, length) {
  const uniqueTokens = new Set();
  while (uniqueTokens.size < count) {
    uniqueTokens.add(generateRandomToken(length));
  }
  return Array.from(uniqueTokens);
}

export default generateUniqueTokens;
