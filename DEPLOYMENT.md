# CreataLab - Website Deployment Guide

## Building for Production

Your app is already configured to build as a static website. Here's how to deploy it:

### 1. Build the Production Version

```bash
npm run build
```

This creates a `dist` folder with all the optimized static files ready for deployment.

### 2. Preview the Production Build Locally

```bash
npm run serve
```

This serves the production build at `http://localhost:4173`

### 3. Deploy to Static Hosting

The `dist` folder contains everything needed for static hosting. You can deploy it to:

#### **Netlify** (Recommended - Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder to deploy
3. Or connect your Git repository and set build command: `npm run build` and publish directory: `dist`

#### **Vercel** (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Set build command: `npm run build`
4. Set output directory: `dist`

#### **GitHub Pages**
1. Build: `npm run build`
2. Copy contents of `dist` to your repository's `docs` folder or `gh-pages` branch
3. Enable GitHub Pages in repository settings

#### **Traditional Web Server**
1. Build: `npm run build`
2. Upload all files from the `dist` folder to your web server's public directory (e.g., `public_html`, `www`, `htdocs`)
3. Ensure your server is configured to serve `index.html` for all routes (SPA routing)

### 4. Server Configuration for SPA Routing

Since this is a React Router app, you need to configure your server to serve `index.html` for all routes:

#### **Apache (.htaccess)**
Create a `.htaccess` file in the `dist` folder:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### **Nginx**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### **Netlify/Vercel**
These platforms handle SPA routing automatically - no configuration needed!

## Development vs Production

- **Development**: `npm run dev` - Runs on `http://localhost:5173` with hot reload
- **Production**: `npm run build` + `npm run serve` - Optimized build on `http://localhost:4173`

## Environment Variables

Create a `.env.production` file for production-specific variables:
```
VITE_COMPANY_NAME=CreataLab
VITE_COMPANY_TAGLINE=Creative-Tech Innovation Lab
VITE_LOGO_URL=/logo.png
```

## Notes

- The app is a Single Page Application (SPA) using React Router
- All routes are handled client-side
- The build output is optimized and minified for production
- No backend server required - it's a static website!
