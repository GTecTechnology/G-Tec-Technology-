# G-Tec Technology Web Application

Enterprise Hardware Storefront, Corporate Quote Intake, and Admin Management Portal.

## Why GitHub Pages showed a blank white page (Fixed)

Vite by default uses absolute paths (`/assets/...`) for scripts and styles in the production build. On GitHub Pages, repositories are hosted on a subpath (e.g. `https://<username>.github.io/<repository-name>/`), so absolute `/assets/...` URLs pointed to the root domain and returned **404 Not Found**, resulting in a blank white page.

### The Fixes Applied:
1. **Relative Asset Base (`base: './'`)**: Configured `base: './'` in `vite.config.ts` so all assets (JavaScript, CSS, fonts, and images) use relative paths that resolve properly in any GitHub Pages subpath or custom domain.
2. **Bundled Asset Processing**: Converted image references from raw string paths to ESM imports so Vite automatically processes, hashes, and optimizes images into `dist/assets/`.
3. **`.nojekyll` File**: Added `.nojekyll` into the `dist` directory so GitHub Pages does not run Jekyll, preventing underscore and asset blocking.
4. **`404.html` Routing**: Added `404.html` (matching `index.html`) so single-page application refreshes and direct links do not 404.
5. **Offline / GitHub Pages Fallback**: When running statically on GitHub Pages without the Express backend, all features (product browsing, cart, quote requests, local storage caching, and admin login) operate smoothly using local fallbacks.

## Deploying to GitHub Pages

### Option A: Automatic via GitHub Actions (Recommended)
This repository includes `.github/workflows/deploy.yml`:
1. Push your repository to GitHub (`main` or `master` branch).
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. GitHub Actions will automatically build and deploy your site to `https://<username>.github.io/<repo-name>/`.

### Option B: Deploying Pre-built `dist` Folder (Manual)
1. Run `npm run build`.
2. Push the contents of the `dist/` folder to your `gh-pages` branch.
3. In **Settings** > **Pages**, select **Deploy from a branch**, choose `gh-pages` and `/ (root)`.
