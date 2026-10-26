import { notFound, redirect } from "next/navigation";
import { getPlaygroundById, getFilesForPlayground } from "@/features/editor/actions";
import { EditorLayout } from "@/features/editor/components/editor-layout";
import { currentuser } from "@/features/auth/actions";

export const dynamic = "force-dynamic";

export default async function PlaygroundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentuser();
  if (!user) {
    redirect("/auth/sign-in");
  }

  const playground = await getPlaygroundById(id);
  if (!playground) {
    notFound();
  }

  // Optional: check ownership
  // if (playground.userId !== user.id) redirect("/dashboard");

  const files = await getFilesForPlayground(id);

  // Map to editor format
  const editorFiles = files.map((f: any) => ({
    id: f.id,
    name: f.name,
    content: f.content || "",
  }));

  return (
    <EditorLayout
      playground={{
        id: playground.id,
        title: playground.title,
        template: playground.template,
      }}
      initialFiles={editorFiles}
    />
  );
}
