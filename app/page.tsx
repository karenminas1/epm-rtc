import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "./api/auth/[...nextauth]/options";

import Chat from "./components/Chat";
import UserMenu from "./components/UserMenu";

export default async function Home() {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/");
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="p-3 border border-gray-300 ">
        {session.user && session.user?.image && session.user?.name && (
          <UserMenu
            username={session.user?.name}
            avatarUrl={session.user?.image}
          />
        )}
      </div>

      <Chat />
    </section>
  );
}
