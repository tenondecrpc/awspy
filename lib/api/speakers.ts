import { z } from "zod";
import { apiFetch } from "./client";

export const SpeakerSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string(),
  photoUrl: z.string().url().optional(),
  talkTitle: z.string().optional(),
  talkAbstract: z.string().optional(),
});

export const SpeakersListSchema = z.array(SpeakerSchema);

export type Speaker = z.infer<typeof SpeakerSchema>;

export async function listSpeakers(): Promise<Speaker[]> {
  return apiFetch("/speakers", {
    method: "GET",
    schema: SpeakersListSchema,
    next: { revalidate: 3600, tags: ["speakers"] },
  });
}

export async function getSpeaker(id: string): Promise<Speaker> {
  return apiFetch(`/speakers/${encodeURIComponent(id)}`, {
    method: "GET",
    schema: SpeakerSchema,
    next: { revalidate: 3600, tags: ["speakers", `speaker:${id}`] },
  });
}
