import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { validPassword } from '@/lib/validation.mjs';
import { authCookies } from '@/lib/auth-cookies.mjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  cookies: authCookies(process.env.NODE_ENV),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [Credentials({
    credentials: { email: { type: 'email' }, password: { type: 'password' } },
    async authorize(credentials) {
      if (typeof credentials?.email !== 'string' || credentials.email.length > 254 || !validPassword(credentials?.password)) return null;
      await connectDB();
      const user = await User.findOne({ email: credentials.email.trim().toLowerCase() }).select('+passwordHash');
      if (!user || !await compare(credentials.password as string, user.passwordHash)) return null;
      return { id: String(user._id), name: user.name, email: user.email };
    },
  })],
  callbacks: {
    jwt({ token, user }) { if (user) token.sub = user.id; return token; },
    session({ session, token }) { if (session.user && token.sub) session.user.id = token.sub; return session; },
  },
});
