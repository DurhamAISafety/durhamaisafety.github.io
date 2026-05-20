import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type { SiteConfigQuery } from '../../tina/__generated__/types';

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  inHeader: boolean;
  _index: number; // Stored to preserve original index for Visual Editor targeting
}

export interface NavigationItem {
  title: string;
  url: string;
}

export interface CalendarConfig {
  lumaCalendarId: string;
  lumaCalendarSlug: string;
  googleCalendarBackupId: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitleHighlight: string;
  heroSubtitleMain: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  eventsTitle: string;
  researchTitle: string;
  researchSubtitle: string;
  researchViewAllText: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  email: string;
  ogImage?: string;
  socialLinks: SocialLink[];
  navigation: {
    main: NavigationItem[];
    cta: NavigationItem;
  };
  footerTagline?: string;
  calendar: CalendarConfig;
  homepage: HomepageConfig;
  url: string;
  lang: string;
  repository: string;
  showEditLink: boolean;
  googleSiteVerification: string;
  _source: any;
  // Legacy compatibility layer for social object
  social: {
    name: string;
    instagram: string;
    discord: string;
    linkedin: string;
    linktree: string;
  };
}

export async function getSiteConfigContent(): Promise<{
  document: SiteConfigQuery['siteConfig'];
  siteConfig: SiteConfig;
}> {
  const result = await requestWithMetadata(
    client.queries.siteConfig({ relativePath: 'site-config.json' })
  );
  
  const document = result.data.siteConfig;
  
  const normalizePublicPath = (value: string): string => {
    if (!value) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return value.startsWith('/') ? value : `/${value}`;
  };

  const socialLinks = (document.socialLinks ?? []).map((link, idx) => ({
    name: link?.name ?? '',
    url: link?.url ?? '',
    icon: normalizePublicPath(link?.icon ?? ''),
    inHeader: !!link?.inHeader,
    _index: idx,
  }));

  const mainNavigation = (document.navigation?.main ?? []).map((item) => ({
    title: item?.title ?? '',
    url: item?.url ?? '',
  }));

  const ctaNavigation = {
    title: document.navigation?.cta?.title ?? '',
    url: document.navigation?.cta?.url ?? '',
  };

  const calendarConfig = {
    lumaCalendarId: document.calendar?.lumaCalendarId ?? 'cal-lvIwlKjJGAceOBN',
    lumaCalendarSlug: document.calendar?.lumaCalendarSlug ?? 'daisi',
    googleCalendarBackupId: document.calendar?.googleCalendarBackupId ?? 'b7bo0qsj27l7ahfaqgqiavjom9etg7sb@import.calendar.google.com',
  };

  const homepageConfig = {
    heroTitle: document.homepage?.heroTitle ?? 'Durham students and academics for <em>reducing catastrophic risks from advanced AI</em>',
    heroSubtitleHighlight: document.homepage?.heroSubtitleHighlight ?? 'Whatever your expertise,',
    heroSubtitleMain: document.homepage?.heroSubtitleMain ?? 'you can contribute to the conversation and make a difference.',
    heroPrimaryCtaText: document.homepage?.heroPrimaryCtaText ?? 'Get Involved',
    heroPrimaryCtaLink: document.homepage?.heroPrimaryCtaLink ?? '/get-involved/',
    heroSecondaryCtaText: document.homepage?.heroSecondaryCtaText ?? 'About',
    heroSecondaryCtaLink: document.homepage?.heroSecondaryCtaLink ?? '/about/',
    eventsTitle: document.homepage?.eventsTitle ?? 'Our Events',
    researchTitle: document.homepage?.researchTitle ?? 'Research',
    researchSubtitle: document.homepage?.researchSubtitle ?? 'Latest Publications & Projects',
    researchViewAllText: document.homepage?.researchViewAllText ?? 'View All Research',
  };

  const findSocialUrl = (name: string) =>
    socialLinks.find(s => s.name.toLowerCase() === name.toLowerCase())?.url ?? '';

  const config: SiteConfig = {
    title: document.title,
    description: document.description,
    email: document.email,
    ogImage: document.ogImage ?? undefined,
    socialLinks,
    navigation: {
      main: mainNavigation,
      cta: ctaNavigation,
    },
    footerTagline: document.footerTagline ?? undefined,
    calendar: calendarConfig,
    homepage: homepageConfig,
    url: "https://durhamaisafety.uk",
    lang: "en_GB",
    repository: "DurhamAISafety/durhamaisafety.github.io",
    showEditLink: false,
    googleSiteVerification: "BD22yCN98mhUEUuWtahSEQ18Jsti83oPb6WgG3LuCCw",
    _source: document,
    social: {
      name: document.title,
      instagram: findSocialUrl('instagram'),
      discord: findSocialUrl('discord'),
      linkedin: findSocialUrl('linkedin'),
      linktree: findSocialUrl('linktree'),
    }
  };

  return { document, siteConfig: config };
}