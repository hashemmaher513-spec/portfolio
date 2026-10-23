import { connectToDatabase } from "./mongodb";
import {
  SiteSettings,
  Theme,
  Section,
  Profile,
  SkillGroup,
  Experience,
  Project,
  Service,
  Testimonial,
  BilingualText,
  Locale,
  ISiteSettings,
  ITheme,
  ISection,
  IProfile,
  ISkillGroup,
  IExperience,
  IProject,
  IService,
  ITestimonial,
} from "@/models";

export { getBilingualText } from "./bilingual";

export interface PortfolioData {
  settings: ISiteSettings | null;
  theme: ITheme | null;
  sections: ISection[];
  profile: IProfile | null;
  skillGroups: ISkillGroup[];
  experiences: IExperience[];
  projects: IProject[];
  services: IService[];
  testimonials: ITestimonial[];
}

/**
 * Fetches all dynamic portfolio data from MongoDB.
 * Cached and optimized for server components.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    await connectToDatabase();

    const [
      settings,
      theme,
      sections,
      profile,
      skillGroups,
      experiences,
      projects,
      services,
      testimonials,
    ] = await Promise.all([
      SiteSettings.findOne().lean<ISiteSettings>(),
      Theme.findOne().lean<ITheme>(),
      Section.find().sort({ order: 1 }).lean<ISection[]>(),
      Profile.findOne().lean<IProfile>(),
      SkillGroup.find({ visible: true }).sort({ order: 1 }).lean<ISkillGroup[]>(),
      Experience.find({ visible: true }).sort({ order: 1 }).lean<IExperience[]>(),
      Project.find({ visible: true }).sort({ order: 1 }).lean<IProject[]>(),
      Service.find({ visible: true }).sort({ order: 1 }).lean<IService[]>(),
      Testimonial.find({ visible: true }).sort({ order: 1 }).lean<ITestimonial[]>(),
    ]);

    return {
      settings: settings || null,
      theme: theme || null,
      sections: sections || [],
      profile: profile || null,
      skillGroups: skillGroups || [],
      experiences: experiences || [],
      projects: projects || [],
      services: services || [],
      testimonials: testimonials || [],
    };
  } catch (error) {
    console.error("Failed to load portfolio data from MongoDB:", error);
    return {
      settings: null,
      theme: null,
      sections: [],
      profile: null,
      skillGroups: [],
      experiences: [],
      projects: [],
      services: [],
      testimonials: [],
    };
  }
}
