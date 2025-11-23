# 🌿 GreenScapes AI - Next.js

> AI-Powered Landscape Transformation Platform

A cutting-edge web application that combines artificial intelligence with landscaping expertise to help homeowners visualize, plan, and quote their dream outdoor spaces.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🎨 AI-Powered Virtual Planner
- **Image Transformation**: Upload photos of your property and visualize different landscaping designs
- **Region Selection**: Click on specific areas to apply targeted transformations
- **Smart Suggestions**: AI-generated landscaping recommendations based on your property
- **Before/After Comparison**: Interactive slider to compare original vs. transformed views
- **Instant Quote Generation**: Automatic cost estimation based on transformations

### 📊 Property Audit Tool
- **Comprehensive Analysis**: AI-powered assessment of your lawn's condition
- **Health Metrics**: Detailed scoring for grass health, weed density, edging, and cleanliness
- **Smart Recommendations**: ROI-ranked improvement suggestions
- **Curb Appeal Prediction**: Estimated property value impact

### 📍 Location-Based Services
- **24 Service Areas**: Dedicated pages for all locations across Ohio and Northern Kentucky
- **Regional Expertise**: Localized service information and pricing
- **Interactive Map**: Service area visualization
- **Location Selector**: Easy navigation between service regions

### 📝 Smart Quote System
- **Real-Time Pricing**: AI-calculated estimates based on visual transformations
- **Itemized Breakdown**: Detailed service and material costs
- **Duration Estimates**: Projected completion timelines
- **PDF Export**: Professional quote documents

### 🌟 Additional Features
- **Contact Forms**: Integrated with EmailJS for instant inquiries
- **Google Reviews Widget**: Live customer testimonials
- **Mobile Responsive**: Fully optimized for all devices
- **Dark Mode Support**: Comfortable viewing in any environment
- **SEO Optimized**: Dynamic sitemap and meta tags
- **Fast Performance**: Turbopack bundling and static optimization

---

## 🚀 Tech Stack (Latest Versions)

