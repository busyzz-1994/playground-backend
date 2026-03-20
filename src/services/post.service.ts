import { prisma } from "../db";
import { CreatePostInput } from "../schemas/post.schema";

export async function createPost(userId: number, input: CreatePostInput) {
  return prisma.post.create({
    data: {
      title: input.title,
      content: input.content,
      published: input.published ?? false,
      userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
    },
  });
}

export async function getPostList(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        user: { select: { id: true, userName: true } },
      },
    }),
    prisma.post.count(),
  ]);
  return {
    posts,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPostById(postId: number) {
  return prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      user: { select: { id: true, userName: true } },
    },
  });
}

export async function deletePost(
  postId: number,
  userId: number,
): Promise<"not_found" | "forbidden" | "ok"> {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return "not_found";
  if (post.userId !== userId) return "forbidden";
  await prisma.post.delete({ where: { id: postId } });
  return "ok";
}

export async function updatePost(
  postId: number,
  userId: number,
  input: Partial<CreatePostInput>,
): Promise<"not_found" | "forbidden" | object> {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return "not_found";
  if (post.userId !== userId) return "forbidden";
  return prisma.post.update({
    where: { id: postId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.published !== undefined && { published: input.published }),
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
