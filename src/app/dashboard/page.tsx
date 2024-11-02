import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SignOutButton from "@/app//dashboard/Sign-out/index";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <p className="text-sm">Welcome, {session?.user?.email}</p>
        <SignOutButton />
      </div>
    </div>
  );
}
