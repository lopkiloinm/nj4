# Fal Image Editor

A modern Next.js image editor built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern UI with Tailwind CSS
- ⚡ React 19 with React Compiler
- 🖼️ Image editing capabilities
- 📱 Responsive design
- 🚀 Optimized for GitHub Pages deployment

## Development

### Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build

### Standard Build
```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Static Export (for GitHub Pages)
```bash
npm run build:static
# or
yarn build:static
# or
pnpm build:static
```

*Note: In Next.js 16, the `next export` command is deprecated. Static export is handled automatically by setting `output: 'export'` in `next.config.ts`.*

## Deployment (GitHub Pages)

### Prerequisites

1. Enable GitHub Pages in your repository:
   - Go to **Repo Settings → Pages**
   - Set **Source** to **GitHub Actions**

2. Ensure your repository has the following permissions:
   - Contents: Read
   - Pages: Write
   - ID-token: Write

### Automatic Deployment

The project includes a sophisticated GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

#### Workflow Features

- **Smart Package Manager Detection**: Automatically detects npm, yarn, or pnpm
- **Advanced Caching**: Multi-layered caching for faster builds
  - Node modules cache
  - Next.js build cache
  - Package manager cache
- **Static Export Optimization**: Configured for GitHub Pages
- **Asset Compression**: Gzip compression for JS, CSS, and HTML files
- **Environment Configuration**: Automatic basePath and assetPrefix setup
- **Build Optimization**: Production-ready builds with proper static export

#### Workflow Triggers

- Push to `main` branch
- Manual workflow dispatch from Actions tab

#### Cache Strategy

The workflow uses a sophisticated caching strategy:

1. **Node Modules Cache**: Cached based on lockfile hashes
2. **Next.js Build Cache**: Cached based on package files and source files
3. **Package Manager Cache**: Caches npm, yarn, or pnpm stores

This ensures fast builds by reusing dependencies and build artifacts when possible.

### Manual Deployment

You can also trigger a deployment manually:

1. Go to the **Actions** tab in your GitHub repository
2. Select **Deploy Next.js site to Pages** workflow
3. Click **Run workflow**

### Local Testing

To test the static export locally:

1. Build the static version:
   ```bash
   npm run build:static
   ```

2. Serve the `out` directory with any static server:
   ```bash
   npx serve out
   # or
   python -m http.server 8000 --directory out
   ```

## Configuration

### Next.js Configuration

The `next.config.ts` file is optimized for GitHub Pages:

- `output: 'export'` - Enables static export
- `trailingSlash: true` - Ensures proper routing on GitHub Pages
- `basePath` and `assetPrefix` - Dynamically configured for GitHub Pages
- `images: { unoptimized: true }` - Required for static export
- `generateEtags: false` - Better caching on GitHub Pages

### Environment Variables

The workflow automatically sets:
- `NEXT_PUBLIC_BASE_PATH` - GitHub Pages base path
- `NODE_ENV: production` - Production build mode

## Troubleshooting

### Common Issues

1. **404 Errors on Navigation**
   - Ensure `trailingSlash: true` is set in `next.config.ts`
   - Check that `basePath` is correctly configured

2. **Static Assets Not Loading**
   - Verify `assetPrefix` is set correctly
   - Check that `NEXT_PUBLIC_BASE_PATH` is properly set

3. **Build Failures**
   - Check that all dependencies are installed
   - Verify Node.js version compatibility
   - Check workflow logs for specific errors

### Debugging

1. **Local Testing**: Always test locally with `npm run build:static`
2. **Workflow Logs**: Check GitHub Actions logs for detailed error information
3. **Cache Issues**: Clear caches by deleting them in Actions → Caches

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run build:static`
5. Submit a pull request

## License

This project is licensed under the MIT License.
