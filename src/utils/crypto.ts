import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
};

export const comparePassword = async (
  plain: string,
  stored: string,
): Promise<boolean> => {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derivedKey = (await scryptAsync(plain, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(hash, "hex");
  return timingSafeEqual(storedBuffer, derivedKey);
};

export const generateToken = (bytes = 32): string => {
  return randomBytes(bytes).toString("hex");
};
