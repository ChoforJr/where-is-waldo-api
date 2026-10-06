import "dotenv/config";

export const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ??
  process.env.ALLOWED_URL1 ??
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:3000");
}

export function isTrustedOrigin(origin: string | undefined): boolean {
  return !origin || allowedOrigins.includes(origin);
}
