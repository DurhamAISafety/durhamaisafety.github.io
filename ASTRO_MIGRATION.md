# Astro Migration Guide

## ✅ What We've Completed

### 1. Project Setup
- ✅ Installed Astro with TypeScript
- ✅ Configured Tailwind CSS with your custom colors
- ✅ Set up project structure (`src/layouts`, `src/components`, `src/data`, `src/pages`)
- ✅ Copied static assets to `public/` folder

### 2. Data Migration
- ✅ Migrated `_data/team.yml` → `src/data/team.ts` (TypeScript with type safety!)
- ✅ Created `src/data/config.ts` with all site configuration

### 3. Components Created
- ✅ `src/components/Header.astro` - Navigation header
- ✅ `src/components/Footer.astro` - Footer with back-to-top button
- ✅ `src/layouts/Layout.astro` - Main layout with SEO, structured data, etc.

### 4. Pages Migrated
- ✅ `src/pages/index.astro` - Homepage with hero section, events calendar, and program cards

### 5. GitHub Actions
- ✅ Created `.github/workflows/deploy-astro.yml` for automated deployment

## 🚀 Testing Your Site

Your Astro dev server is currently running! Open your browser to:
**http://localhost:4321/**

## 📋 Next Steps - What You Need to Do

### 1. Migrate Remaining Pages
You need to convert these Jekyll pages to Astro:

```
pages/about-us.html       → src/pages/about.astro
pages/get-involved.html   → src/pages/get-involved.astro
pages/programs.html       → src/pages/programs.astro
pages/research.html       → src/pages/research.astro
pages/what-is-ai-safety.html → src/pages/what-is-ai-safety.astro
our-team.html             → src/pages/our-team.astro
404.html                  → src/pages/404.astro
```

**How to migrate each page:**
1. Read the existing HTML file
2. Extract the content between `<main>` tags
3. Create a new `.astro` file in `src/pages/`
4. Import and use the Layout component
5. Paste the HTML content inside the Layout
6. Remove Jekyll liquid syntax (`{{ }}` and `{% %}`)
7. Update relative URLs (remove `relative_url` filters)

**Example for our-team.html:**
```astro
---
import Layout from '../layouts/Layout.astro';
import { team } from '../data/team';
---

<Layout title="Our Team">
  <section class="py-16">
    <div class="container mx-auto px-6">
      <h1 class="text-4xl font-bold mb-8">Our Team</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member) => (
          <div class="text-center">
            {member.photo && (
              <img src={member.photo} alt={member.name} class="w-32 h-32 rounded-full mx-auto mb-4" />
            )}
            <h3 class="text-xl font-bold">{member.name}</h3>
            <p class="text-purple-300">{member.role}</p>
            {member.link && (
              <a href={member.link} target="_blank" rel="noopener noreferrer">Profile</a>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
</Layout>
```

### 2. Test Thoroughly
- Check all links work correctly
- Verify images load
- Test responsive design
- Check calendar functionality
- Test dropdown navigation

### 3. Update GitHub Pages Settings
Before deploying, you need to:

1. Go to your repo settings: `https://github.com/DurhamAISafety/durhamaisafety.github.io/settings/pages`
2. Under "Build and deployment":
   - Source: **GitHub Actions** (not "Deploy from a branch")
3. Commit and push your changes to main branch
4. The workflow will automatically build and deploy

### 4. Clean Up (Optional)
Once everything works, you can remove Jekyll files:
- `_config.yml`
- `_layouts/`
- `_includes/`
- `_data/`
- `Gemfile`, `Gemfile.lock`
- `.bundle/`, `vendor/`
- Old Jekyll `pages/` and root HTML files

**Don't delete these yet! Keep them until migration is complete.**

## 🎨 CSS Notes

Your custom CSS from `assets/css/styles.css` is still being loaded. Review it and:
- Move global styles to `src/layouts/Layout.astro` in a `<style is:global>` tag
- Move component-specific styles into component files
- Ensure Tailwind classes aren't conflicting

## 📦 Key Differences: Jekyll vs Astro

| Feature | Jekyll | Astro |
|---------|--------|-------|
| Templates | Liquid (`{{ }}`) | JSX-like (`{var}`) |
| Includes | `{% include %}` | Import components |
| Data files | YAML in `_data/` | TypeScript/JSON in `src/data/` |
| URLs | `relative_url` filter | Just write `/path/` |
| For loops | `{% for %}` | `{arr.map(() => ())}` |
| Conditionals | `{% if %}` | `{condition && ()}` |
| Scripts | Separate files | `<script>` tags in `.astro` files |

## 🆘 Need Help?

Common issues:

1. **Import errors**: Make sure paths start with `../` or `./`
2. **CSS not loading**: Check file is in `public/assets/`
3. **Images broken**: Ensure they're in `public/images/`
4. **Build fails**: Check for TypeScript errors

## ⚡ Benefits You'll Get

- **Faster builds**: Astro is much faster than Jekyll
- **Better DX**: Hot module reloading, better error messages
- **Type safety**: TypeScript catches errors before deployment
- **Modern tooling**: npm ecosystem, VS Code integration
- **Zero JS by default**: Even faster site for users
- **Component reusability**: Easy to maintain and update

Keep the dev server running while you migrate pages. Changes will hot-reload automatically!
