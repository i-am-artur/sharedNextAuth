import { log } from "console";
import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

const getDomainWithoutSubdomain = (url: string) => {
  const urlParts = new URL(url).hostname.split('.');

  return urlParts
    .slice(0)
    .slice(-(urlParts.length === 4 ? 3 : 2))
    .join('.');
};

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith('https://');
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const hostName = getDomainWithoutSubdomain(process.env.NEXTAUTH_URL);

console.log(process.env.NEXTAUTH_URL)

const cookies = {
  sessionToken:
  {
    name: `${cookiePrefix}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: useSecureCookies,
      domain: hostName == 'localhost' ? hostName : '.' + hostName // add a . in front so that subdomains are included
    },
  },
};


const callbacks = {
  async jwt({ token, user }) {
    // we store the user data and access token in the token
    if (user) {
      token.user = user.user;
      token.accessToken = user.access_token;
      token.refreshToken = user.refresh_token;
    }

    return token;
  },

  async session({ session, token }) {
    session.accessToken = token.accessToken;
    console.log('token 51', token, session);
    // const { firstName, lastName, email } = token.user;
    session.user = {
      name: 'first name',
    };
    session.refreshToken = token.refreshToken;
    return session;
  },
  async redirect({ url, baseUrl }) {
    console.log('redirect', url, baseUrl);
    // Allows relative callback URLs
    // if (url.startsWith("/")) return `${baseUrl}${url}`
    // Allows callback URLs on the same origin
    // else if (new URL(url).origin === baseUrl) return url
    return baseUrl
  }
};

export const authOptions: AuthOptions = {
  debug: false, // if you want to debug
  secret: 'secret',
  useSecureCookies,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = { id: '1', name: 'John Doe', email: 'adrenalin247@gmail.com', role: 'admin' }
        console.log('authorize', '3000')

        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  callbacks,
  cookies,
  // pages: {
  //   // set pages that tell nextauth where to redirect for an action
  //   signIn: '/signin',
  //   signOut: '/',
  //   error: '/signin'
  // }
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }