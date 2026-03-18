import siteConfigData from '../content/site-config.json';

export interface SocialLink {
  name: string;
  url: string;
  icon: string;       // image path in public/, e.g. "/images/icons/discord.svg"
  inHeader: boolean;
}

const normalizePublicPath = (value: string): string => {
  if (!value) return value;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return value.startsWith('/') ? value : `/${value}`;
};

export const siteConfig = {
  // Editable via CMS — values live in src/content/site-config.json
  title:        siteConfigData.title,
  description:  siteConfigData.description,
  email:        siteConfigData.email,
  ogImage:      siteConfigData.ogImage,
  socialLinks: siteConfigData.socialLinks.map((link) => ({
    ...link,
    icon: normalizePublicPath(link.icon),
  })) as SocialLink[],
  navigation: {
    main: siteConfigData.navigation.main,
    cta:  siteConfigData.navigation.cta,
  },
  footerTagline: siteConfigData.footerTagline,

  // Not CMS-editable — keep hardcoded
  url:                    "https://durhamaisafety.uk",
  lang:                   "en_GB",
  repository:             "DurhamAISafety/durhamaisafety.github.io",
  showEditLink:           false,
  googleSiteVerification: "BD22yCN98mhUEUuWtahSEQ18Jsti83oPb6WgG3LuCCw",

  // Legacy shim — keeps any code that still references siteConfig.social.* working.
  // Remove once Header/Footer are fully migrated to socialLinks.
  get social() {
    const find = (name: string) =>
      this.socialLinks.find(s => s.name.toLowerCase() === name.toLowerCase())?.url ?? '';
    return {
      name:      this.title,
      instagram: find('instagram'),
      discord:   find('discord'),
      linkedin:  find('linkedin'),
      linktree:  find('linktree'),
    };
  },
};