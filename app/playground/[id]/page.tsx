import { notFound } from "next/navigation";
import React from "react";
import { getPlaygroundForUser } from "@/features/playground/actions";
import { getAllPlaygroundForUser } from "@/features/dashboard/actions";
import PlaygroundWorkspace from "@/features/playground/components/playground-workspace";
import type { ProjectFile, TemplateName } from "@/features/dashboard/type";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const playground = await getPlaygroundForUser(id);
  if (!playground) {
    notFound();
  }

  const allProjects =
    (await getAllPlaygroundForUser()) as Array<{
      id: string;
      title: string;
      template: TemplateName;
    }> | null;

  const serializedFiles: ProjectFile[] = (
    playground.files as ProjectFile[]
  ).map((file) => ({
    id: file.id,
    playgroundId: file.playgroundId,
    name: file.name,
    path: file.path,
    content: file.content,
    language: file.language,
    isDirectory: file.isDirectory,
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  }));

  const projectSwitcherItems = (allProjects ?? []).map((project) => ({
    id: project.id,
    title: project.title,
    template: project.template,
  }));

  return (
    <PlaygroundWorkspace
      playground={{
        id: playground.id,
        title: playground.title,
        description: playground.description,
        template: playground.template as TemplateName,
      }}
      initialFiles={serializedFiles}
      projects={projectSwitcherItems}
    />
  );
};

export default Page;
