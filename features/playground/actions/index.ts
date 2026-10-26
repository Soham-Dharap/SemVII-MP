"use server";

import { db } from "@/lib/db";
import { currentuser } from "@/features/auth/actions";
import { deriveFolders, getLanguageFromPath, normalizePath } from "@/lib/file-tree";
import { revalidatePath } from "next/cache";

export const getPlaygroundForUser = async (id: string) => {
  const user = await currentuser();
  if (!user?.id) return null;

  try {
    const playground = await db.playground.findFirst({
      where: { id, userId: user.id },
      include: {
        files: {
          orderBy: { path: "asc" },
        },
      },
    });
    return playground;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateFileContent = async (
  playgroundId: string,
  fileId: string,
  content: string,
) => {
  const user = await currentuser();
  if (!user?.id) return { ok: false as const };

  try {
    const ownedFile = await db.projectFile.findFirst({
      where: {
        id: fileId,
        playgroundId,
        playground: { userId: user.id },
      },
      select: { id: true },
    });
    if (!ownedFile) return { ok: false as const };

    await db.projectFile.update({
      where: { id: fileId },
      data: { content },
    });
    return { ok: true as const };
  } catch (error) {
    console.error(error);
    return { ok: false as const };
  }
};

export const createProjectFile = async (
  playgroundId: string,
  input: { path: string; isDirectory: boolean; content?: string },
) => {
  const user = await currentuser();
  if (!user?.id) return { ok: false as const, error: "Not authenticated" };

  const path = normalizePath(input.path);
  if (!path) return { ok: false as const, error: "A valid path is required" };

  try {
    const playground = await db.playground.findFirst({
      where: { id: playgroundId, userId: user.id },
      include: { files: { select: { path: true, isDirectory: true } } },
    });

    if (!playground) {
      return { ok: false as const, error: "Project not found" };
    }

    const existingPaths = new Set(
      (playground.files as Array<{ path: string }>).map((file) => file.path),
    );
    if (existingPaths.has(path)) {
      return { ok: false as const, error: `"${path}" already exists` };
    }

    const data: Array<{
      name: string;
      path: string;
      content: string;
      language: string;
      isDirectory: boolean;
    }> = [];

    // Auto-create any missing parent folders.
    for (const folderPath of deriveFolders(path)) {
      if (!existingPaths.has(folderPath)) {
        existingPaths.add(folderPath);
        data.push({
          name: folderPath.split("/").pop() ?? folderPath,
          path: folderPath,
          content: "",
          language: "plaintext",
          isDirectory: true,
        });
      }
    }

    data.push({
      name: path.split("/").pop() ?? path,
      path,
      content: input.content ?? "",
      language: input.isDirectory
        ? "plaintext"
        : getLanguageFromPath(path),
      isDirectory: input.isDirectory,
    });

    await db.projectFile.createMany({
      data: data.map((entry) => ({ ...entry, playgroundId })),
    });

    revalidatePath(`/playground/${playgroundId}`);
    const created = await db.projectFile.findFirst({
      where: { playgroundId, path },
    });
    return { ok: true as const, file: created };
  } catch (error) {
    console.error(error);
    return { ok: false as const, error: "Could not create the file" };
  }
};

export const deleteProjectFile = async (
  playgroundId: string,
  fileId: string,
) => {
  const user = await currentuser();
  if (!user?.id) return { ok: false as const };

  try {
    const target = await db.projectFile.findFirst({
      where: {
        id: fileId,
        playgroundId,
        playground: { userId: user.id },
      },
    });

    if (!target) return { ok: false as const };

    if (target.isDirectory) {
      await db.projectFile.deleteMany({
        where: {
          playgroundId,
          OR: [
            { path: target.path },
            { path: { startsWith: `${target.path}/` } },
          ],
        },
      });
    } else {
      await db.projectFile.deleteMany({
        where: { id: fileId, playgroundId },
      });
    }

    revalidatePath(`/playground/${playgroundId}`);
    return { ok: true as const, removedPath: target.path };
  } catch (error) {
    console.error(error);
    return { ok: false as const };
  }
};

export const renameProjectFile = async (
  playgroundId: string,
  fileId: string,
  newName: string,
) => {
  const user = await currentuser();
  if (!user?.id) return { ok: false as const, error: "Not authenticated" };

  const cleanName = normalizePath(newName);
  if (!cleanName || cleanName.includes("/")) {
    return { ok: false as const, error: "Enter a single file or folder name" };
  }

  try {
    const target = await db.projectFile.findFirst({
      where: {
        id: fileId,
        playgroundId,
        playground: { userId: user.id },
      },
    });

    if (!target) return { ok: false as const, error: "File not found" };

    const parentPath = target.path.includes("/")
      ? target.path.slice(0, target.path.lastIndexOf("/"))
      : "";
    const newPath = parentPath ? `${parentPath}/${cleanName}` : cleanName;

    if (target.isDirectory) {
      const descendants = await db.projectFile.findMany({
        where: {
          playgroundId,
          OR: [
            { path: target.path },
            { path: { startsWith: `${target.path}/` } },
          ],
        },
      });

      for (const entry of descendants) {
        const updatedPath =
          entry.path === target.path
            ? newPath
            : `${newPath}${entry.path.slice(target.path.length)}`;
        await db.projectFile.update({
          where: { id: entry.id },
          data: {
            path: updatedPath,
            name: updatedPath.split("/").pop() ?? cleanName,
          },
        });
      }
    } else {
      await db.projectFile.update({
        where: { id: fileId },
        data: {
          path: newPath,
          name: cleanName,
          language: getLanguageFromPath(newPath),
        },
      });
    }

    revalidatePath(`/playground/${playgroundId}`);
    return { ok: true as const, newPath };
  } catch (error) {
    console.error(error);
    return { ok: false as const, error: "Could not rename" };
  }
};
