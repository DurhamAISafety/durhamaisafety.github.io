# Durham AISI Website Maintenance Guide

## Overview
This guide provides information for maintaining and updating the Durham AI Safety Initiative website.

## Site Structure

```
├── _config.yml              # Site configuration
├── _layouts/                 # Page templates
│   └── default.html         # Main layout template
├── _includes/               # Reusable components
│   ├── header.html         # Navigation header
│   └── footer.html         # Site footer
├── _sass/                  # Sass/SCSS files (if added)
├── assets/                 # Static assets
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   └── js/
│       └── main.js         # Main JavaScript file
├── images/                 # Image assets
├── *.html                  # Main content pages
└── README.md              # This file
```

## Making Changes

### 1. Content Updates

#### Text Changes
- Edit the relevant `.html` files directly
- For consistent changes across pages, update the includes in `_includes/`

#### Adding New Pages
1. Create a new `.html` file in the root directory
2. Add front matter at the top:
   ```yaml
   ---
   layout: default
   title: "Page Title"
   description: "Page description for SEO"
   ---
   ```
3. Add the page to navigation in `_includes/header.html`

#### Updating Team Information
- Edit the team cards in `our-team.html`
- Consider creating a `_data/team.yml` file for easier management

### 2. Design Changes

#### Global Styles
- Edit `assets/css/styles.css` for site-wide styling changes
- CSS variables at the top of the file control colors and spacing

#### Component Styles
- Component-specific styles are in the individual include files
- Common utilities are in the main stylesheet

### 3. Configuration

#### Site Settings
Edit `_config.yml` to update:
- Site title and description
- Contact information
- Social media links
- SEO settings

#### Navigation
- Main navigation: `_includes/header.html`
- Dropdown menu items can be managed in `_config.yml` under `dropdown_pages`

## Development Setup

### Local Development
1. Install Jekyll: `gem install bundler jekyll`
2. Clone the repository
3. Run `bundle install` (if Gemfile exists)
4. Run `bundle exec jekyll serve` or `jekyll serve`
5. Visit `http://localhost:4000`

### GitHub Pages Deployment
- Push changes to the `main` branch
- GitHub Pages automatically builds and deploys the site
- Changes may take 5-10 minutes to appear

## Best Practices

### Content Management
1. **Consistent Formatting**: Use the established design patterns
2. **Image Optimization**: Compress images before uploading
3. **Alt Text**: Always include descriptive alt text for images
4. **Mobile Testing**: Test changes on mobile devices

### Code Maintenance
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
