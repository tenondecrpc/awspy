// Loader for `content/editions/{year}/faq.json`.

import { z } from "zod";
import { join } from "node:path";
import { editionDir, readJsonOrThrow } from "@/lib/content/_fs";

export const FAQItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const FAQListSchema = z.array(FAQItemSchema).superRefine((arr, ctx) => {
  const seen = new Set<string>();
  arr.forEach((f, i) => {
    if (seen.has(f.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [i, "id"],
        message: `FAQ id "${f.id}" is duplicated`,
      });
    }
    seen.add(f.id);
  });
});

export type FAQItem = z.infer<typeof FAQItemSchema>;

export function getFAQ(year: string): FAQItem[] {
  const path = join(editionDir(year), "faq.json");
  const raw = readJsonOrThrow(path);
  const result = FAQListSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid faq.json for edition ${year} at ${path}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return result.data;
}
