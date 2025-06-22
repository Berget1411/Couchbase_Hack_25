"use client";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data } = authClient.useSession();

  return <div>{JSON.stringify(data?.user?.email)}</div>;
}
