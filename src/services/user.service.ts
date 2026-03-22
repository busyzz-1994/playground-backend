import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { LoginInput, RegisterInput } from "../schemas/user.schema";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyUserPassword(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) return null;
  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) return null;
  return { id: user.id, userName: user.userName, email: user.email };
}

export async function getUserList(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        userName: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);
  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      userName: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
}

export async function updateUserAvatarUrl(id: number, avatarUrl: string) {
  return prisma.user.update({
    where: { id },
    data: { avatarUrl },
    select: {
      id: true,
      userName: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
}

export async function createUser(input: RegisterInput) {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
    data: {
      userName: input.userName,
      password: hashedPassword,
      email: input.email,
    },
    select: {
      id: true,
      userName: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
}
