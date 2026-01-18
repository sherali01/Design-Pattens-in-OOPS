import { defineCollection, z } from "astro:content";

const patterns = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["Creational", "Structural", "Behavioral"]),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  patterns,
};
