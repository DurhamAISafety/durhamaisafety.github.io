export const siteConfig = {
  title: "Durham AI Safety Initiative",
  description: "Durham AI Safety Initiative (DAISI) is a student-led organization at Durham University dedicated to advancing AI safety research, education, and community engagement.",
  email: "durhamaisi@durham.ac.uk",
  url: "https://durhamaisafety.github.io",
  ogImage: "/images/og-image.png",
  lang: "en_GB",

  social: {
    name: "Durham AI Safety Initiative",
    instagram: "https://www.instagram.com/ais_durham",
    linktree: "https://linktr.ee/aisdurham",
    discord: "https://forms.office.com/pages/responsepage.aspx?id=i9hQcmhLKUW-RNWaLYpvlEQMKT_SiZBCt87btAf__xhUQlRIVUdZSk5MUEJYSEFLQ0lUMFI1Wk41Ty4u&route=shorturl",
    links: [
      "https://www.instagram.com/ais_durham",
      "https://linktr.ee/aisdurham"
    ]
  },

  repository: "DurhamAISafety/durhamaisafety.github.io",
  showEditLink: false,
  googleSiteVerification: "BD22yCN98mhUEUuWtahSEQ18Jsti83oPb6WgG3LuCCw",

  navigation: [
    { title: "Home", url: "/" },
    { title: "Events", url: "/#events" },
    {
      title: "More",
      dropdown: [
        { title: "About Us", url: "/about/" },
        { title: "Programs", url: "/programs/" },
        { title: "Research", url: "/research/" },
        { title: "What is AI Safety?", url: "/what-is-ai-safety/" },
        { title: "Get Involved", url: "/get-involved/" }
      ]
    }
  ]
};
