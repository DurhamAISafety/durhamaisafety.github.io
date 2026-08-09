import { readYaml, readJson } from './content';
import { sanitiseInlineHtml } from '../lib/sanitize-html';

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  inHeader: boolean;
  _index: number;
}

export interface NavigationItem {
  title: string;
  url: string;
}

export interface CalendarConfig {
  lumaCalendarId: string;
  lumaCalendarSlug: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  email: string;
  ogImage: string;
  socialLinks: SocialLink[];
  navigation: {
    main: NavigationItem[];
    cta: NavigationItem;
  };
  footerTagline?: string;
  calendar: CalendarConfig;
  url: string;
  lang: string;
  repository: string;
  showEditLink: boolean;
  googleSiteVerification: string;
}

export interface HomePageConfig {
  heroTitle: string;
  heroTitleHtml: string;
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
  [key: string]: unknown;
}

export interface AboutMissionCard {
  icon: string;
  title: string;
  description: string;
}

export interface AboutPageConfig {
  introText: string;
  introTextHtml: string;
  missionCards: AboutMissionCard[];
  impactTitle: string;
  impactIcon: string;
  impactText: string;
  impactTextHtml: string;
  joinTitle: string;
  joinText: string;
  joinTextHtml: string;
  [key: string]: unknown;
}

export interface ResearchOpportunity {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface ResearchArea {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  linkUrl: string;
}

export interface ResearchPageConfig {
  opportunitiesTitle: string;
  opportunities: ResearchOpportunity[];
  opportunitiesCtaText: string;
  opportunitiesCtaLink: string;
  areasTitle: string;
  researchAreas: ResearchArea[];
  [key: string]: unknown;
}

// Custom validation helper
function validatePath(path: string, fieldName: string) {
  if (!path?.trim()) {
    throw new Error(`Validation Error: Path in field "${fieldName}" is required.`);
  }
  if (!path.startsWith('/') && !path.startsWith('http://') && !path.startsWith('https://')) {
    throw new Error(
      `Validation Error: Path "${path}" in field "${fieldName}" must start with a leading slash "/" or be a fully qualified URL starting with "http://" or "https://".`
    );
  }
}

export async function getHomePageContent(): Promise<{ document: any; homeConfig: HomePageConfig }> {
  const { home: doc } = readYaml<{ home?: any }>('pages/home.yml');
  if (!doc) {
    throw new Error('Validation Error: Missing home page configuration object.');
  }
  const homeConfig: HomePageConfig = {
    ...doc,
    heroTitleHtml: sanitiseInlineHtml(doc.heroTitle),
  };

  validatePath(doc.heroPrimaryCtaLink, 'home.heroPrimaryCtaLink');
  validatePath(doc.heroSecondaryCtaLink, 'home.heroSecondaryCtaLink');

  return { document: doc, homeConfig };
}

export async function getAboutPageContent(): Promise<{ document: any; aboutConfig: AboutPageConfig }> {
  const { about: doc } = readYaml<{ about?: any }>('pages/about.yml');
  if (!doc) {
    throw new Error('Validation Error: Missing about page configuration object.');
  }
  const aboutConfig: AboutPageConfig = {
    ...doc,
    missionCards: doc.missionCards ?? [],
    introTextHtml: sanitiseInlineHtml(doc.introText),
    impactTextHtml: sanitiseInlineHtml(doc.impactText),
    joinTextHtml: sanitiseInlineHtml(doc.joinText),
  };

  return { document: doc, aboutConfig };
}

export async function getResearchPageContent(): Promise<{ document: any; researchConfig: ResearchPageConfig }> {
  const { research: doc } = readYaml<{ research?: any }>('pages/research.yml');
  if (!doc) {
    throw new Error('Validation Error: Missing research page configuration object.');
  }
  const researchConfig: ResearchPageConfig = {
    ...doc,
    opportunities: doc.opportunities ?? [],
    researchAreas: doc.researchAreas ?? [],
  };

  validatePath(researchConfig.opportunitiesCtaLink, 'research.opportunitiesCtaLink');
  researchConfig.researchAreas.forEach((area, idx) => {
    validatePath(area.linkUrl, `research.researchAreas.${idx}.linkUrl`);
  });

  return { document: doc, researchConfig };
}

export async function getSiteConfigContent(): Promise<{ document: any; siteConfig: SiteConfig }> {
  const document = readJson<any>('site-config.json');

  const normalizePublicPath = (value: string): string => {
    if (!value) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return value.startsWith('/') ? value : `/${value}`;
  };

  const socialLinks: SocialLink[] = (document.socialLinks ?? []).map((link: any, idx: number) => {
    const url = link.url;
    const icon = normalizePublicPath(link.icon);
    validatePath(url, `siteConfig.socialLinks.${idx}.url`);
    validatePath(icon, `siteConfig.socialLinks.${idx}.icon`);
    return {
      name: link.name,
      url,
      icon,
      inHeader: !!link?.inHeader,
      _index: idx,
    };
  });

  const mainNavigation: NavigationItem[] = (document.navigation?.main ?? []).map((item: any, idx: number) => {
    const url = item.url;
    validatePath(url, `siteConfig.navigation.main.${idx}.url`);
    return { title: item.title, url };
  });

  const ctaSource = document.navigation?.cta;
  if (!ctaSource) {
    throw new Error('Validation Error: Missing site navigation CTA.');
  }
  const ctaNavigation: NavigationItem = { title: ctaSource.title, url: ctaSource.url };
  validatePath(ctaNavigation.url, 'siteConfig.navigation.cta.url');

  const calendarSource = document.calendar;
  if (!calendarSource) {
    throw new Error('Validation Error: Missing site calendar configuration.');
  }
  const calendarConfig: CalendarConfig = {
    lumaCalendarId: calendarSource.lumaCalendarId,
    lumaCalendarSlug: calendarSource.lumaCalendarSlug,
  };

  const config: SiteConfig = {
    title: document.title,
    description: document.description,
    email: document.email,
    ogImage: document.ogImage ?? '/images/og-image.png',
    socialLinks,
    navigation: {
      main: mainNavigation,
      cta: ctaNavigation,
    },
    footerTagline: document.footerTagline ?? undefined,
    calendar: calendarConfig,
    url: 'https://durhamaisafety.uk',
    lang: 'en_GB',
    repository: 'DurhamAISafety/durhamaisafety.github.io',
    showEditLink: false,
    googleSiteVerification: 'BD22yCN98mhUEUuWtahSEQ18Jsti83oPb6WgG3LuCCw',
  };

  return { document, siteConfig: config };
}
