export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
};

export type SiteSettings = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  accentColor: string;
  heroTextColor: string;
  heroOverlayOpacity: number;
  teamMembers: TeamMember[];
};
