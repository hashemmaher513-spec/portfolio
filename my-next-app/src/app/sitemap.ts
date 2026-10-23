import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let projects: any[] = [];
  try {
    await connectToDatabase();
    projects = await Project.find({ visible: true }).select("slug updatedAt").lean();
  } catch (e) {
    console.error("Sitemap error:", e);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((p) => [
    {
      url: `${baseUrl}/ar/projects/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/projects/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]);

  return [...staticRoutes, ...projectRoutes];
}
