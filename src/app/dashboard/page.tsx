import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOutButton from "@/app/dashboard/Sign-out/index";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const ImageLink = `https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg`;

  console.log(session);
  const Images = session?.user?.image;
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={Images || ImageLink}
                alt={session.user?.name || "User"}
              />
              <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {session.user?.name || "User"}
              </h3>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Session Info</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </CardContent>
        <CardFooter>
          <SignOutButton />
        </CardFooter>
      </Card>
    </div>
  );
}
