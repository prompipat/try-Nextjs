import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const authSecret = process.env.AUTH_SECRET;

if (!clientId || !clientSecret || !authSecret) {
  throw new Error(
    "Missing env vars: ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and AUTH_SECRET are set in .env.local and restart the dev server."
  );
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: clientId!,
      clientSecret: clientSecret!,
    }),
  ],
  secret: authSecret!,
});

export { handler as GET, handler as POST };
