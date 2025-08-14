# Durham AI Safety Initiative Website

This is the official repository for the Durham AI Safety Initiative (DAISI) website. The site is built using HTML, Tailwind CSS, and JavaScript, and is deployed using GitHub Pages.

## Site Structure

The repository is structured as follows:

```
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

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io.git
    cd AI-Safety-Durham.github.io
    ```

2.  **Install dependencies:**
    ```bash
    bundle install
    ```

3.  **Run the Jekyll server:**
    ```bash
    bundle exec jekyll serve
    ```

4.  Open your browser and navigate to `http://localhost:4000`.

## Making Changes

-   **Content:** Edit the HTML files in the root directory and `pages/` directory.
-   **Styling:** Most styling is done with Tailwind CSS utility classes directly in the HTML. For custom styles, edit `assets/css/styles.css`.
-   **Team Members:** To update the team page, edit the `_data/team.yml` file.
-   **Layout:** The main page structure is in `_layouts/default.html`. The header and footer are in `_includes/`.

## Testing

This repository uses `html-proofer` to check for broken links and images. The checks are run automatically via GitHub Actions when you push changes. To run the checks locally:

1.  Build the site:
    ```bash
    bundle exec jekyll build
    ```
2.  Run `html-proofer`:
    ```bash
    bundle exec htmlproofer ./_site
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

## Future Improvements

### Recommended Enhancements
1. **Content Management**: Add Jekyll collections for team members and events
2. **Blog System**: Add a blog for regular updates
3. **Search**: Implement site search functionality
4. **Contact Forms**: Integrate with form handling service
5. **Analytics**: Add Google Analytics for visitor insights

### Performance Optimizations
1. **Image Optimization**: Implement responsive images
2. **CSS Minification**: Use Jekyll plugins for asset optimization
3. **Caching**: Add cache headers via GitHub Pages settings

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [YAML Front Matter](https://jekyllrb.com/docs/front-matter/)

## Contact

For technical questions about the website, contact the web team or create an issue in the GitHub repository.