### Core Framework
- **[Next.js 16.0.3](https://nextjs.org/)** - React framework with Turbopack
- **[React 19.2.0](https://react.dev/)** - Latest React with Server Components
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Type-safe development

### Styling
- **[Tailwind CSS 4.1.17](https://tailwindcss.com/)** - Latest CSS framework with new architecture
- **[Framer Motion 12.23.24](https://www.framer.com/motion/)** - Advanced animations

### AI & APIs
- **[Google Gemini AI](https://ai.google.dev/)** - Image generation and analysis
  - `gemini-1.5-flash` - Content generation
  - `text-embedding-004` - Vector embeddings
- **[EmailJS](https://www.emailjs.com/)** - Contact form integration
- **[Google Places API](https://developers.google.com/maps/documentation/places/web-service)** - Location services

### Database & ORM
- **[Prisma 7.0.0](https://www.prisma.io/)** - Type-safe database ORM

### UI Components
- **[Lucide React](https://lucide.dev/)** - Modern icon library
- **[React Hot Toast](https://react-hot-toast.com/)** - Toast notifications
- **[Recharts](https://recharts.org/)** - Data visualization

### Utilities
- **class-variance-authority** - Component variants
- **clsx** - Class name composition
- **tailwind-merge** - Smart Tailwind class merging

---

## 📋 Prerequisites

- **Node.js**: 18.17 or later
- **npm**: 9.0 or later (or yarn/pnpm)
- **Git**: For version control

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd grandpa-ron-nextjs/nextjs_space
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Google Places API
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_key

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

# Database (if using Prisma)
DATABASE_URL=your_database_url
```

### 4. Database Setup (Optional)

If using Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Features in Dev Mode:**
- Hot module replacement
- Fast refresh with Turbopack
- Detailed error messages
- Source maps for debugging

### Production Build

```bash
npm run build
npm start
```

**Production Optimizations:**
- Static page pre-rendering
- Automatic code splitting
- Image optimization
- Minification and compression

---

## 📁 Project Structure

```
nextjs_space/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── contact/         # Contact form endpoint
│   │   ├── quote/           # Quote generation endpoint
│   │   └── reviews/         # Google reviews endpoint
│   ├── components/          # App-specific components
│   ├── locations/           # Dynamic location pages
│   │   └── [slug]/         # Dynamic route for 24 locations
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── quote/              # Quote request page
│   ├── service-areas/      # Service areas overview
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Dynamic sitemap generation
│   └── robots.ts           # SEO robots configuration
│
├── components/              # Reusable React components
│   ├── ui/                 # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── BeforeAfterSlider.tsx
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── GoogleReviewsWidget.tsx
│   ├── Header.tsx
│   ├── HowItWorks.tsx
│   ├── ImageAnnotator.tsx
│   ├── PropertyAudit.tsx
│   ├── QuoteDisplay.tsx
│   ├── QuoteRequestForm.tsx
│   ├── Services.tsx
│   ├── ToolsSection.tsx
│   └── VirtualPlanner.tsx
│
├── services/               # Business logic & API integrations
│   ├── geminiService.ts   # Gemini AI integration
│   ├── emailService.ts    # EmailJS integration
│   ├── locationService.ts # Location data management
│   ├── pricingRegistry.ts # Service pricing
│   ├── vectorStore.ts     # Vector embeddings
│   └── ragTypes.ts        # RAG system types
│
├── contexts/              # React Context providers
│   └── LocationContext.tsx
│
├── hooks/                 # Custom React hooks
│   └── useLocalStorage.ts
│
├── lib/                   # Utility functions
│   └── utils.ts
│
├── prisma/               # Prisma ORM
│   └── schema.prisma     # Database schema
│
├── public/               # Static assets
│   ├── images/
│   └── ...
│
├── types/                # TypeScript type definitions
│   └── index.ts
│
├── .env.local           # Environment variables (not in git)
├── .gitignore          # Git ignore rules
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
├── VERSION_INFO.md     # Version documentation
└── README.md          # This file
```

---

## 🎨 Tailwind CSS 4.x Configuration

This project uses the latest Tailwind CSS 4.x with the new PostCSS plugin architecture:

### Configuration Files

**`postcss.config.mjs`**:
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**`tailwind.config.ts`**:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Archivo Narrow', 'sans-serif'],
        subheading: ['Libre Baskerville', 'serif'],
      },
      // Custom theme extensions
    },
  },
};
export default config;
```

### Key Changes from Tailwind 3.x
- Uses `@tailwindcss/postcss` plugin
- Simplified configuration
- Better tree-shaking
- Improved JIT compilation
- No `autoprefixer` needed (built-in)

---

## 🔌 API Routes

### `/api/contact` (POST)
**Purpose**: Handle contact form submissions  
**Body**: `{ name, email, phone, message }`  
**Response**: Success/error status

### `/api/quote` (POST)
**Purpose**: Generate AI-powered quotes  
**Body**: `{ images, transformation, location }`  
**Response**: Quote object with pricing breakdown

### `/api/reviews` (GET)
**Purpose**: Fetch Google Business reviews  
**Query**: `?placeId=<google_place_id>`  
**Response**: Array of review objects

---

## 🎯 Key Pages

### Home (`/`)
- Hero section with CTAs
- How It Works guide
- Featured services
- AI tools showcase
- Customer testimonials

### Virtual Planner (`/quote`)
- AI image transformation tool
- Quote generation
- Before/after comparison

### Property Audit (`/quote#audit`)
- AI-powered lawn analysis
- Health metrics dashboard
- Improvement recommendations

### Service Areas (`/service-areas`)
- Map of all 24 locations
- Location selector
- Service area details

### Dynamic Location Pages (`/locations/[slug]`)
- Location-specific content
- Local service information
- Regional pricing
- Location-based CTAs

---

## 🧪 Testing

### Type Checking

```bash
npx tsc --noEmit
```

### Build Test

```bash
npm run build
```

### Linting (if configured)

```bash
npm run lint
```

---

## 🚢 Deployment

### Recommended: Vercel

1. **Connect Repository**: Link your GitHub/GitLab repo
2. **Configure Environment**: Add all environment variables
3. **Deploy**: Automatic deployment on push

```bash
# Or using Vercel CLI
npm install -g vercel
vercel
```

### Alternative: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables Checklist
- [ ] `GEMINI_API_KEY`
- [ ] `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- [ ] `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- [ ] `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- [ ] `DATABASE_URL` (if using Prisma)

---

## 🔧 Configuration

### Next.js Config (`next.config.js`)

```javascript
module.exports = {
  images: {
    domains: ['your-image-domain.com'],
  },
  // Other Next.js configurations
};
```

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    // ... more options
  }
}
```

---

## 📊 Performance

### Build Metrics
- **Build Time**: ~5 seconds (with Turbopack)
- **Bundle Size**: Optimized with tree-shaking
- **Static Pages**: 9 pages pre-rendered
- **Dynamic Routes**: 24 location pages

### Optimizations
- ✅ Image optimization (Next.js Image)
- ✅ Font optimization (Google Fonts)
- ✅ Code splitting (automatic)
- ✅ Static generation where possible
- ✅ API route caching
- ✅ Tailwind CSS purging

---

## 🐛 Troubleshooting

### Common Issues

**1. Build Errors with Tailwind CSS 4.x**
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.mjs` configuration
- Verify Tailwind directives in `globals.css`

**2. TypeScript Errors**
- Run `npm install` to update types
- Check `@types/*` packages are latest
- Clear `.next` folder: `rm -rf .next`

**3. API Key Issues**
- Verify `.env.local` file exists
- Check variable names match code
- Restart dev server after changes

**4. Gemini API Errors**
- Confirm API key is valid
- Check API quota limits
- Verify model names are correct

**5. Build Size Warnings**
- Review unused dependencies
- Check for large imports
- Optimize images

### Debug Mode

```bash
# Verbose build output
npm run build -- --debug

# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

---

## 📚 Documentation

- **[VERSION_INFO.md](./VERSION_INFO.md)** - Detailed version information and migration notes
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation
- **[Tailwind CSS 4.0](https://tailwindcss.com/docs)** - Styling framework
- **[Gemini AI](https://ai.google.dev/docs)** - AI integration guide
- **[Prisma Docs](https://www.prisma.io/docs)** - Database ORM

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Support

For questions or support:
- Email: support@greenscapes-ai.com
- Website: https://grandpa-rons-lawncare.com

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment tools
- **Google** - For Gemini AI capabilities
- **Tailwind Labs** - For the CSS framework
- **Open Source Community** - For all the tools and libraries

---

**Built with ❤️ using the latest web technologies**

*Last Updated: November 22, 2025*
