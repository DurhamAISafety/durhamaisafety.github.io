# Durham AI Safety Initiative Website

This is the official repository for the Durham AI Safety Initiative (DAISI) website. The site is built using HTML, Tailwind CSS, and JavaScript, and is deployed using GitHub Pages.

## Site Structure

The repository is structured as follows:

```text
.
├── .github/
│   └── workflows/
│       └── build-and-deploy.yml  # GitHub Actions workflow
├── _data/
│   └── team.yml                  # Team member data
├── _includes/
│   ├── footer.html               # Site footer
│   └── header.html               # Site header
├── _layouts/
│   └── default.html              # Default page layout
├── assets/
│   ├── css/
│   │   └── styles.css            # Custom styles
│   └── js/
│       └── main.js               # Custom JavaScript
├── images/                       # Site images and logos
├── pages/                        # Sub-pages of the site
├── .gitignore
├── _config.yml                   # Jekyll configuration
├── Gemfile                       # Ruby dependencies
├── index.html                    # Home page
└── README.md                     # This file
```

## Local Development

To run the website locally, you'll need Ruby and Bundler installed.

1. **Clone the repository:**

    ```bash
    git clone https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io.git
    cd AI-Safety-Durham.github.io
    ```

2. **Install dependencies:**

    ```bash
    bundle install
    ```

3. **Run the Jekyll server:**

    ```bash
    bundle exec jekyll serve
    ```

4. Open your browser and navigate to `http://localhost:4000`.

## Making Changes

- **Content:** Edit the HTML files in the root directory and `pages/` directory.
- **Styling:** Most styling is done with Tailwind CSS utility classes directly in the HTML. For custom styles, edit `assets/css/styles.css`.
- **Team Members:** To update the team page, edit the `_data/team.yml` file.
- **Layout:** The main page structure is in `_layouts/default.html`. The header and footer are in `_includes/`.

## Testing

This repository uses `html-proofer` to check for broken links, images, favicons, and Open Graph metadata. CI runs a specific configuration that skips external link validation to avoid flaky failures (e.g., fonts/CDNs). To match CI locally, either run the helper script or use the equivalent command.

Option A — use the helper script:

```bash
bin/proof
```

Option B — run the commands explicitly:

```bash
bundle exec jekyll build
bundle exec htmlproofer ./_site \
    --checks Links,Images,Scripts,Favicon,OpenGraph \
    --ignore-urls '/localhost/,/127.0.0.1/,/example.com/' \
    --ignore-files './_site/assets/js/main.js' \
    --allow-missing-href \
    --assume-extension .html \
    --no-check-external-hash \
    --disable-external \
    --log-level :info
```


## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow is defined in `.github/workflows/build-and-deploy.yml`.

1. **Comments**: Add comments to complex CSS or JavaScript
2. **Validation**: Validate HTML and check for broken links
3. **Performance**: Monitor page load times
4. **Accessibility**: Ensure WCAG compliance

### SEO Best Practices

1. **Meta Descriptions**: Update page descriptions in front matter
2. **Title Tags**: Use descriptive, unique titles
3. **Structured Data**: Consider adding JSON-LD for events
4. **Internal Linking**: Link between related pages

## Common Tasks

### Adding a New Event

1. Update the events section in `index.html`
2. Consider creating an events data file for easier management

### Updating Contact Information

1. Edit `_config.yml` for global contact info
2. Update footer in `_includes/footer.html` if needed

### Adding New Research Projects

1. Update `research.html`
2. Follow the existing card structure
3. Use consistent status badges

### Form Updates

1. Forms currently show notifications only
2. To make functional, integrate with services like Netlify Forms or Formspree
3. Update the JavaScript in `assets/js/main.js`

## Troubleshooting

### Common Issues

1. **Changes not appearing**: Check GitHub Pages build status
2. **Styling broken**: Verify CSS file paths
3. **Navigation not working**: Check include file syntax
4. **Images not loading**: Verify image paths and file names

### Build Errors

- Check Jekyll build logs in GitHub Actions
- Validate YAML front matter syntax
- Ensure all required files are present

## Maintenance & Contributing

- See CONTRIBUTING.md for guidelines on structure, checks, and conventions.
- CI runs builds and link checks on every PR and push to `main`.

## License (split)

- Code (HTML, CSS, JS, templates, configuration) is licensed under the [MIT License](./LICENSE.md).
- Non-code content is licensed under [CC BY 4.0](./CONTENT_LICENSE.md), except:
- Member photos in `images/team/` and any images depicting identifiable individuals.
- Personal/sensitive data in `_data/team.yml` (names, emails, bios, links) — not for reuse or republication.
- The Durham AI Safety Initiative logo, logomark, wordmark, and other brand assets (e.g., `images/AIS-logo.png`, assets under `public/images/`) — all rights reserved.

If you’re unsure whether a particular file is covered, please open an issue.

