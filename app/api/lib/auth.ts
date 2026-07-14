import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.APP_SECRET || "default-secret-key-change-me"
);

export async function createToken(payload: { id: number; username: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
  return payload as { id: number; username: string; role: string };
}
