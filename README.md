# Durham AI Safety Initiative Website

The official website for Durham AI Safety Initiative, built with Astro and hosted on Netlify.

## 🌐 Live Site

- **Production**: [https://durhamaisafety.netlify.app/](https://durhamaisafety.netlify.app/)
- **Development**: Available on multiple branches for testing

## 🏗️ Tech Stack

- **Framework**: [Astro](https://astro.build/) - Modern static site generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Hosting**: [Netlify](https://netlify.com/) - JAMstack deployment platform
- **Package Manager**: npm

## 🚀 Development

### Prerequisites
- Node.js 18+ 
- npm

### Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io.git
   cd AI-Safety-Durham.github.io
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start development server**
   ```sh
   npm run dev
   ```
   
   The site will be available at `http://localhost:4000`

### Available Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4000`     |
| `npm run build`           | Build your production site to `./dist/`         |
| `npm run preview`         | Preview your build locally, before deploying    |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 📁 Project Structure

```text
/
├── public/                 # Static assets (images, fonts, etc.)
│   └── images/            # Website images and logos
├── src/
│   ├── layouts/           # Page layouts and templates
│   │   └── Layout.astro   # Main layout with header/footer
│   ├── pages/             # Website pages (auto-routed)
│   │   ├── index.astro    # Redirects to /home/
│   │   ├── home.astro     # Homepage
│   │   ├── our-team.astro # Team page
│   │   └── ...           # Other pages
│   └── styles/            # Global CSS and styling
│       └── global.css     # Tailwind imports and custom styles
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Styling

The website uses a custom color scheme defined in `tailwind.config.mjs`:

- **Ocean Blue**: `#0891b2`
- **Deep Blue**: `#0e4a5c`
- **Navy**: `#1e3a8a`
- **Teal**: `#14b8a6`
- **Emerald**: `#10b981`
- **Sage**: `#84cc16`
- **Mint**: `#6ee7b7`

## 🌍 Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch. The build command used is:

```sh
npm run build
```

## 🔗 Clean URLs

The site is configured to use clean URLs (no `.html` extensions):
- `/home/` instead of `/home.html`
- `/our-team/` instead of `/our-team.html`
- etc.

This is handled by Astro's `format: 'directory'` configuration in `astro.config.mjs`.

## 📧 Contact

For questions about the website or to get involved with Durham AI Safety Initiative:

- **Email**: [aisdurham@googlegroups.com](mailto:aisdurham@googlegroups.com)
- **Instagram**: [@ais_durham](https://www.instagram.com/ais_durham)
- **Linktree**: [linktr.ee/aisdurham](https://linktr.ee/aisdurham)

---

Durham AI Safety Initiative is a registered student society with Durham Students' Union.

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
