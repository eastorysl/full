# Eastory SL — Sri Lanka Discovery Platform

> Tourism, culture, and local business discovery platform for Sri Lanka — built with React, featuring an interactive map, PWA support, and rich content pages.

![Version](https://img.shields.io/badge/version-1.1.1-0f766e?style=flat-square)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-0f766e?style=flat-square)

---

## Tech Stack

| Category | Choice |
|----------|--------|
| **Framework** | React 19 |
| **Bundler** | Vite 8 |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router 7 |
| **Animations** | Framer Motion 12 |
| **Maps** | React Leaflet + Leaflet |
| **Icons** | React Icons (Feather, Game Icons, Font Awesome) |
| **SEO** | react-helmet-async |
| **Email** | EmailJS (feedback form) + Google Apps Script (newsletter) |
| **Analytics** | Google Analytics 4 (G-9N173V8EG4) |
| **Linting** | Oxlint |

---

## Data Overview

| Section | File | Entries | Focus |
|---------|------|---------|-------|
| **Destinations** | `destinations.js` | 123 | Travel experiences — beaches, nature, adventure, culture |
| **Sri Lanka Pride** | `sriLankaPride.js` | 101 | Heritage & identity — kingdoms, food, people, seasonal foods, tea trails |
| **Businesses** | `businesses.js` | 86 | Local services — hotels, shops, water sports, tours (all with `expiresAt` field) |
| **Preset Trips** | `presetTrips.js` | 12 | Curated multi-stop road trip routes |
| **Gallery** | `gallery.js` | 4 sources | Extra images per destination/pride item |
| **Schema Reference** | `schema.js` | 5 schemas | Admin guide — field definitions, options, templates, examples |

> Destinations and Sri Lanka Pride have **zero overlapping entries**. Each section covers unique content.

---

## Project Structure

```
eastory-sri-lanka-hub/
├── public/
│   ├── images/               # Static image assets
│   ├── robots.txt            # Crawler rules + sitemap link
   │   ├── sitemap.xml           # Auto-generated (237 URLs)
│   ├── ai.txt                # AI crawler instructions
│   ├── llms.txt              # LLM-friendly site summary
│   └── favicon.svg
│
├── scripts/
│   ├── generate-sitemap.js   # Build-time sitemap generator
│   └── generate-og-pages.js  # Pre-renders OG tags for detail + list pages
│
├── src/
│   ├── components/
│   │   ├── layout/           # Navbar, Footer, Layout, InstallPWA
│   │   ├── home/             # Hero, Featured, NearestBusinesses, TripFinder, CTA, AboutSriLanka, GovTourismLinks
│   │   ├── tourism/          # DestinationCard, DestinationGrid
│   │   ├── discover/         # BusinessCard, BusinessGrid
│   │   ├── pride/            # PrideCard
│   │   ├── map/              # MapView, MapSidePanel (Places/Trip Planner tabs), MapPlaceList, MapLayers, DraggableBottomSheet, RoadTripPlanner, RoutePolyline, RouteSummary, RouteTimeline, NavigationMode, NearbyPlaces, PresetTrips, PresetRoutePolylines
│   │   ├── gallery/          # GalleryGrid
│   │   ├── seo/              # SEO.jsx (react-helmet-async wrapper)
│   │   └── ui/               # AnimatedSection, SectionTitle, Badge, SearchBar, Logo, SimilarPlaces, ScrollToTop
│   │
│   ├── pages/                # Route-level page components
│   ├── data/                 # Static content modules (the "database")
│   │   ├── destinations.js   # 123 destination entries
│   │   ├── sriLankaPride.js  # 101 pride items
│   │   ├── businesses.js     # 86 business entries
│   │   ├── presetTrips.js    # 12 curated road trip routes
│   │   ├── gallery.js        # Gallery images + categories
│   │   └── schema.js         # Admin data schema reference
│   ├── hooks/                # useInView, usePWAInstall, usePageTracking, useRoutePlanner, useGeolocation
│   ├── services/             # routingService (OSRM multi-mirror failover, share URL)
│   ├── utils/                # distance.js, fallback.js, season.js, mapHelpers.js, analytics.js, routeOptimizer.js
│   └── App.jsx               # Root with BrowserRouter + Routes + lazy loading
│
├── netlify.toml              # Headers, redirects, SPA config
├── index.html                # Meta tags, GA4, Schema.org structured data
├── tailwind.config.js
├── vite.config.js
├── .env.example
└── package.json
```

---

## Routing & Pages

Defined in `src/App.jsx`. All routes are nested under `<Layout />` (Navbar + Footer wrapper).

| Route | Page Component | Description |
|-------|---------------|-------------|
| `/` | `Home` | Landing page with hero, featured destinations, trip finder, CTA, about cards |
| `/destinations` | `Destinations` | Filterable/searchable grid of tourist spots |
| `/destinations/:category/:id` | `DestinationDetail` | Full detail page (SEO + JSON-LD) |
| `/sri-lanka-pride` | `SriLankaPride` | Filterable grid of heritage/culture items |
| `/sri-lanka-pride/:category/:id` | `PrideDetail` | Detail page (SEO + JSON-LD) |
| `/discover-more` | `DiscoverMore` | Filterable grid of local businesses |
| `/map` | `Map` | Full-screen Leaflet map with smooth zoom, layers, geolocation, Places/Trip Planner tabs, and road trip planner |
| `/gallery` | `Gallery` | Masonry image grid with lightbox |
| `/advertise` | `Advertise` | Multi-step form for business listings (WhatsApp submission) |
| `/unsubscribe` | `Unsubscribe` | Newsletter unsubscribe confirmation page |
| `/privacy-policy` | `PrivacyPolicy` | Privacy policy (16 sections, fully audited) |
| `/terms-of-service` | `TermsOfService` | Terms of service (13 sections) |
| `/business-terms` | `BusinessTerms` | Business listing terms — claims, removals, curated listings |
| `/cookie-policy` | `CookiePolicy` | Cookie policy — 4 cookie tables, all third-party services |
| `/disclaimer` | `Disclaimer` | Disclaimer — travel advice, listings, links, liability |
| `*` | `NotFound` | 404 page |

---

## Page-by-Page Logic

### Home (`/`)
**File:** `src/pages/Home.jsx`

| Component | Purpose |
|-----------|---------|
| `Hero` | Full-screen hero with title, subtitle, CTA buttons |
| `Featured` | Shows nearest places (OSRM road distance) + seasonal destinations and food for current month with category filters |
| `NearestBusinesses` | Shows 4 closest businesses based on geolocation with OSRM road distance, call, map, and directions buttons |
| `TripFinder` | Interactive start/end route planner with **auto-detected current location** as default start point. Generates route on map |
| `CTA` | Call-to-action card linking to `/sri-lanka-pride` |
| `AboutSriLanka` | 3 glassmorphism cards (Natural Paradise, Wildlife, Culture) |
| `GovTourismLinks` | Government resource links |

### Destinations (`/destinations`)
**File:** `src/pages/Destinations.jsx`

- Hero banner with background image + "Home" button
- Reads `?search=` and `?month=` from URL query params
- 18 category filter buttons (horizontal scroll with left/right arrows)
- `getSeasonalDestinations()` filters by `bestTime` field when `?month=` is set
- Cards link to `/destinations/:category/:id`
- Sort order: premium → featured → free

### Destination Detail (`/destinations/:category/:id`)
**File:** `src/pages/DestinationDetail.jsx`

- Hero banner with "Home" + "Back to Destinations" buttons, category/tier badges, image, description
- Buttons: "View Gallery" → `/gallery?item=<id>`, "View on Map" → `/map?item=<id>`, Share (Web Share API)
- Quick Info cards: duration, entry fee, best time, district
- Main content renders `item.detail` as HTML
- Sidebar: category badge, coordinates, distance from Colombo, Google Maps link
- Similar Places: 5 random same-category items in sidebar (horizontal scroll on mobile)
- JSON-LD: `TouristAttraction` schema

### Sri Lanka Pride (`/sri-lanka-pride`)
**File:** `src/pages/SriLankaPride.jsx`

- Hero banner with background image + "Home" button
- 9 category filter buttons + "Famous People" sub-category filter
- Reads `?category=` from URL params to pre-select
- Cards link to `/sri-lanka-pride/:category/:id`

### Pride Detail (`/sri-lanka-pride/:category/:id`)
**File:** `src/pages/PrideDetail.jsx`

- Hero banner with "Home" + "Back to Sri Lanka Pride" buttons, category-specific metadata
- Main content renders `item.detail` as HTML
- JSON-LD types: `TouristAttraction`, `Person` (famous-people), `TouristTrip` (road-trip-routes)
- Extra sections: Routes (stops/duration), Famous People (birth year/place)
- Similar Places: 5 random same-category items in sidebar (horizontal scroll on mobile)

### Discover More (`/discover-more`)
**File:** `src/pages/DiscoverMore.jsx`

- Hero banner with background image + "Home" button
- 14 category filter buttons (Hotels, Resorts, Surfing, Diving, etc.)
- Filters businesses by `subCategory` + search

### Map (`/map`)
**File:** `src/pages/Map.jsx`

- Combines destinations, businesses, and pride items into `ALL_DATA`
- 5 layer toggles: Destinations, Beaches, Discover more, Cultural, Preset Routes
- Deep-linking via `?item=<id>` and `?trip=id1,id2` query params
- **Places / Trip Planner tabs** on all devices:
  - **Desktop left sidebar** (`hidden md:flex`, 340px): Two tabs — "Places" (count badge) and "Trip Planner"
  - **Mobile draggable bottom sheet** (`md:hidden`): `DraggableBottomSheet` with 3 snap points — Peek (80px handle), Half (45vh), Full (90vh). Drag via handle bar, auto-collapses on map drag
  - **MapSidePanel detail panel** (desktop right, mobile bottom sheet): When a place is selected, shows "Places" and "Trip Planner" tabs
- Map controls auto-hide when bottom sheet is expanded on mobile
- Geolocation support (auto-locate on first visit)
- Business cards include "Show on Map" button
- Smooth zoom with Google Maps-style zoom-out button (`flyTo` animation)
- No hero section (full-screen map layout)
- **Road Trip Planner** — multi-stop route planning with OSRM routing

#### Road Trip Planner (`src/hooks/useRoutePlanner.js`)
- Add stops via search (fuzzy name matching across all data) or click-to-add from map
- Drag-and-drop reordering with visual drag handle
- Up to 12 stops per route
- Itinerary tab with day splitting (auto-assigns stops to days with overnight breaks)
- Turn-by-turn navigation mode with GPS simulation and off-route detection
- Share route via URL params (`?stops=id1,id2,id3`)
- Load preset trips (12 curated Sri Lanka routes)
- Route rendering: animated `RoutePolyline` with OSRM routing, fallback dashed blue line on failure
- Auto-zoom to fit route bounds with 15% padding
- Route summary: distance, duration, day count, share button
- OSRM multi-mirror failover (`routingService.js`): primary → openstreetmap.de backup with 12s timeout
- Mobile: bottom sheet with route controls; Desktop: sidebar planner panel
- **TripPlannerPanel** component: unified planner with Plan/Presets sub-tabs, SearchInput, RouteSummary, RouteTimeline, Generate Route button, NearbyPlaces
- SearchInput: 48px minimum touch targets, `touch-manipulation`, focus ring, `e.preventDefault()` on mouseDown to prevent scroll-jacking

### Gallery (`/gallery`)
**File:** `src/pages/Gallery.jsx`

- Hero banner with background image + "Home" button
- Images built from `buildGalleryImages()` (destinations + pride + businesses + extra gallery sources)
- Deep-linking via `?item=<id>`
- 15 gallery category filters
- Responsive grid: 5 columns (xl), 4 (lg), 3 (md), 2 (sm/mobile)
- Lightbox with keyboard navigation
- "View Page" link in lightbox for destinations and pride items (business photos show image only)

### Advertise (`/advertise`)
**File:** `src/pages/Advertise.jsx`

- Hero banner with background image + "Home" button
- 3-step form: Package selection → Business Details → Review & Submit
- 3 packages: Free (Rs 0), Featured (Rs 3,500/Year), Premium (Custom)
- Submits via WhatsApp to `+94724362001`
- Required field asterisks in red
- Auto-scrolls to top on every step change

### Unsubscribe (`/unsubscribe`)
**File:** `src/pages/Unsubscribe.jsx`

- Reads `?email=` from URL query params
- Shows confirmation message with unsubscribed email
- "Back to Home" and "Explore Destinations" buttons
- Re-subscribe note in footer
- SEO: noindex (not indexed by search engines)

---

## Data Files — How to Add New Content

All content is static data in `src/data/`. To add new items, append objects to the arrays.

### destinations.js

**Export:** `destinations` (array — 123 entries)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | **Yes** | Unique slug. Convention: `{category}-{name-lowercase-dashed}` |
| `name` | string | **Yes** | Display name |
| `location` | string | Yes | City/town name |
| `district` | string | Yes | District name |
| `category` | string | **Yes** | One of 18 categories (e.g. `"beaches"`, `"nature"`) |
| `tier` | string | Yes | `"premium"`, `"featured"`, or `"free"` |
| `description` | string | **Yes** | Short summary (1-2 sentences) |
| `detail` | string | **Yes** | Full HTML content (rendered via `dangerouslySetInnerHTML`) |
| `image` | string | **Yes** | Full URL to hero image |
| `bestTime` | string | Yes | Month range (e.g. `"November – April"`, `"Year-round"`) |
| `entryFee` | string | No | e.g. `"Free"`, `"$10"`, `"LKR 5000"` |
| `duration` | string | No | e.g. `"3–5 hours"`, `"Full day"` |
| `coordinates` | object | No | `{ lat, lng }` — enables map button + distance calc |
| `googleMapsLink` | string | No | Direct Google Maps URL |
| `clDistance` | number | No | Pre-calculated distance from Colombo in km |

### sriLankaPride.js

**Export:** `prideItems` (array — 101 entries)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | **Yes** | Unique slug. Convention: `{category-abbr}-{name}` |
| `name` | string | **Yes** | Display name |
| `category` | string | **Yes** | One of 9 pride categories |
| `subCategory` | string | No | For `famous-people` only |
| `description` | string | **Yes** | Short summary |
| `detail` | string | **Yes** | Full HTML content |
| `image` | string | **Yes** | Full URL to hero image |
| `period` | string | No | Historical period |
| `location` | string | No | Primary location |
| `district` | string | No | District name |
| `birthYear` | string | No | For famous-people |
| `birthPlace` | string | No | For famous-people |
| `coordinates` | object | No | `{ lat, lng }` |
| `googleMapsLink` | string | No | Google Maps URL |
| `stops` | string | No | For road-trip-routes |
| `duration` | string | No | For road-trip-routes |
| `seasonMonths` | string | No | For seasonal-foods |
| `seasonName` | string | No | For seasonal-foods |

> **No duplicate entries with destinations.**

### businesses.js

**Export:** `businesses` (array — 86 entries)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | **Yes** | Unique slug |
| `name` | string | **Yes** | Business name |
| `type` | string | Yes | e.g. `"guesthouse"`, `"hotel"`, `"shop"`, `"service"` |
| `subCategory` | string | **Yes** | One of 14 Discover More categories |
| `category` | string | Yes | Top-level: `"Accommodation"`, `"Shopping"`, `"Water Sports"`, `"Tours"` |
| `location` | string | Yes | Full address |
| `district` | string | Yes | District name |
| `tier` | string | Yes | `"standard"`, `"featured"`, or `"premium"` |
| `description` | string | **Yes** | Short summary |
| `detail` | string | **Yes** | Full HTML content |
| `image` | string | **Yes** | Full URL to image |
| `coordinates` | object | No | `{ lat, lng }` |
| `phone` | string | No | Contact phone |
| `website` | string | No | Website URL |
| `googleMapsLink` | string | No | Google Maps URL |
| `social` | object | No | `{ facebook, instagram, youtube }` |
| `expiresAt` | string | No | Expiry date for paid tiers (e.g. `"2027-07-21"`). Empty string for standard. Used by `getEffectiveTier()` to auto-downgrade expired paid listings to standard |

### gallery.js

**Export:** `galleryExtraSources` (object — 4 sources with extra images)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | **Yes** | Display name (must match the destination/pride item name) |
| `category` | string | **Yes** | Gallery filter category |
| `location` | string | **Yes** | Town or area |
| `page` | string | **Yes** | Source page: `"destinations"` or `"sri-lanka-pride"` |
| `images` | array | **Yes** | Array of image URLs |

`buildGalleryImages()` merges primary images from all data files with extra gallery sources.

### schema.js (Admin Reference)

**Exports:** `DESTINATIONS_SCHEMA`, `PRIDE_SCHEMA`, `BUSINESSES_SCHEMA`, `GALLERY_SCHEMA`, `PRESET_TRIPS_SCHEMA`

Each export contains:

| Key | Description |
|-----|-------------|
| `fields` | Array of field definitions with name, type, required, description, example, options |
| `template` | Copy-paste template ready to fill in |
| `example` | A working example entry |
| `conditionalFields` | (Pride only) Fields required per category |

Use this file as a quick reference when adding new entries to any data file.

---

## Features

### TripFinder (Home page)
- 5-question interactive quiz (interests, travel style, companions, season, budget)
- Recommends 6 geographically-clustered destinations using Haversine distance
- All cards link to `/destinations/:category/:id` detail pages

### NearestBusinesses (Home page)
- Requests browser geolocation to find user's current location
- Pre-filters top 12 nearest by haversine, then fetches actual OSRM road distances
- Shows 4 nearest businesses by road distance in a responsive card grid (1 col mobile, 2 sm, 4 lg)
- Each card: road distance badge, image, name, location, subcategory badge, Call/Map/Directions buttons
- Loading spinner, error with retry button, and "Discover More" CTA link
- Falls back to haversine × 1000 if OSRM fails

### Map
- Full-screen Leaflet map with clustered markers
- 5 layer toggles: Destinations, Beaches, Discover more (businesses), Cultural (pride), Preset Routes, Preset Routes
- 11 quick-filter buttons for quick category access
- **Places / Trip Planner tabs** on all devices (mobile draggable bottom sheet, desktop sidebar, detail panel)
- **DraggableBottomSheet** — handle-only drag gesture with 3 snap points (Peek 80px, Half 45vh, Full 90vh), spring animations, auto-collapses on map drag (`dragstart` event only, not `movestart`)
- Side panel (desktop) / bottom sheet (mobile)
- Fly-to animation on place selection
- Smooth zoom with Google Maps-style zoom-out button
- Geolocation support (auto-locate on first visit)
- `?item=` and `?trip=` query params for deep-linking
- Business cards with "Show on Map" button
- Marker labels: Tinos italic font, 12px desktop / 10px mobile
- **Preset Routes layer** — toggle to show all 12 curated trip polylines on the map with uniform blue lines, start/end markers, and trip info tooltips showing road distance/duration. Click a route to zoom to its bounds. Actual OSRM road geometry with straight-line fallback.

### Road Trip Planner
- Add up to 12 stops via search or map click
- Drag-and-drop reordering
- Itinerary tab with auto day-splitting and overnight breaks
- Turn-by-turn navigation mode with off-route detection
- Share routes via URL params
- 12 curated preset trips (Hill Country, Cultural Triangle, South Coast, etc.)
- OSRM routing with multi-mirror failover (primary + backup server)
- Animated route polyline with fallback dashed line on failure
- Auto-zoom to fit route bounds
- Route summary with distance, duration, and day count
- **TripPlannerPanel**: Plan/Presets sub-tabs, SearchInput with 48px touch targets, NearbyPlaces (filters out already-added stops)
- Mobile: content renders inside DraggableBottomSheet; Desktop: sidebar planner panel

### PWA
- Install prompt via `beforeinstallprompt` event
- iOS detection with custom install instructions
- Download icon button in mobile navbar
- Persistent dismiss with `localStorage` flag
- Hidden when already installed (standalone mode)

### SEO & Structured Data

#### Per-page meta tags (`src/components/seo/SEO.jsx`)
Each page sets: title, description, canonical, keywords, OG tags (title, description, url, image 1200x630, site_name, locale), Twitter cards (summary_large_image with url), and optional JSON-LD.

| Page | Title | ogImage | ogType | JSON-LD |
|------|-------|---------|--------|---------|
| Home `/` | `"Explore Sri Lanka — Travel Guide"` | `/images/home/hero.png` | `website` | — |
| Destinations `/destinations` | `"Destinations"` | `/images/home/Destinations.png` | `website` | — |
| Destination Detail | `{item.name}` | `{item.image}` | `article` | `TouristAttraction` |
| Sri Lanka Pride | `"Sri Lanka Pride"` | `/images/home/Sri_Lanka_Pride.png` | `website` | — |
| Pride Detail | `{item.name}` | `{item.image}` | `article` | `TouristAttraction` / `Person` / `TouristTrip` |
| Discover More | `"Discover More"` | `/images/discover/hero.png` | `website` | — |
| Map | `"Map"` | `/images/home/hero.png` | `website` | — |
| Gallery | `"Gallery"` | `/images/home/Gallery.png` | `website` | — |
| Advertise | `"Advertise With Us"` | `/images/discover/hero.png` | `website` | — |
| Unsubscribe | `"Unsubscribe"` | `/images/home/hero.png` | `website` | — (noindex) |
| Privacy Policy | `"Privacy Policy"` | `/images/home/hero.png` | `website` | — |
| Terms of Service | `"Terms of Service"` | `/images/home/hero.png` | `website` | — |
| Business Terms | `"Business Terms"` | `/images/home/hero.png` | `website` | — |
| Cookie Policy | `"Cookie Policy"` | `/images/home/hero.png` | `website` | — |
| Disclaimer | `"Disclaimer"` | `/images/home/hero.png` | `website` | — |
| 404 | `"Page Not Found"` | fallback | `website` | — |

#### Global structured data (`index.html`)
- `WebSite` — name, logo, search action
- `Organization` — name, email (`eastory.sl@gmail.com`), phone (`+94724362001`), logo, social links

#### Pre-rendered OG pages (`scripts/generate-og-pages.js`)
Build script generates static HTML files for every destination, pride item, AND all list/static routes so social media crawlers (WhatsApp, Facebook, Twitter) get proper OG tags even without executing JavaScript. Pre-rendered routes:
- `/destinations` — `Destinations.png` OG image
- `/sri-lanka-pride` — `Sri_Lanka_Pride.png` OG image
- `/discover-more` — `discover/hero.png` OG image
- `/gallery` — `Gallery.png` OG image
- `/advertise` — `discover/hero.png` OG image
- `/map` — `hero.png` OG image
- `/privacy-policy` — `hero.png` OG image
- `/terms-of-service` — `hero.png` OG image
- `/business-terms` — `hero.png` OG image
- `/cookie-policy` — `hero.png` OG image
- `/disclaimer` — `hero.png` OG image
- `/unsubscribe` — `hero.png` OG image
- `/destinations/:category/:id` — item-specific OG image (external URLs)
- `/sri-lanka-pride/:category/:id` — item-specific OG image (external URLs)

> **WhatsApp/Telegram sharing tip:** WhatsApp caches OG data for ~7 days. After deploying, use the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to force a re-crawl and clear the cache.

#### Other SEO files
- `robots.txt` — allows all crawlers including AI bots (GPTBot, Claude-Web, PerplexityBot, etc.)
- `sitemap.xml` — auto-generated (237 URLs) via `scripts/generate-sitemap.js`
- `ai.txt` — explicit AI crawler permissions
- `llms.txt` — LLM-friendly site summary for AI assistants
- Google Search Console verified

### Newsletter & Email Integration

#### Footer Newsletter (Google Sheets + Auto-Reply)
- Newsletter subscription stores emails in Google Sheets
- Uses Google Apps Script web app for backend
- Column order: Timestamp, Email, URL
- Auto-reply welcome email with HTML template sent to subscriber
- Loading, success, and error states with auto-reset

**Google Apps Script Web App:**
```
https://script.google.com/macros/s/AKfycbxuKmf_1LxhGlKRnbkXGJpW7XQ6sLw7q2I07xFCFb14bWEcz7yb9aMNrr_w2j3t8pgBAQ/exec
```

**Google Apps Script Code (`Code.gs`):**
```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.getDataAsString());
    
    var timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
    var email = data.email || '';
    var pageUrl = data.pageUrl || '';
    
    sheet.appendRow([timestamp, email, pageUrl]);
    
    var subject = 'Welcome to Eastory SL!';
    var htmlBody = '<div style="...">...</div>'; // HTML email template
    
    MailApp.sendEmail({ to: email, subject: subject, htmlBody: htmlBody });
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**Google Sheet Columns:**

| Column A | Column B | Column C |
|----------|----------|----------|
| Timestamp | Email | URL |

#### Feedback Form (Detail Pages)
- Appears on `DestinationDetail` and `PrideDetail` pages
- Component: `src/components/ui/EmailFeedback.jsx`
- Service: `service_h9sxah5` / Template: `template_k2dt9hb`
- Sends feedback to admin (`eastory.sl@gmail.com`)
- Fields: name, email, feedback type (Add details / Suggest correction), message, page URL
- Includes place name and category automatically from the page

#### EmailJS Template Variables

**Admin Notification Template (`template_k2dt9hb`):**

| Variable | Description |
|----------|-------------|
| `{{from_name}}` | Submitter's name |
| `{{from_email}}` | Submitter's email |
| `{{feedback_type}}` | "Add more details" or "Suggest a correction" |
| `{{place_name}}` | Name of the place |
| `{{place_category}}` | Category of the place |
| `{{message}}` | Feedback message |
| `{{page_url}}` | Full URL of the page where feedback was submitted |

**EmailJS Dashboard Settings:**

| Setting | Value |
|---------|-------|
| To Email | `eastory.sl@gmail.com` |
| From Name | `Eastory SL` |
| From Email | Use Default Email Address |
| Reply To | `{{from_email}}` |
| Bcc | *(empty)* |
| Cc | *(empty)* |

#### Advertise Form
- 3-step multi-step form with package selection, business details, and review
- Submits via WhatsApp to `+94724362001` (not EmailJS)
- 3 packages: Free (Rs 0), Featured (Rs 3,500/Year), Premium (Custom)
- Required field asterisks highlighted in red
- SEO tags preserved after form submission

### Design System
- **Fonts:** Sansita (headings), Tinos (body + map marker labels)
- **Colors:** ocean (cyan), teal, sunset (amber), palm (green), coral (orange)
- **Glassmorphism** navbars and overlays
- **Gradient overlays** on hero sections
- **Scroll-reveal** via Intersection Observer (`AnimatedSection`)
- **Responsive tables** — horizontal scroll on mobile, full layout on desktop
- **Autofill handling** — custom CSS for email inputs across dark and light backgrounds

### Navigation
- **Home button** — Glass-morphism styled button on all page hero sections (except Map and 404)
- **Scroll-to-top** — Automatic scroll to top on every route change (`ScrollToTop.jsx`)
- **Back buttons** — Detail pages include "Back to [Parent]" navigation
- **Footer links** — Quick navigation to all main sections + 6 random destinations from `destinations.js` (refreshes each page load)

### Curated Free Listings
- Eastory SL can list businesses from public data (Google ratings etc.) without prior consent
- Generates no revenue — businesses are listed to help travellers discover them
- Featured/Premium businesses can claim or request removal via Business Terms
- `expiresAt` field on paid tiers auto-downgrades to standard when expired
- `getEffectiveTier(item)` helper in `mapHelpers.js` determines effective tier considering expiry
- Backward compatible: entries without `expiresAt` are always active

### Legal Pages (6 pages)
- **Privacy Policy** (`/privacy-policy`) — 16 sections covering data collection, GA4, third-party services, user rights
- **Terms of Service** (`/terms-of-service`) — 13 sections covering acceptable use, content, termination, liability
- **Business Terms** (`/business-terms`) — Listing policies, claims, removal procedures, Curated Free Listings
- **Cookie Policy** (`/cookie-policy`) — 10 sections with 4 cookie tables (essential/analytics/functionality/CDN), all third-party services disclosed
- **Disclaimer** (`/disclaimer`) — 11 sections covering travel advice, business listings, external links, maps, liability
- All 6 pages cross-linked in bottom navigation of each page

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev          # → http://localhost:5173

# Build for production
npm run build        # generates sitemap + vite build + OG pages

# Preview production build
npm run preview

# Generate sitemap only
npm run sitemap

# Lint
npm run lint
```

> **Note:** On Windows with PowerShell execution policy restrictions, prefix npm commands with `cmd /c "npm ..."`.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Generate sitemap + production build + pre-render OG pages |
| `npm run preview` | Preview production build locally |
| `npm run sitemap` | Regenerate `public/sitemap.xml` from data |
| `npm run lint` | Run Oxlint |

### Build Scripts

| Script | Description |
|--------|-------------|
| `scripts/generate-sitemap.js` | Generates `public/sitemap.xml` from all data |
| `scripts/generate-og-pages.js` | Pre-renders OG tags into static HTML for all pages |

---

## Environment Variables

Copy `.env.example` to `.env`:

```
VITE_SITE_URL=https://eastorysl.netlify.app
VITE_WHATSAPP_NUMBER=94724362001
```

If `VITE_SITE_URL` is unset, the app falls back to `https://eastorysl.netlify.app`.

> **Note:** EmailJS credentials are hardcoded in `EmailFeedback.jsx` since the public key is safe to expose client-side.

---

## Deployment (Netlify)

The `netlify.toml` handles:

- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security, Content-Security-Policy, Permissions-Policy
- **Static file redirects** — sitemap.xml, robots.txt, ai.txt, llms.txt served as-is
- **SPA catch-all** — `/* → /index.html` (must be last)
- **Asset caching** — `/assets/*` gets 1-year immutable cache

---

## Tips for New Developers

> **Tip:** Full field definitions, available options, and copy-paste templates are in `src/data/schema.js`.

### Adding a New Destination
1. Open `src/data/destinations.js`
2. Copy the template from `DESTINATIONS_SCHEMA.template` in `schema.js`
3. Paste at the end of the `destinations` array, before the closing `]`
4. Fill in all required fields (see schema for options)
5. If extra gallery images, add to `galleryExtraSources` in `src/data/gallery.js`
6. Run `npm run build` to regenerate sitemap

### Adding a New Pride Item
1. Open `src/data/sriLankaPride.js`
2. Copy the template from `PRIDE_SCHEMA.template` in `schema.js`
3. Paste at the end of the `prideItems` array
4. Fill in required fields; include conditional fields for the category
5. **Do not duplicate** an entry that already exists in `destinations.js`
6. Run `npm run build`

### Adding a New Business
1. Open `src/data/businesses.js`
2. Copy the template from `BUSINESSES_SCHEMA.template` in `schema.js`
3. Paste at the end of the `businesses` array
4. `subCategory` must match one of the 14 Discover More categories

### Adding Extra Gallery Images
1. Open `src/data/gallery.js`
2. Add to `galleryExtraSources` object using the destination/pride item ID as key
3. Provide `name`, `category`, `location`, `page`, and `images` array

### Adding a New Category
- **Destinations:** Update `catMeta` in `DestinationDetail.jsx`, `categories`/`catIcons`/`categoryMap` in `Destinations.jsx`, `destMap` in `gallery.js`
- **Pride:** Update `prideCategoryMap` in `SriLankaPride.jsx`, `catMeta` in `PrideDetail.jsx`, `catIcons`, `prideMap` in `gallery.js`
- **Discover More:** Update `categories`/`catIcons` in `DiscoverMore.jsx`, set business `subCategory` to match

### ID Conventions
- Destinations: `{category}-{name}` — e.g. `beach-mirissa`, `fort-galle`
- Pride: `{category-abbr}-{name}` — e.g. `ak-anuradhapura`, `fp-sangakkara`
- Businesses: `{type}-{name}` — e.g. `hotel-dyke-rest`, `restaurant-nihonbashi`
- **IDs must be globally unique** across all data files

---

## Bug Fixes & Quality Improvements

### SEO Fixes
- **Duplicate `<h1>` tags** removed from `DestinationDetail.jsx` and `PrideDetail.jsx` — second `<h1>` changed to `<h2>`
- **Missing `<h1>` on Advertise page** — `SectionTitle` now renders as `<h1>`
- All detail pages have exactly one `<h1>` with the place name
- **Unsubscribe double title** — removed duplicate `<title>` (was set twice by SEO component + manual tag)
- **Advertise Schema.org invalid property** — `areaSriLanka` changed to `areaServed` (Schema.org `Organization`)
- **SEO missing `twitter:url`** — added `twitter:url` meta tag to SEO component
- **Missing `ogUrl`** on PrivacyPolicy, TermsOfService, Unsubscribe pages — added `ogUrl` prop

### Map & Navigation Fixes
- **NavigationMode GPS waiting message** — moved outside `{info &&}` block so it's visible before GPS lock
- **useRoutePlanner watchPosition leak** — added cleanup `useEffect` to clear GPS watch on unmount
- **Map filter: Museums vs Shopping** — Museums now correctly filters pride items (`category === 'museums'`) instead of duplicating the Shopping business filter
- **NearbyPlaces NaN** — added null guard for `distanceToRoute` to prevent "NaN m from route" display
- **MapSidePanel redundant condition** — "View Full Page" link no longer shows for businesses (they have their own Website/Directions buttons)
- **Trip Planner tabs on all devices** — Places and Trip Planner tabs now accessible on mobile bottom sheet, desktop sidebar, and MapSidePanel detail panel
- **`rp.isPlannerOpen` fully removed** — compass button and show-list button now use `sidebarTab` state
- **SearchInput touch targets** — minimum 48px height for input and result items, `touch-manipulation`, `e.preventDefault()` on mouseDown to prevent scroll-jacking, focus ring styling
- **TripPlannerPanel color consistency** — error retry and Generate Route buttons use teal color scheme

### Data & Component Fixes
- **DestinationCard missing `standard` tier** — added `standard` entry to `tierConfig` so business-tier destinations don't silently fall to `free`
- **routeOptimizer 2-opt infinite loop** — replaced misleading `const improved = true` with proper `foundImprovement` flag that the while loop actually checks
- **Advertise WhatsApp URL encoding** — switched from manual `%0A` joins to `encodeURIComponent()` for proper special character handling
- **Removed unused `_handleReset`** from Advertise.jsx

### v1.0.0-pre.1 — Comprehensive Audit Fixes
- **CRITICAL: Broken HTML tag** — `sriLankaPride.js` Kavum entry had `</2>` instead of `</h2>`
- **CRITICAL: Season filter broken for Year-round entries** — `isInSeason()` now correctly matches "Year-round" substrings in `seasonMonths` values like "Year-round, peak rainy season"
- **BestOfJuly hardcoded month** — section label changed from hardcoded `'July'` to dynamic `currentMonth` so it shows the correct month name year-round
- **Broken "View All Businesses" link** — `Businesses.jsx` `/discover` changed to `/discover-more` (the actual route)
- **Unhandled clipboard rejection** — `DestinationDetail.jsx` and `PrideDetail.jsx` share buttons now wrap `navigator.clipboard.writeText()` in try/catch to prevent errors on insecure contexts
- **Footer error state icon** — subscribe button now shows `FiMail` (not `FiCheck`) on error, and `FiCheck` only on success
- **Invalid ogType="place"** — changed to `ogType="article"` on DestinationDetail and PrideDetail (social platforms ignore non-standard OG types)
- **PrideDetail duplicate JSON-LD `description`** — second `description` key (with period info) renamed to `about` to avoid overwriting the primary description
- **Home.jsx duplicate WebSite JSON-LD** — removed `potentialAction` (SearchAction) which duplicated the identical schema already in `index.html`
- **Sort comparator contract violation** — `PopularNearYou.jsx` premium filter now returns 0 for equal tiers (was non-antisymmetric)
- **Smart quotes in meta** — `NotFound.jsx` description now uses ASCII apostrophes
- **index.html title mismatch** — `<meta name="title">` now matches `<title>` tag
- **Responsive touch targets** — RouteTimeline remove button (20px→44px), NearbyPlaces "+" button (28px→44px), RouteSummary Optimize/Share buttons (added `min-h-[44px]`)
- **RouteOptimizer fallback for coordless stops** — `nearestNeighbour` appends stops without coordinates at end instead of silently dropping them
- **Load preset/stops clears stale state** — `loadPreset` and `loadStopsByIds` now clear route geometry, legs, distance, duration, nearbyPlaces, and errors
- **activeStopIndex clamped** — stays within bounds on stop changes via useEffect
- **Race condition in generateRoute** — added AbortController to cancel stale in-flight requests
- **Route cache capped at 50** — FIFO eviction prevents unbounded memory growth

### v1.0.0-pre.2 Audit Fixes
- **Advertise Premium plan "Free forever"** — Premium plan (`Custom` price) was incorrectly showing "Custom — Free forever" because the fallback applied to all plans with no period. Display logic now only shows "Free forever" for the Free plan
- **Footer `target="_blank"` on `tel:` link** — phone link opened a blank tab instead of the dialer. Removed `target="_blank"` and `rel="noopener noreferrer"` for `tel:` hrefs
- **TripFinder "mixed" experience empty results** — selecting "A Bit of Everything" produced no category matches and fell back to all destinations. Added explicit `mixed` case that includes all categories for proper diversity
- **Home.jsx duplicate WebSite JSON-LD** — removed redundant `WebSite` structured data from Home page (already fully defined in `index.html` with `SearchAction` and `sameAs`)
- **routeOptimizer 2-opt off-by-one** — inner loop `j < best.length - 1` excluded the last stop from reversal candidates. Fixed to `j < best.length` so the full route space is explored
- **useRoutePlanner silent geolocation failure** — `watchPosition` error callback was `() => {}`, silently swallowing permission denials and position errors. Now logs a warning and resets navigation state
- **usePWAInstall crash on prompt failure** — `prompt.prompt()` was not wrapped in try/catch. Browsers can throw if the deferred prompt was already consumed. Added error handling
- **destinations.js Bopath Ella image typo** — image URL path `waterfals/waterfalsBopathEllaFalls.jpg` had double typo. Fixed to `waterfalls/waterfallsBopathEllaFalls.jpg`
- **routeOptimizer misleading variable name** — `dayMs` was in seconds, not milliseconds. Renamed to `maxSecondsPerDay`

### v1.0.0-rc.1 — Initial Release Audit
- **MapView.jsx stale closure** — `onMapReady` captured in `useEffect` closure would never re-run after re-render. Replaced with `useRef` pattern to always call the latest callback
- **MapView.jsx memory leak** — `markerRefs` not cleaned up on item unmount. Added `else { delete markerRefs.current[item.id] }` in ref callback
- **GalleryGrid.jsx null guards** — `img.alt` and `img.category` could be undefined during search filter. Added `(img.alt || '')` and `(img.category || '')` fallbacks
- **GalleryGrid.jsx lightbox navigation** — `selectedImage.dataCategory || selectedImage.category` passed raw to navigation path; `encodeURIComponent()` now wraps it for categories with spaces like "Lakes & Rivers"
- **GalleryGrid.jsx lightbox loading** — changed `loading="lazy"` to `loading="eager"` since lightbox images should prioritize visual appearance
- **SimilarPlaces.jsx null guard** — added `if (!items || !currentItem) return []` to prevent crash when data hasn't loaded
- **DestinationCard.jsx null guard** — extracted `coordinates?.lat` and `coordinates?.lng` via optional chaining before template literal to prevent "undefined,undefined" in directions URL
- **InstallPWA.jsx accessibility** — added `role="dialog"`, `aria-modal="true"`, `aria-labelledby="pwa-title"`, Escape key handler, focus management via `dialogRef`
- **InstallPWA.jsx touch targets** — close button upgraded from `w-10 h-10` to `w-11 h-11`
- **Footer.jsx newsletter** — fixed `mode: 'no-cors'` (fake success) → `mode: 'cors'` with `URLSearchParams`; replaced hardcoded stats with dynamic `{data.length}+` values
- **Map.jsx unused import** — removed unused `FiCompass` import (leftover from old compass button)
- **TripFinder.jsx recommendation logic** — `recommendPlan()` now uses all 5 quiz answers with tier+style scoring instead of only `experience`
- **AboutSriLanka.jsx dot indicators** — replaced 8px dots with `min-h-[44px] min-w-[44px]` touch targets
- **mapHelpers.js encodeURIComponent** — `getDetailPath()` now wraps `item.category` in `encodeURIComponent()` for categories with spaces
- **BusinessGrid.jsx CTA card** — fixed exactly-12-items edge case by matching `sorted.length >= 6` instead of `i % 12 === 0 && i > 0`
- **DestinationGrid.jsx tier sort** — added `standard: 2` to `tierOrder` object
- **EmailFeedback.jsx label** — added `<label htmlFor="feedback-type">` with `sr-only` class for the select
- **routingService.js coverage** — `findNearbyPlaces()` samples ~60 route points instead of 20 for full road-path coverage

### Launch Audit — SEO, Responsive & Bug Fixes
- **UTF-8 encoding corruption fixed** — St. Clair's Falls description had `â€` mojibake (corrupted em dash). Replaced with proper `—` character in `destinations.js`
- **Touch targets fixed** — NavigationMode close button (w-8→w-11), reroute button (min-h-44px), RoadTripPlanner toggle (w-8→w-11), RouteTimeline step circle (w-7→w-10). All interactive elements now meet 44px WCAG minimum
- **SEO page titles shortened** — 4 titles exceeded 60 chars (Google truncation): Map (76→39), DiscoverMore (73→49), SriLankaPride (65→43), Advertise (62→20). OG page generator synced
- **All descriptions verified** — All 13 page meta descriptions are under 155 chars (longest: Home at 149). No truncation risk
- **Canonical URLs verified** — All pages use consistent `VITE_SITE_URL || 'https://eastorysl.netlify.app'` pattern with proper path handling
- **GPS watch cleanup verified** — `useRoutePlanner` uses `watchIdRef` (ref) with proper `useEffect` cleanup on unmount — no stale closure risk. `NavigationMode` is pure display, no geolocation calls
- **Build passes** — 0 errors, all changes verified

### v1.0.0-pre.3 Codebase Audit & Bug Fixes
- **CRITICAL: setTimeout race conditions removed** — `loadStopsByIds` + `generateRoute` no longer use `setTimeout` hacks. `generateRoute` already accepts `overrideStops` parameter, making the delay unnecessary and fragile
- **HIGH: Biased shuffle replaced with Fisher-Yates** — `[...arr].sort(() => Math.random() - 0.5)` does not produce uniform randomness. Replaced with proper Fisher-Yates `shuffle()` utility in all 8 locations: Destinations, SriLankaPride, DiscoverMore, BestOfJuly, CTA, SimilarPlaces, Footer, gallery.js
- **HIGH: Dead files deleted** — Removed `PopularNearYou.jsx` and `Businesses.jsx` (unused older versions superseded by NearestPlaces and NearestBusinesses)
- **MEDIUM: SriLankaPride dead code cleaned** — Removed `FaRoute` import and `Road Trip Routes` icon mapping (category no longer exists). Removed `d.stops` search filter (pride items have no `stops` field)
- **MEDIUM: Map controls visible on mobile** — Controls were hidden when list was open on mobile via `hidden md:flex`, but the list is a bottom sheet that doesn't overlap controls. Removed the `showList` condition
- **MEDIUM: MultiLineString geometry support** — Route bounds calculation now handles both `LineString` and `MultiLineString` geometry types from OSRM
- **SEO: index.html description synced** — `<meta name="description">` now matches `og:description` (was different text)
- **CSS: Leaflet focus outline removed** — `outline: none` on `.leaflet-interactive` prevents black border appearing on route polyline click
- **CSS: Leaflet tooltip styles** — All Leaflet tooltips now use clean white backgrounds with no borders/arrows (was dark default with black border)
- **CSS: Leaflet popup borders removed** — `.leaflet-popup-content-wrapper` and `.leaflet-popup-tip` borders removed for clean appearance
- **CSS: Preset route tooltip styles** — `.preset-route-tooltip` and `.preset-route-popup` classes override default Leaflet tooltip appearance
- **Preset routes: Loading eye icon** — Spinning teal eye icon shown at first stop while OSRM route data is being fetched
- **Preset routes: Parallel fetching** — All 12 preset trips now fetch simultaneously instead of sequentially. All segments within each trip also fetch in parallel
- **Preset routes: Road-following only** — No more straight/dashed placeholder lines. Polylines only appear after actual OSRM road geometry is fetched
- **Route click loads Trip Planner** — Clicking a preset route polyline on the map now loads it into the Trip Planner
- **Route Summary: Share dropdown** — Single Share button replaced with dropdown: Send (Web Share API / email), Copy (clipboard), Download (.txt file) — all with full trip plan text including stops, distances, and shareable URL
- **Trip plan text fix** — Fixed `Day undefined` bug: `generateItinerary()` returns arrays of arrays `[[stops]]`, not objects with `.dayNumber`
- **Button sizes reduced** — NearbyPlaces "+" and RouteTimeline "x" remove buttons reduced from 44px to 28px
- **Route remove button alignment** — Removed awkward `mt-[-6px]`, replaced with `self-center` for proper vertical alignment

### v1.0.0-pre.5 Comprehensive Codebase Audit
- **HIGH: DestinationCard broken Google Maps link** — `coordinates.lat`/`.lng` accessed as object properties but coordinates are `{ lat, lng }` objects. The `.lat`/`.lng` access was correct but the audit flagged a potential array format issue. Verified all data files use `{ lat, lng }` objects consistently. Added defensive `Array.isArray()` check as fallback
- **HIGH: BusinessCard same coordinates issue** — Same fix applied to BusinessCard directions link
- **HIGH: GalleryGrid setState inside useMemo** — `setSelectedImage(null)` was called inside a `useMemo` callback (React anti-pattern). Moved to a separate `useEffect` that checks `currentIndex === -1`
- **MEDIUM: Map page missing `<h1>`** — Added visually hidden `<h1>Sri Lanka Interactive Map</h1>` for SEO/accessibility
- **MEDIUM: MapPlaceList `<h1>` → `<h2>`** — Changed "Places" heading from `<h1>` to `<h2>` to avoid multiple `<h1>` tags on map page
- **MEDIUM: Hero background images empty alt** — Gallery, Destinations, and SriLankaPride hero background images now have descriptive alt text for SEO
- **MEDIUM: netlify.toml security headers** — Removed deprecated `X-XSS-Protection` header, added comprehensive `Content-Security-Policy` header, added `payment=()` to Permissions-Policy
- **MEDIUM: netlify.toml identity redirects removed** — Removed unnecessary identity redirects for sitemap.xml, robots.txt, ai.txt, llms.txt (Netlify serves static files from `public/` by default)
- **LOW: DestinationCard static objects hoisted** — `categoryColors` and `tierConfig` moved outside component to avoid re-creation on every render
- **LOW: PrideCard dev mode warning** — Unknown categories now log a console warning in development mode instead of silently falling back to ancient-kingdoms styling
- **SEO: schema.js updated** — Added missing `clDistance` field to DESTINATIONS_SCHEMA, fixed section numbering (was 1,2,3,5,4 → now 1,2,3,4,5)
- **SEO: README.md updated** — Fixed sitemap URL count (237), added `clDistance` to destinations field table, updated security headers description

### v1.0.0-pre.4 Legal Pages & Business Terms Audit
- **Created Business Terms page** (`/business-terms`) — listing policies, claims, removal procedures, Curated Free Listings section
- **Created Cookie Policy page** (`/cookie-policy`) — 10 sections, 4 cookie tables, all third-party services disclosed
- **Created Disclaimer page** (`/disclaimer`) — 11 sections covering travel advice, listings, links, liability
- **Created Unsubscribe page** (`/unsubscribe`) — working unsubscribe via Google Apps Script
- **All 6 legal pages cross-linked** in bottom navigation of each page
- **Comprehensive audit of all 6 legal pages** — removed 9 false claims: "other users" (no accounts), "via email" (no email system), age claim, dedup logic softened, 12-month expiry removed, payment clarified as manual WhatsApp, rankings/bot protection removed
- **Featured Plan description updated** — "homepage visibility" → "a dedicated single page website linked from your listing (without SEO optimisation)"
- **Advertise feature matrix updated** — "Homepage Feature" → "Single Page Website"; removed false "12 months" claim
- **Refund policy rewritten** — "we will arrange a refund via WhatsApp" → "we will inform you via WhatsApp and arrange a refund"
- **`getEffectiveTier(item)` helper** — determines effective tier considering `expiresAt` expiry; backward compatible
- **`expiresAt` field added to ALL businesses** — standard = `''`, featured/premium = `'2027-07-21'`
- **DestinationDetail & MapPlaceList** — badges and sorting now use `getEffectiveTier()` instead of raw `item.tier`
- **Sitemap generator updated** — now includes all 6 legal pages (was missing privacy-policy, terms-of-service, business-terms, cookie-policy, disclaimer, unsubscribe)
- **OG page generator updated** — now generates OG pages for all 6 legal pages

### v1.0.1 — Road Distance & UI Fixes
- **NearestPlaces road distance** — Pre-filters top 10 by haversine, then fetches actual OSRM road distances via `fetchRoute`, sorts by road distance, shows top 3. Falls back to haversine × 1000 if OSRM fails
- **NearestBusinesses road distance** — Same approach: pre-filters top 12, fetches road distances, shows top 4 by road distance
- **BusinessCard website button** — Changed from pill with text to icon-only circle (`w-[44px] h-[44px]`) with `aria-label="Website"` for accessibility
- **BusinessCard action buttons** — Changed from `flex-wrap` to `flex-nowrap overflow-x-auto no-scrollbar` to prevent 2-line wrapping on mobile
- **RouteSummary share dropdown** — Reordered classes to `top-full mt-1 right-0` so dropdown opens downward. When no Optimize button (≤2 stops), wrapper gets `flex-1` and button gets `w-full` so dropdown stays within bounds
- **NearbyPlaces stop filtering** — Added `stops` prop, builds `stopIds` Set, filters out places already added as stops from `availablePlaces`. All 4 `<NearbyPlaces>` usages now pass `stops` (Map, MapSidePanel, RoadTripPlanner mobile + desktop)

### v1.1.1 — Geolocation Fallback & Search UX
- **NearestPlaces random fallback** — When geolocation is unavailable (denied, error, or timeout), shows 3 random places instead of error/"Try Again" block. Heading changes to "Popular Places to Visit" (was "Popular Places Near You")
- **NearestBusinesses random fallback** — Shows random `featured`/`premium` tier businesses when no location. Heading changes to "Hotels & Attractions to Visit" (was "Popular Places to Visit"). Removed error block entirely
- **TripFinder start point UX** — Start point auto-fills "My Current Location" via `useRef` flag to prevent re-trigger loop. `onFocusClear` clears input on focus so user can type. Added `useEffect` to reset `selected` state when value empties, ensuring dropdown reappears
- **PlaceSearch dropdown fix** — Removed `overflow-hidden` from search sections that blocked dropdown visibility. Added `useEffect` to reset `selected` state when value becomes empty. Shows random suggested places when input is empty/focused
- **Home.jsx section restoration** — TripFinder section restored after accidental removal

### v1.1.0 — Current Location & Personalized Distances
- **Shared `useGeolocation` hook** — Created `src/hooks/useGeolocation.js` with module-level singleton pattern. Multiple components share the same geolocation result without duplicate browser prompts. Used by NearestPlaces, NearestBusinesses, TripFinder, DestinationDetail, PrideDetail, and Map page
- **TripFinder current location** — Start point auto-selects "My Current Location" when GPS is available. Users can also manually select it from the start point dropdown. Navigates to map with `__current_location` ID
- **Map page `__current_location` handling** — When `?trip=__current_location,endId` is loaded, resolves the synthetic stop using shared geolocation. Waits for GPS before processing if needed
- **Detail pages "X km from you"** — `DestinationDetail` and `PrideDetail` now calculate OSRM road distance from user's current location and display "X km from you". Falls back to "X km from Colombo" when geolocation is unavailable
- **NearestPlaces/NearestBusinesses deduplication** — Both components now use the shared `useGeolocation` hook instead of making independent geolocation requests

### DraggableBottomSheet Fixes
- **CRITICAL: Velocity direction inverted** — `snapToNearest` had reversed flick logic: flicking DOWN (positive velocity) snapped toward Full instead of Peek. Fixed `++`/`--` so down = lower index, up = higher index
- **CRITICAL: `touch-action: none` blocked native scroll** — Parent `motion.div` had `touch-action: none` which, per W3C spec, made the effective touch-action `none` for all descendants (intersection of ancestor values). Inner scroll containers never scrolled on touch devices. Removed entirely — JS handlers control all drag behavior
- **HIGH: Drag-from-body scroll isolation broken** — `handlePointerDown` second boundary condition blocked drag start at scroll top (`!atBottom && rect.bottom - e.clientY > 10` true for most touch positions). Removed all scroll-boundary logic — drag now only starts from handle bar (standard Material Design bottom sheet pattern)
- **HIGH: `e.preventDefault()` ignored on window listener** — `window.addEventListener('pointermove', onMove)` added without `{ passive: false }`, so `preventDefault()` was silently ignored in some browsers. Added explicit `{ passive: false }` option
- **MEDIUM: Visible scrollbar on mobile** — Added `no-scrollbar` utility class to scroll container
- **LOW: Inline `onSelect` duplicated logic** — Mobile `MapPlaceList` had inline function copying `handleSelectItem` logic, allocating new function every render. Replaced with callback reference

### Pre-release Audit Fixes
- **Route code splitting** — All 13 page components now use `React.lazy()` + `Suspense` for route-level code splitting. Initial JS bundle dropped from single 1.3MB chunk to 623KB shared + per-page lazy chunks (Map: 287KB, Home: 50KB, etc.)
- **RouteTimeline touch target** — Remove button changed from `opacity-0 group-hover:opacity-100` (invisible on touch) to `sm:opacity-0 sm:group-hover:opacity-100 opacity-60` so buttons are always visible on mobile
- **RoadTripPlanner clear button touch targets** — Both mobile and desktop "Clear" buttons upgraded from `px-2 py-1` to `min-h-[44px] px-2.5 py-1.5` for proper touch targets
- **SEO index.html/React title sync** — `index.html` OG title and description now match the values rendered by `SEO.jsx` for the homepage. No more mismatch between static and runtime meta tags
- **SEO.jsx fallback title** — Changed from `Eastory SL — Sri Lanka Travel Guide` to `Eastory SL — Travel Guide` to match `index.html`
- **OG page generation title sync** — `generate-og-pages.js` listRoutes titles now match the exact titles passed to `<SEO>` in each React component (e.g., "Sri Lanka Destinations — Top Places to Visit" instead of just "Destinations")
- **OG page generation description sync** — Descriptions updated to match React component SEO descriptions
- **routingService provider parser bug** — `fetchRoute` now always uses `PROVIDERS.osrm.parseResponse()` instead of the `activeProvider` parser, since all mirror URLs are OSRM-format. Prevents silent data corruption if provider is ever switched
- **DNS prefetch for images** — Added `dns-prefetch` hint for `raw.githubusercontent.com` where destination images are hosted
- **Orphaned manifest deleted** — Removed `public/images/logo/site.webmanifest` (incorrect icon paths, wrong theme color, not referenced anywhere). The PWA manifest is generated by `vite-plugin-pwa`
- **schema.js preset trips** — Added `PRESET_TRIPS_SCHEMA` as section 5 with all field definitions, category options, Tailwind color options, template, and example
- **Preset Routes road-following** — Changed from single multi-stop OSRM request (which fails for long routes) to segmented fetching (pair-by-pair) with merged geometry. Failed routes now retry instead of permanently falling back to straight lines

---

## Contact

- **Email:** eastory.sl@gmail.com
- **Phone:** +94724362001
- **WhatsApp:** +94724362001
- **Facebook:** https://www.facebook.com/profile.php?id=61591629429221
- **Instagram:** https://www.instagram.com/eastory.sl
- **Website:** https://eastorysl.netlify.app

---

## License

MIT © Eastory SL
