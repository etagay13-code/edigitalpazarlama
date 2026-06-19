import { createClient } from "@/lib/supabase/server";
import { MessageList } from "./MessageList";

export const metadata = { title: "Mesajlar" };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages = [] } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Mesajlar</h1>
        <p className="text-sm text-white/55">
          İletişim formundan gelen başvurular
        </p>
      </header>
      <MessageList messages={messages ?? []} />
    </div>
  );
}
