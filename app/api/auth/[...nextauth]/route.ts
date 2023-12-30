import { authenticate } from "@/services/authService"
import NextAuth from "next-auth"
import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = { id: '1', name: 'John Doe', email: 'adrenalin247@gmail.com', role: 'admin' }
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token, user }) {
      const sanitizedToken = Object.keys(token).reduce((p, c) => {
        // strip unnecessary properties
        if (
          c !== "iat" &&
          c !== "exp" &&
          c !== "jti" &&
          c !== "apiToken"
        ) {
          return { ...p, [c]: token[c] }
        } else {
          return p
        }
      }, {})
      return { ...session, user: sanitizedToken, apiToken: token.apiToken, role: 'admin' }
    },
    // async jwt({ token, user, account, profile }) {
    //   if (typeof user !== "undefined") {
    //     // user has just signed in so the user object is populated
    //     // console.log('user', user);
    //     return user as JWT
    //   }
    //   return token
    // }
  }

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }