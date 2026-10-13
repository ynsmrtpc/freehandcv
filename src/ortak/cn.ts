import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...siniflar: ClassValue[]) => twMerge(clsx(siniflar));
