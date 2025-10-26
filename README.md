# Durham AI Safety Initiative Website

This is the official repository for the Durham AI Safety Initiative (DAISI) website. The site is built using **Astro**, **Tailwind CSS**, and **TypeScript**, and is deployed using GitHub Pages.

## Site Structure

The repository is structured as follows:

```text
.
├── .github/
│   └── workflows/
│       └── deploy-astro.yml      # GitHub Actions workflow
├── src/
│   ├── components/
│   │   ├── Footer.astro          # Site footer
│   │   └── Header.astro          # Site header
│   ├── data/
│   │   ├── config.ts             # Site configuration
│   │   └── team.ts               # Team member data (TypeScript)
│   ├── layouts/
│   │   └── Layout.astro          # Main page layout
│   └── pages/
│       ├── index.astro           # Home page
│       ├── about.astro           # About page
│       ├── get-involved.astro    # Get Involved page
│       ├── programs.astro        # Programs page
│       ├── research.astro        # Research page
│       ├── what-is-ai-safety.astro
│       └── 404.astro             # 404 error page
├── public/
│   ├── css/
│   │   └── styles.css            # Custom styles
│   ├── js/
│   │   └── main.js               # Custom JavaScript
│   ├── images/                   # Site images and logos
│   └── robots.txt
├── .gitignore
├── astro.config.mjs              # Astro configuration
├── tailwind.config.mjs           # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Node dependencies
└── README.md                     # This file
```

## Local Development

To run the website locally, you'll need Node.js (v18+) and npm installed.

1. **Clone the repository:**

    ```bash
    git clone https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io.git
    cd AI-Safety-Durham.github.io
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:4321`.

## Making Changes

- **Content:** Edit the `.astro` files in the `src/pages/` directory.
- **Styling:** Most styling is done with Tailwind CSS utility classes. For custom global styles, edit `public/css/styles.css` or add styles to `src/layouts/Layout.astro`.
- **Team Members:** To update the team page, edit `src/data/team.ts`.
- **Layout:** The main page structure is in `src/layouts/Layout.astro`. The header and footer components are in `src/components/`.
- **Configuration:** Site-wide settings are in `src/data/config.ts`.

## Building for Production

To build the site for production:

```bash
npm run build
```

The built site will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow is defined in `.github/workflows/deploy-astro.yml`.

## Best Practices

### Code Quality

1. **TypeScript**: Use TypeScript for type safety in data files
2. **Components**: Break down complex UI into reusable components
3. **Validation**: Test builds locally before pushing
4. **Performance**: Astro automatically optimizes assets

### SEO Best Practices

1. **Meta Descriptions**: Update page descriptions in Layout frontmatter
2. **Title Tags**: Use descriptive, unique titles for each page
3. **Structured Data**: JSON-LD structured data is included in Layout.astro
4. **Internal Linking**: Link between related pages

## Common Tasks

### Adding a New Event

1. Update the events section in `src/pages/index.astro`
2. Consider creating an events data file in `src/data/events.ts` for easier management

### Updating Contact Information

1. Edit `src/data/config.ts` for global contact info
2. Update footer in `src/components/Footer.astro` if needed

### Adding New Team Members

1. Edit `src/data/team.ts`
2. Follow the existing TypeScript interface structure
3. Add team member photos to `public/images/team/`

### Adding New Research Projects

1. Update `src/pages/research.astro`
2. Follow the existing card structure
3. Use consistent status badges

### Form Updates

1. Forms currently show notifications only
2. To make functional, integrate with services like Netlify Forms or Formspree
3. Update the JavaScript in `public/js/main.js`

## Troubleshooting

### Common Issues

1. **Changes not appearing**: Check GitHub Pages build status in Actions tab
2. **Styling broken**: Verify Tailwind classes and CSS file paths
3. **Build errors**: Run `npm run build` locally to see detailed errors
4. **Images not loading**: Verify image paths start with `/` for public assets

### Build Errors

- Check GitHub Actions logs for detailed error messages
- Validate TypeScript types in data files
- Ensure all required frontmatter properties are present
- Run `npm run build` locally to catch errors before pushing

## Migration Notes

This site was migrated from Jekyll to Astro in October 2025. Benefits include:

- 🚀 Faster builds and hot module reloading
- 📦 Modern JavaScript/TypeScript tooling
- 🎯 Type-safe data handling
- ⚡ Zero JS by default for better performance
- 🔧 Better developer experience

See `ASTRO_MIGRATION.md` for detailed migration documentation.

## Maintenance & Contributing

- See CONTRIBUTING.md for guidelines on structure, checks, and conventions.
- CI runs builds on every PR and push to `main`.

## License (split)

- Code (HTML, CSS, JS, templates, configuration) is licensed under the [MIT License](./LICENSE.md).
- Non-code content is licensed under [CC BY 4.0](./CONTENT_LICENSE.md), except:
- Member photos in `public/images/team/` and any images depicting identifiable individuals.
- Personal/sensitive data in `src/data/team.ts` (names, emails, bios, links) — not for reuse or republication.
- The Durham AI Safety Initiative logo, logomark, wordmark, and other brand assets under `public/images/` (e.g., `public/images/AIS-logo.png`) — all rights reserved.

If you’re unsure whether a particular file is covered, please open an issue.

