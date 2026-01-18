import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
  const patterns = await getCollection("patterns");

  return rss({
    title: "Design Patterns in OOPS",
    description:
      "A curated collection of Gang of Four design patterns in Object-Oriented Programming",
    site: context.site,
    items: patterns.map((pattern) => ({
      title: pattern.data.title,
      description: pattern.data.description,
      link: `/patterns/${pattern.slug}`,
    })),
  });
}
