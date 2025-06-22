"use client";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { data } = authClient.useSession();
  const logout = () => {
    authClient.signOut();
  };
  console.log(data);
  return (
    <div>
      <div>{JSON.stringify(data?.user?.email)}</div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
