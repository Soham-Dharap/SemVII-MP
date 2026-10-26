"use server";

import { db } from "@/lib/db";
import { currentuser } from "@/features/auth/actions";
import { STARTER_TEMPLATES } from "@/lib/starter-templates";
import type { TemplateName } from "../type";
import { revalidatePath } from "next/cache";

export const createPlayground = async (data: {
  title: string;
  template: TemplateName;
  description?: string;
}) => {
  const { template, title, description } = data;
  const user = await currentuser();

  if (!user?.id) {
    throw new Error("You must be signed in to create a project");
  }

  try {
    const starterFiles = STARTER_TEMPLATES[template] ?? [];

    const playground = await db.playground.create({
      data: {
        title,
        description,
        template,
        userId: user.id,
        files: {
          create: starterFiles.map((file) => ({
            name: file.path.split("/").pop() ?? file.path,
            path: file.path,
            content: file.content,
            language: file.language,
            isDirectory: Boolean(file.isDirectory),
          })),
        },
      },
    });

    revalidatePath("/dashboard");
    return playground;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentuser();
  if (!user?.id) return null;

  try {
    const playground = await db.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        Starmark: {
          where: {
            userId: user.id,
          },
          select: {
            isMarked: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return playground;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteProjectById = async (id: string) => {
  const user = await currentuser();
  if (!user?.id) return;

  try {
    await db.playground.deleteMany({
      where: { id, userId: user.id },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string },
) => {
  const user = await currentuser();
  if (!user?.id) return null;

  try {
    const updated = await db.playground.updateMany({
      where: { id, userId: user.id },
      data,
    });
    revalidatePath("/dashboard");
    return updated;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const duplicateProjectById = async (id: string) => {
  const user = await currentuser();
  if (!user?.id) return null;

  try {
    const originalPlayground = await db.playground.findFirst({
      where: { id, userId: user.id },
      include: { files: true },
    });

    if (!originalPlayground) {
      throw new Error("Project not found");
    }

    const duplicatedPlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: user.id,
        files: {
          create: (
            originalPlayground.files as Array<{
              name: string;
              path: string;
              content: string;
              language: string;
              isDirectory: boolean;
            }>
          ).map((file) => ({
            name: file.name,
            path: file.path,
            content: file.content,
            language: file.language,
            isDirectory: file.isDirectory,
          })),
        },
      },
    });
    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const toggleProjectStar = async (id: string) => {
  const user = await currentuser();
  if (!user?.id) return null;

  try {
    const existing = await db.starMark.findUnique({
      where: {
        userId_playgroundId: {
          userId: user.id,
          playgroundId: id,
        },
      },
    });

    if (existing) {
      await db.starMark.update({
        where: { id: existing.id },
        data: { isMarked: !existing.isMarked },
      });
      return !existing.isMarked;
    }

    await db.starMark.create({
      data: {
        userId: user.id,
        playgroundId: id,
        isMarked: true,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};
