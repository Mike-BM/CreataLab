## Deployment Architecture

This project is a hybrid application featuring a **React (Vite) Frontend** and an **Express.js (Node.js) Backend**.

### Recommended Hosting: Vercel (Hybrid)

Vercel is the recommended platform as it handles both the static frontend and the serverless backend functions automatically.

#### 1. Deployment Steps on Vercel
1. Go to [vercel.com](https://vercel.com) and import your Git repository.
2. The `vercel.json` already handles the routing.
3. Configure the **Environment Variables** (see below).
4. Run the build.

#### 2. Required Environment Variables
For the Admin Portal and Database connection to work on Vercel, you **MUST** set these in your Vercel Project Settings:

| Variable | Source / Description |
| :--- | :--- |
| `SUPABASE_URL` | From your Supabase Project Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | From your Supabase Project Settings (API Section) |
| `JWT_SECRET` | A secure random string for admin sessions |
| `ADMIN_EMAIL` | The email you'll use to log in |
| `ADMIN_DEFAULT_PASSWORD` | Initial password for the admin account |

---

## Technical Details

### Building for Production


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

#### **Netlify**
1. Build: `npm run build`
2. Deploy the `dist` folder.
*Note: You must also host the backend (server folder) separately if using Netlify, or use Netlify Functions.*

#### **Vercel**
1. Import repository.
2. Automatic detection will handle `npm run build`.
3. Set environment variables.


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

- The app uses **React Router** for frontend navigation.
- The Admin Portal depends on a **Node.js backend** (managed as serverless functions on Vercel via `vercel.json`).
- If you see "User not found" errors on login, check your Supabase environment variables in the host dashboard.

