'use client';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


export default async function Home() {

  const session = await getServerSession(authOptions)
  console.log('mmmm0', session);

  return (
    <main>
      this is test text
      <button >click me</button>
      <input style={{ borderRadius: "4px", border: '1px solid grey', padding: 4 }} />
    </main>
  );
}
