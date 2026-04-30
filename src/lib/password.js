import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(plain) {
  return bcryptHash(plain, ROUNDS);
}

export async function verifyPassword(plain, hash) {
  if (!plain || !hash) return false;
  return bcryptCompare(plain, hash);
}
