'use client';
// import { getServerSession } from "next-auth/next"
// import type { NextRequest } from "next/server"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { signIn } from "next-auth/react";


export default function Home() {

  // const session = await getServerSession(authOptions)
  // console.log('mmmm', session);

  function onSubmit() {
    signIn('credentials', {
      email: 'email',
      password: 'password',
      callbackUrl: 'http://localhost:3000'
    });
  }


  return (
    <main>
      this is test text
      <button onClick={onSubmit}>click me</button>
      <input style={{ borderRadius: "4px", border: '1px solid grey', padding: 4 }} />
    </main>
  );
}
