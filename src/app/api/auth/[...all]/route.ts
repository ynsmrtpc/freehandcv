import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/sunucu/auth";

export const { GET, POST } = toNextJsHandler(auth);
