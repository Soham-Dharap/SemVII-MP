"use server";

import { db } from "@/lib/db";
import { currentuser } from "@/features/auth/actions";
import { revalidatePath } from "next/cache";
import { getDefaultFiles, TemplateId } from "@/lib/templates";

export const getPlaygroundById = async (id: string) => {
  try {
    const playground = await db.playground.findUnique({
      where: { id },
      include: { user: true, files: true },
    });
    return playground;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getFilesForPlayground = async (playgroundId: string) => {
  try {
    const files = await db.playgroundFile.findMany({
      where: { playgroundId },
      orderBy: { createdAt: "asc" },
    });
    // Seed with template files if empty
    if (files.length === 0) {
      const playground = await db.playground.findUnique({ where: { id: playgroundId } });
      if (playground) {
        const defaults = getDefaultFiles(playground.template as TemplateId);
        for (const f of defaults) {
          await db.playgroundFile.create({
            data: {
              name: f.name,
              content: f.content,
              playgroundId,
            },
          });
        }
        return await db.playgroundFile.findMany({
          where: { playgroundId },
          orderBy: { createdAt: "asc" },
        });
      }
    }
    return files;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const updateFileContent = async (fileId: string, content: string) => {
  try {
    const file = await db.playgroundFile.update({
      where: { id: fileId },
      data: { content },
    });
    return file;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createFile = async (playgroundId: string, name: string, content: string = "") => {
  const user = await currentuser();
  if (!user) return null;
  try {
    const file = await db.playgroundFile.create({
      data: { name, content, playgroundId },
    });
    revalidatePath(`/playground/${playgroundId}`);
    return file;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const deleteFile = async (fileId: string, playgroundId: string) => {
  try {
    await db.playgroundFile.delete({ where: { id: fileId } });
    revalidatePath(`/playground/${playgroundId}`);
  } catch (e) {
    console.error(e);
  }
};

export const renameFile = async (fileId: string, name: string, playgroundId: string) => {
  try {
    const file = await db.playgroundFile.update({ where: { id: fileId }, data: { name } });
    revalidatePath(`/playground/${playgroundId}`);
    return file;
  } catch (e) {
    console.error(e);
    return null;
  }
};
