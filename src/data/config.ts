import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type {
  SiteConfigQuery,
  HomePageQuery,
  AboutPageQuery,
  ResearchPageQuery,
} from '../../tina/__generated__/types';

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
  googleCalendarBackupId: string;
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
  url: string;
  lang: string;
  repository: string;
  showEditLink: boolean;
  googleSiteVerification: string;
  _source: SiteConfigQuery['siteConfig'];
}

export type HomePageData = HomePageQuery['homePage'];
export type HomePageConfig = NonNullable<HomePageQuery['homePage']['home']>;
export type AboutPageData = AboutPageQuery['aboutPage'];
export type AboutPageConfig = NonNullable<AboutPageQuery['aboutPage']['about']>;
export type ResearchPageData = ResearchPageQuery['researchPage'];
export type ResearchPageConfig = NonNullable<ResearchPageQuery['researchPage']['research']>;


// Custom validation helper
function validatePath(path: string, fieldName: string) {
  if (path && !path.startsWith('/') && !path.startsWith('http://') && !path.startsWith('https://')) {
    throw new Error(
      `Validation Error: Path "${path}" in field "${fieldName}" must start with a leading slash "/" or be a fully qualified URL starting with "http://" or "https://".`
    );
  }
}

export async function getHomePageContent() {
  const result = await requestWithMetadata(
    client.queries.homePage({ relativePath: 'home.yml' })
  );
  const doc = result.data.homePage.home;
  if (!doc) {
    throw new Error("Validation Error: Missing home page configuration object.");
  }

  // Path validation
  validatePath(doc.heroPrimaryCtaLink, 'home.heroPrimaryCtaLink');
  validatePath(doc.heroSecondaryCtaLink, 'home.heroSecondaryCtaLink');

  return {
    document: result.data.homePage,
    homeConfig: doc,
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

  return {
    document: result.data.aboutPage,
    aboutConfig: doc,
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

  // Path validation
  validatePath(doc.opportunitiesCtaLink, 'research.opportunitiesCtaLink');
  if (doc.researchAreas) {
    doc.researchAreas.forEach((area, idx) => {
      if (area) {
        validatePath(area.linkUrl, `research.researchAreas.${idx}.linkUrl`);
      }
    });
  }

  return {
    document: result.data.researchPage,
    researchConfig: doc,
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

  const socialLinks = (document.socialLinks ?? []).map((link, idx) => {
    const url = link?.url ?? '';
    const icon = normalizePublicPath(link?.icon ?? '');
    validatePath(url, `siteConfig.socialLinks.${idx}.url`);
    validatePath(icon, `siteConfig.socialLinks.${idx}.icon`);
    return {
      name: link?.name ?? '',
      url,
      icon,
      inHeader: !!link?.inHeader,
      _index: idx,
    };
  });

  const mainNavigation = (document.navigation?.main ?? []).map((item, idx) => {
    const url = item?.url ?? '';
    validatePath(url, `siteConfig.navigation.main.${idx}.url`);
    return {
      title: item?.title ?? '',
      url,
    };
  });

  const ctaNavigation = {
    title: document.navigation?.cta?.title ?? '',
    url: document.navigation?.cta?.url ?? '',
  };
  validatePath(ctaNavigation.url, 'siteConfig.navigation.cta.url');

  const calendarConfig = {
    lumaCalendarId: document.calendar?.lumaCalendarId ?? 'cal-lvIwlKjJGAceOBN',
    lumaCalendarSlug: document.calendar?.lumaCalendarSlug ?? 'daisi',
    googleCalendarBackupId: document.calendar?.googleCalendarBackupId ?? 'b7bo0qsj27l7ahfaqgqiavjom9etg7sb@import.calendar.google.com',
  };

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
    url: "https://durhamaisafety.uk",
    lang: "en_GB",
    repository: "DurhamAISafety/durhamaisafety.github.io",
    showEditLink: false,
    googleSiteVerification: "BD22yCN98mhUEUuWtahSEQ18Jsti83oPb6WgG3LuCCw",
    _source: document,
  };

  return { document, siteConfig: config };
}
