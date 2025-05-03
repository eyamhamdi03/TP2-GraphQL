// src/context.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  usePrisma?: boolean; // flag optionnel pour choisir le backend
};

export const createContext = (): Context => ({
  prisma,
  usePrisma: true, // tu peux changer dynamiquement ce flag
});
