# 360 Dashboard Next.js App

This project is built with:
- **Next.js (v15)** using the **App Router** feature.
- **Node.js (v20.13.1)**

## About

This website is developed for the **360 Dashboard** platform. It will be integrated with **MongoDB** and hosted on **AWS**. We are also using some third-party plugins, including (but not limited to):
- [Swiper](https://swiperjs.com/)
- [GSAP (Free Version)](https://greensock.com/)
- [@svgr/webpack (for svgs)](https://www.npmjs.com/package/@svgr/webpack)
- ...and more.

## Installation and Setup

1. **Clone the Repository**  
   Make a local copy of the repository to your desktop.  
   > **Note:** Always work on the `development` branch.

2. **Install Dependencies**  
   ```bash
   npm install

3. **Run the Development Server**
    ```bash
    npm run dev

## Vercel Deployment

This application is optimized for deployment on Vercel with the following considerations:

### Function Timeouts
- **Chart generation functions** use dynamic timeouts based on the environment:
  - Development: 2 minutes
  - Vercel Pro (Production): 4.5 minutes (270 seconds)
  - Other environments: 1 minute

### Duplicate Prevention
The app includes multiple layers of duplicate chart prevention:
1. **Request-level deduplication** - Prevents multiple requests for the same chart
2. **Database-level checking** - Verifies existing charts before creation
3. **Smart retry logic** - Handles 504 Gateway Timeout errors appropriately

### Vercel Configuration
The `vercel.json` file configures:
- Maximum function duration for the proxy API (300 seconds - Pro plan maximum)
- Default timeout for other API routes (120 seconds)
- Optimal regions for deployment

### Troubleshooting Timeouts
If you experience timeout issues:
1. **Enable Fluid Compute** in your Vercel dashboard for even longer-running functions (up to 800s)
2. **Check function logs** in the Vercel dashboard for timeout patterns
3. **Monitor background retries** - Failed charts are automatically retried
4. **Consider Enterprise plan** if you need timeouts beyond 13+ minutes

That's it! You're all set to begin coding.
Happy Coding!