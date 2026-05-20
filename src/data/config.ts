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
  programmesTitle: string;
  researchTitle: string;
  researchSubtitle: string;
  researchViewAllText: string;
}

export interface MissionCard {
  icon: string;
  title: string;
  description: string;
}

export interface AboutPageConfig {
  introText: string;
  missionCards: MissionCard[];
  impactTitle: string;
  impactIcon: string;
  impactText: string;
  joinTitle: string;
  joinText: string;
}

export interface OpportunityCard {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface ResearchAreaCard {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  linkUrl: string;
}

export interface ResearchPageConfig {
  opportunitiesTitle: string;
  opportunities: OpportunityCard[];
  opportunitiesCtaText: string;
  opportunitiesCtaLink: string;
  areasTitle: string;
  researchAreas: ResearchAreaCard[];
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
  aboutPage: AboutPageConfig;
  researchPage: ResearchPageConfig;
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
    programmesTitle: (document.homepage as any)?.programmesTitle ?? 'Our Programmes',
    researchTitle: document.homepage?.researchTitle ?? 'Research',
    researchSubtitle: document.homepage?.researchSubtitle ?? 'Latest Publications & Projects',
    researchViewAllText: document.homepage?.researchViewAllText ?? 'View All Research',
  };

  const aboutPageConfig: AboutPageConfig = {
    introText: (document as any).aboutPage?.introText ?? 'We are a <a href="#team" class="text-bright-purple hover:text-light-purple font-semibold transition-colors underline decoration-bright-purple/50 hover:decoration-light-purple">student-led</a> initiative that aims to empower students and academics to <a href="/what-is-ai-safety/" class="text-bright-purple hover:text-light-purple font-semibold transition-colors underline decoration-bright-purple/50 hover:decoration-light-purple">reduce risk from advanced AI</a>, by:',
    missionCards: ((document as any).aboutPage?.missionCards ?? []).map((card: any) => ({
      icon: card?.icon ?? '',
      title: card?.title ?? '',
      description: card?.description ?? '',
    })),
    impactTitle: (document as any).aboutPage?.impactTitle ?? 'Our Impact',
    impactIcon: (document as any).aboutPage?.impactIcon ?? 'fas fa-chart-line',
    impactText: (document as any).aboutPage?.impactText ?? 'Our members have published in top AI and law conferences, participated in <a href="https://www.matsprogram.org/" target="_blank" rel="noopener noreferrer" class="text-durham-purple hover:text-bright-purple font-semibold transition-colors underline">MATS</a> and gone on to study AI ethics at Cambridge.',
    joinTitle: (document as any).aboutPage?.joinTitle ?? 'Join Our Team',
    joinText: (document as any).aboutPage?.joinText ?? 'If you want to help organise and shape DAISI, contact <a href="mailto:durhamaisi@durham.ac.uk" class="text-bright-purple hover:text-light-purple font-semibold transition-colors">durhamaisi@durham.ac.uk</a> and we\'ll be in touch!',
  };

  const researchPageConfig: ResearchPageConfig = {
    opportunitiesTitle: (document as any).researchPage?.opportunitiesTitle ?? 'Research Opportunities',
    opportunities: ((document as any).researchPage?.opportunities ?? []).map((opp: any) => ({
      icon: opp?.icon ?? '',
      iconColor: opp?.iconColor ?? 'text-bright-purple',
      title: opp?.title ?? '',
      description: opp?.description ?? '',
    })),
    opportunitiesCtaText: (document as any).researchPage?.opportunitiesCtaText ?? "I'm Interested",
    opportunitiesCtaLink: (document as any).researchPage?.opportunitiesCtaLink ?? '/programmes/#research-projects',
    areasTitle: (document as any).researchPage?.areasTitle ?? 'Research Areas',
    researchAreas: ((document as any).researchPage?.researchAreas ?? []).map((area: any) => ({
      icon: area?.icon ?? '',
      iconColor: area?.iconColor ?? 'text-bright-purple',
      title: area?.title ?? '',
      description: area?.description ?? '',
      linkUrl: area?.linkUrl ?? '',
    })),
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
    aboutPage: aboutPageConfig,
    researchPage: researchPageConfig,
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