import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import { sanitiseInlineHtml } from '../lib/sanitize-html';
import type {
  AboutPageAbout,
  AboutPageAboutMissionCards,
  SiteConfigQuery,
  HomePageQuery,
  ResearchPageResearch,
  ResearchPageResearchOpportunities,
  ResearchPageResearchResearchAreas,
  AboutPageQuery,
  ResearchPageQuery,
  SiteConfigCalendar,
  SiteConfigNavigationCta,
  SiteConfigNavigationMain,
  SiteConfigSocialLinks,
} from '../../tina/__generated__/types';

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  inHeader: boolean;
  _index: number;
  _source: SiteConfigSocialLinks;
}

export interface NavigationItem {
  title: string;
  url: string;
  _source: SiteConfigNavigationMain | SiteConfigNavigationCta;
}

export interface CalendarConfig {
  lumaCalendarId: string;
  lumaCalendarSlug: string;
  googleCalendarBackupId: string;
  _source: SiteConfigCalendar;
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
  _source: SiteConfigQuery['siteConfig'];
}

export type HomePageData = HomePageQuery['homePage'];
export type HomePageConfig = NonNullable<HomePageQuery['homePage']['home']> & {
  heroTitleHtml: string;
};
export type AboutPageData = AboutPageQuery['aboutPage'];
export type AboutMissionCard = AboutPageAboutMissionCards;
export type AboutPageConfig = Omit<AboutPageAbout, 'missionCards'> & {
  missionCards: AboutMissionCard[];
  introTextHtml: string;
  impactTextHtml: string;
  joinTextHtml: string;
};
export type ResearchPageData = ResearchPageQuery['researchPage'];
export type ResearchOpportunity = ResearchPageResearchOpportunities;
export type ResearchArea = ResearchPageResearchResearchAreas;
export type ResearchPageConfig = Omit<ResearchPageResearch, 'opportunities' | 'researchAreas'> & {
  opportunities: ResearchOpportunity[];
  researchAreas: ResearchArea[];
};

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

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];

export async function getHomePageContent() {
  const result = await requestWithMetadata(
    client.queries.homePage({ relativePath: 'home.yml' })
  );
  const doc = result.data.homePage.home;
  if (!doc) {
    throw new Error("Validation Error: Missing home page configuration object.");
  }
  const homeConfig: HomePageConfig = {
    ...doc,
    heroTitleHtml: sanitiseInlineHtml(doc.heroTitle),
  };

  // Path validation
  validatePath(doc.heroPrimaryCtaLink, 'home.heroPrimaryCtaLink');
  validatePath(doc.heroSecondaryCtaLink, 'home.heroSecondaryCtaLink');

  return {
    document: result.data.homePage,
    homeConfig,
  };
}

export async function getAboutPageContent() {
  const result = await requestWithMetadata(
    client.queries.aboutPage({ relativePath: 'about.yml' })
  );
  const doc = result.data.aboutPage.about;
  if (!doc) {
    throw new Error("Validation Error: Missing about page configuration object.");
  }
  const aboutConfig: AboutPageConfig = {
    ...doc,
    missionCards: compact(doc.missionCards),
    introTextHtml: sanitiseInlineHtml(doc.introText),
    impactTextHtml: sanitiseInlineHtml(doc.impactText),
    joinTextHtml: sanitiseInlineHtml(doc.joinText),
  };

  return {
    document: result.data.aboutPage,
    aboutConfig,
  };
}

export async function getResearchPageContent() {
  const result = await requestWithMetadata(
    client.queries.researchPage({ relativePath: 'research.yml' })
  );
  const doc = result.data.researchPage.research;
  if (!doc) {
    throw new Error("Validation Error: Missing research page configuration object.");
  }
  const researchConfig: ResearchPageConfig = {
    ...doc,
    opportunities: compact(doc.opportunities),
    researchAreas: compact(doc.researchAreas),
  };

  // Path validation
  validatePath(researchConfig.opportunitiesCtaLink, 'research.opportunitiesCtaLink');
  researchConfig.researchAreas.forEach((area, idx) => {
    validatePath(area.linkUrl, `research.researchAreas.${idx}.linkUrl`);
  });

  return {
    document: result.data.researchPage,
    researchConfig,
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

  const socialLinks = compact(document.socialLinks).map((link, idx) => {
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
      _source: link,
    };
  });

  const mainNavigation = compact(document.navigation?.main).map((item, idx) => {
    const url = item.url;
    validatePath(url, `siteConfig.navigation.main.${idx}.url`);
    return {
      title: item.title,
      url,
      _source: item,
    };
  });

  const ctaSource = document.navigation?.cta;
  if (!ctaSource) {
    throw new Error("Validation Error: Missing site navigation CTA.");
  }
  const ctaNavigation: NavigationItem = {
    title: ctaSource.title,
    url: ctaSource.url,
    _source: ctaSource,
  };
  validatePath(ctaNavigation.url, 'siteConfig.navigation.cta.url');

  const calendarSource = document.calendar;
  if (!calendarSource) {
    throw new Error("Validation Error: Missing site calendar configuration.");
  }
  const calendarConfig = {
    lumaCalendarId: calendarSource.lumaCalendarId,
    lumaCalendarSlug: calendarSource.lumaCalendarSlug,
    googleCalendarBackupId: calendarSource.googleCalendarBackupId,
    _source: calendarSource,
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
    url: "https://durhamaisafety.uk",
    lang: "en_GB",
    repository: "DurhamAISafety/durhamaisafety.github.io",
    showEditLink: false,
    googleSiteVerification: "BD22yCN98mhUEUuWtahSEQ18Jsti83oPb6WgG3LuCCw",
    _source: document,
  };

  return { document, siteConfig: config };
}
