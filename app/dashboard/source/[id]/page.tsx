import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import type { Source, Clip } from "@/types";
import SourceDetailClient from "@/components/dashboard/SourceDetailClient";

export default async function SourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: source } = await supabase
    .from("sources")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!source) notFound();

  const { data: clips } = await supabase
    .from("clips")
    .select("*")
    .eq("source_id", id)
    .eq("user_id", user.id)
    .order("viral_score", { ascending: false });

  return (
    <SourceDetailClient
      source={source as Source}
      clips={(clips as Clip[]) || []}
    />
  );
}
