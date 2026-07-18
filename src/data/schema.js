/**
 * ============================================================
 *  EASTORY SL — DATA SCHEMA REFERENCE
 * ============================================================
 *  Admin guide for adding new entries to:
 *    • destinations.js   → src/data/destinations.js
 *    • sriLankaPride.js  → src/data/sriLankaPride.js
 *    • businesses.js     → src/data/businesses.js
 *    • gallery.js        → src/data/gallery.js
 *    • presetTrips.js    → src/data/presetTrips.js
 *
 *  Each section contains:
 *    1. Field definitions (name, type, required, description)
 *    2. Available options for category / tier / type fields
 *    3. Copy-paste template ready to fill in
 *    4. A working example entry
 *
 *  ID FORMAT RULES
 *    - lowercase, kebab-case: "beach-mirissa"
 *    - Prefix matches category abbreviation:
 *        destinations  → category prefix (beach-, wf-, np- …)
 *        pride         → category prefix  (ak-, mg-, fc- …)
 *        businesses    → type prefix      (hotel-, shop-, svc-)
 * ============================================================
 */

// ────────────────────────────────────────────────────────────
//  1. DESTINATIONS  (src/data/destinations.js)
// ────────────────────────────────────────────────────────────

export const DESTINATIONS_SCHEMA = {
  fields: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Unique kebab-case identifier. Prefix with category abbreviation.",
      example: "beach-mirissa",
    },
    {
      name: "name",
      type: "string",
      required: true,
      description: "Display name of the destination.",
      example: "Mirissa Beach",
    },
    {
      name: "location",
      type: "string",
      required: true,
      description: "Town or area name.",
      example: "Mirissa",
    },
    {
      name: "district",
      type: "string",
      required: true,
      description: "Administrative district.",
      example: "Matara",
      options: [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa",
        "Colombo", "Galle", "Gampaha", "Hambantota",
        "Jaffna", "Kalutara", "Kandy", "Kegalle",
        "Kurunegala", "Mannar", "Matale", "Matara",
        "Moneragala", "Nuwara Eliya", "Polonnaruwa",
        "Puttalam", "Ratnapura", "Trincomalee",
      ],
    },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Destination category.",
      example: "beaches",
      options: [
        "beaches", "waterfalls", "nature", "mountains",
        "wildlife", "parks", "historical", "religious",
        "forts", "lakes & rivers", "islands",
        "botanical gardens", "cultural",
        "scenic train journeys", "viewpoints",
        "marine attractions", "adventure activities",
        "festivals & events",
      ],
    },
    {
      name: "tier",
      type: "string",
      required: true,
      description: "Visibility tier on the site.",
      example: "premium",
      options: ["premium", "standard", "featured"],
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Short description shown on cards (1–2 sentences).",
      example:
        "A picturesque crescent-shaped beach renowned for golden sands, turquoise waters, and spectacular sunsets.",
    },
    {
      name: "detail",
      type: "string (HTML)",
      required: true,
      description:
        "Full HTML detail page content. Must be wrapped in <section class='destination-content'>…</section>.",
      template:
        "<section class='destination-content'>\n  <h2>Overview</h2>\n  <p>…</p>\n  <h2>Why Visit?</h2>\n  <ul><li>…</li></ul>\n  <h2>Top Attractions</h2>\n  <ul><li>…</li></ul>\n  <h2>Things to Do</h2>\n  <ul><li>…</li></ul>\n  <h2>Best Time to Visit</h2>\n  <p>…</p>\n</section>",
    },
    {
      name: "image",
      type: "string (URL)",
      required: true,
      description: "Cover image URL (used on cards and OG tags).",
      example:
        "https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/MirissaBeach.jpg",
    },
    {
      name: "bestTime",
      type: "string",
      required: false,
      description: "Best months/season to visit.",
      example: "November – April",
    },
    {
      name: "entryFee",
      type: "string",
      required: false,
      description: "Entry fee or 'Free'.",
      example: "Free",
    },
    {
      name: "duration",
      type: "string",
      required: false,
      description: "Recommended time to spend.",
      example: "3–5 hours",
    },
    {
      name: "coordinates",
      type: "object",
      required: true,
      description: "GPS coordinates for map integration.",
      example: { lat: 5.9449665982904945, lng: 80.45779461185273 },
    },
    {
      name: "googleMapsLink",
      type: "string (URL)",
      required: true,
      description: "Google Maps short link.",
      example: "https://maps.app.goo.gl/DibkumdrbekmhgVs6",
    },
  ],

  template: `{
  id: "category-shortname",
  name: "Place Name",
  location: "Town",
  district: "District",
  category: "category",
  tier: "standard",
  description: "Short one-line description.",
  detail:
    "<section class='destination-content'><h2>Overview</h2><p>Detailed description.</p><h2>Why Visit?</h2><ul><li>Reason 1</li><li>Reason 2</li></ul><h2>Things to Do</h2><ul><li>Activity 1</li><li>Activity 2</li></ul></section>",
  image: "https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/YourImage.jpg",
  bestTime: "Year-round",
  entryFee: "Free",
  duration: "2–3 hours",
  coordinates: { lat: 0.00000, lng: 0.00000 },
  googleMapsLink: "https://maps.app.goo.gl/XXXXX",
},`,

  example: `{
  id: "beach-mirissa",
  name: "Mirissa Beach",
  location: "Mirissa",
  district: "Matara",
  category: "beaches",
  tier: "premium",
  description:
    "A picturesque crescent-shaped beach renowned for golden sands, turquoise waters, and spectacular sunsets.",
  detail:
    "<section class='destination-content'><h2>Overview</h2><p>Mirissa Beach is one of Sri Lanka's most famous tropical beach destinations.</p><h2>Why Visit?</h2><ul><li>Beautiful crescent-shaped beach</li><li>World-famous blue whale watching</li></ul><h2>Things to Do</h2><ul><li>Whale watching</li><li>Surfing</li><li>Sunset photography</li></ul></section>",
  image: "https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/MirissaBeach.jpg",
  bestTime: "November – April",
  entryFee: "Free",
  duration: "3–5 hours",
  coordinates: { lat: 5.9449665982904945, lng: 80.45779461185273 },
  googleMapsLink: "https://maps.app.goo.gl/DibkumdrbekmhgVs6",
},`,
};


// ────────────────────────────────────────────────────────────
//  2. SRI LANKA PRIDE  (src/data/sriLankaPride.js)
// ────────────────────────────────────────────────────────────

export const PRIDE_SCHEMA = {
  fields: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Unique kebab-case identifier. Prefix with category abbreviation.",
      example: "ak-anuradhapura",
    },
    {
      name: "name",
      type: "string",
      required: true,
      description: "Display name.",
      example: "Kingdom of Anuradhapura",
    },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Pride item category.",
      example: "ancient-kingdoms",
      options: [
        "ancient-kingdoms", "museums", "caves-geological-wonders",
        "cities-urban", "food-culinary", "seasonal-foods",
        "tea-spice-trails", "famous-people",
      ],
    },
    {
      name: "subCategory",
      type: "string",
      required: false,
      description: "Only for category 'famous-people'.",
      example: "national-heroes",
      options: [
        "national-heroes", "sports-legends", "arts-entertainment",
        "science-tech", "writers-literature", "global-achievers",
      ],
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Short one-line description.",
      example:
        "The first and longest-serving capital of ancient Sri Lanka.",
    },
    {
      name: "detail",
      type: "string (HTML)",
      required: true,
      description:
        "Full HTML detail page. Must be wrapped in <section class='destination-content'>…</section>.",
      template:
        "<section class='destination-content'>\n  <h2>Overview</h2>\n  <p>…</p>\n  <h2>Why Visit?</h2>\n  <ul><li>…</li></ul>\n  <h2>Things to Do</h2>\n  <ul><li>…</li></ul>\n  <h2>Historical Significance</h2>\n  <p>…</p>\n</section>",
    },
    {
      name: "image",
      type: "string (URL)",
      required: true,
      description: "Cover image URL.",
      example:
        "https://raw.githubusercontent.com/eastorysl/storyimages/main/pride/KingdomofAnuradhapura.png",
    },
    {
      name: "period",
      type: "string",
      required: false,
      description: "Time period (ancient-kingdoms, museums, etc.).",
      example: "377 BCE - 1017 CE",
    },
    {
      name: "location",
      type: "string",
      required: false,
      description: "Town or area.",
      example: "Anuradhapura",
    },
    {
      name: "district",
      type: "string",
      required: false,
      description: "Administrative district.",
      example: "Anuradhapura",
      options: [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa",
        "Colombo", "Galle", "Gampaha", "Hambantota",
        "Jaffna", "Kalutara", "Kandy", "Kegalle",
        "Kurunegala", "Mannar", "Matale", "Matara",
        "Moneragala", "Nuwara Eliya", "Polonnaruwa",
        "Puttalam", "Ratnapura", "Trincomalee",
      ],
    },
    {
      name: "coordinates",
      type: "object",
      required: false,
      description: "GPS coordinates. Required for map-linked items.",
      example: { lat: 8.360875847988282, lng: 80.40236581162839 },
    },
    {
      name: "googleMapsLink",
      type: "string (URL)",
      required: false,
      description: "Google Maps short link.",
      example: "https://maps.app.goo.gl/PunQqyaSYR2jZKAo9",
    },
    {
      name: "birthYear",
      type: "string",
      required: false,
      description: "Only for category 'famous-people'.",
      example: "1864",
    },
    {
      name: "birthPlace",
      type: "string",
      required: false,
      description: "Only for category 'famous-people'.",
      example: "Colombo",
    },
    {
      name: "seasonMonths",
      type: "string",
      required: false,
      description: "Only for category 'seasonal-foods'.",
      example: "December – February",
    },
    {
      name: "seasonName",
      type: "string",
      required: false,
      description: "Only for category 'seasonal-foods'.",
      example: "Maha Season",
    },
    {
      name: "duration",
      type: "string",
      required: false,
      description: "Duration string for time-based items.",
      example: "2–3 days",
    },
    {
      name: "stops",
      type: "string",
      required: false,
      description: "Comma-separated stop list for route items.",
      example: "Colombo, Bentota, Galle, Mirissa",
    },
  ],

  template: `{
  id: "category-shortname",
  name: "Item Name",
  category: "category",
  description: "Short one-line description.",
  detail:
    "<section class='destination-content'><h2>Overview</h2><p>Detailed description.</p><h2>Why Visit?</h2><ul><li>Reason 1</li></ul><h2>Things to Do</h2><ul><li>Activity 1</li></ul></section>",
  image: "https://raw.githubusercontent.com/eastorysl/storyimages/main/pride/YourImage.jpg",
  period: "Year range",
  location: "Town",
  district: "District",
  coordinates: { lat: 0.00000, lng: 0.00000 },
  googleMapsLink: "https://maps.app.goo.gl/XXXXX",
},`,

  example: `{
  id: "ak-anuradhapura",
  name: "Kingdom of Anuradhapura",
  category: "ancient-kingdoms",
  description:
    "The first and longest-serving capital of ancient Sri Lanka, renowned for its sacred Buddhist heritage.",
  detail:
    "<section class='destination-content'><h2>Overview</h2><p>The Kingdom of Anuradhapura was the first capital of ancient Sri Lanka.</p><h2>Why Visit?</h2><ul><li>UNESCO World Heritage Site</li></ul><h2>Things to Do</h2><ul><li>Visit sacred Buddhist temples</li></ul></section>",
  image: "https://raw.githubusercontent.com/eastorysl/storyimages/main/pride/KingdomofAnuradhapura.png",
  period: "377 BCE - 1017 CE",
  location: "Anuradhapura",
  coordinates: { lat: 8.360875847988282, lng: 80.40236581162839 },
  googleMapsLink: "https://maps.app.goo.gl/PunQqyaSYR2jZKAo9",
},`,

  conditionalFields: {
    "famous-people": ["subCategory", "birthYear", "birthPlace"],
    "seasonal-foods": ["seasonMonths", "seasonName"],
  },
};


// ────────────────────────────────────────────────────────────
//  3. BUSINESSES  (src/data/businesses.js)
// ────────────────────────────────────────────────────────────

export const BUSINESSES_SCHEMA = {
  fields: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Unique kebab-case identifier. Prefix with type.",
      example: "hotel-dyke-rest",
    },
    {
      name: "name",
      type: "string",
      required: true,
      description: "Business display name.",
      example: "Dyke Rest",
    },
    {
      name: "type",
      type: "string",
      required: true,
      description: "Internal type code.",
      example: "guesthouse",
      options: ["guesthouse", "hotel", "shop", "service"],
    },
    {
      name: "subCategory",
      type: "string",
      required: true,
      description: "Display sub-category.",
      example: "Guest Houses",
      options: [
        "Guest Houses", "Hotels", "Resorts",
        "Souvenir Shops", "Surfing", "Diving",
        "Snorkeling", "Whale Watching", "Hiking",
        "Cycling", "Fishing", "Boat Tours",
        "Safari", "Photography Spots",
      ],
    },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Top-level category.",
      example: "Accommodation",
      options: ["Accommodation", "Shopping", "Water Sports", "Tours"],
    },
    {
      name: "location",
      type: "string",
      required: true,
      description: "Full location string with area and city.",
      example: "Dyke Street, Trincomalee",
    },
    {
      name: "district",
      type: "string",
      required: true,
      description: "Administrative district.",
      example: "Trincomalee",
      options: [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa",
        "Colombo", "Galle", "Gampaha", "Hambantota",
        "Jaffna", "Kalutara", "Kandy", "Kegalle",
        "Kurunegala", "Mannar", "Matale", "Matara",
        "Moneragala", "Nuwara Eliya", "Polonnaruwa",
        "Puttalam", "Ratnapura", "Trincomalee",
      ],
    },
    {
      name: "tier",
      type: "string",
      required: true,
      description: "Visibility tier on the site.",
      example: "standard",
      options: ["premium", "standard", "featured"],
    },
    {
      name: "rating",
      type: "number",
      required: false,
      description: "Rating from 0 to 5. Only a few entries have this.",
      example: 4.8,
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Short one-line description.",
      example:
        "A beachfront guesthouse offering private beach access and ocean-view rooms.",
    },
    {
      name: "detail",
      type: "string (HTML)",
      required: false,
      description:
        "Full HTML detail page. Wrapped in <section class='destination-content'>…</section>. Not all entries have this.",
      template:
        "<section class='destination-content'>\n  <h2>Overview</h2>\n  <p>…</p>\n  <h2>What We Offer</h2>\n  <ul><li>…</li></ul>\n  <h2>Amenities</h2>\n  <ul><li>…</li></ul>\n</section>",
    },
    {
      name: "image",
      type: "string (URL)",
      required: true,
      description: "Cover image URL.",
      example: "https://placehold.co/800x600?text=Business+Name",
    },
    {
      name: "coordinates",
      type: "object",
      required: true,
      description: "GPS coordinates.",
      example: { lat: 8.565879169481878, lng: 81.23979759575427 },
    },
    {
      name: "phone",
      type: "string",
      required: false,
      description: "International format phone number.",
      example: "+94 262 225 313",
    },
    {
      name: "website",
      type: "string (URL)",
      required: false,
      description: "Business website URL. Empty string if none.",
      example: "",
    },
    {
      name: "googleMapsLink",
      type: "string (URL)",
      required: true,
      description: "Google Maps short link.",
      example: "https://maps.app.goo.gl/3MeX5zHpxqNweyPP9",
    },
    {
      name: "social",
      type: "object",
      required: false,
      description: "Social media links. Include only accounts that exist.",
      example: {
        facebook: "https://www.facebook.com/example",
        instagram: "https://www.instagram.com/example",
      },
    },
  ],

  template: `{
  id: "type-business-name",
  name: "Business Name",
  type: "hotel",
  subCategory: "Hotels",
  category: "Accommodation",
  location: "Area, City",
  district: "District",
  tier: "standard",
  rating: 4.5,
  description: "Short one-line description.",
  detail:
    "<section class='destination-content'><h2>Overview</h2><p>Detailed description.</p><h2>What We Offer</h2><ul><li>Feature 1</li></ul><h2>Amenities</h2><ul><li>Amenity 1</li></ul></section>",
  image: "https://placehold.co/800x600?text=Business+Name",
  coordinates: { lat: 0.00000, lng: 0.00000 },
  phone: "+94 XX XXX XXXX",
  website: "",
  googleMapsLink: "https://maps.app.goo.gl/XXXXX",
  social: { facebook: "https://facebook.com/example" },
},`,

  example: `{
  id: "hotel-dyke-rest",
  name: "Dyke Rest",
  type: "guesthouse",
  subCategory: "Guest Houses",
  category: "Accommodation",
  location: "Dyke Street, Trincomalee",
  district: "Trincomalee",
  tier: "standard",
  rating: 4.8,
  description:
    "A beachfront guesthouse offering private beach access, ocean-view rooms, and free Wi-Fi.",
  image: "https://q-xx.bstatic.com/xdata/images/hotel/max1024x683/60170006.jpg",
  coordinates: { lat: 8.565879169481878, lng: 81.23979759575427 },
  phone: "+94 262 225 313",
  website: "",
  googleMapsLink: "https://maps.app.goo.gl/3MeX5zHpxqNweyPP9",
  social: { facebook: "https://www.facebook.com/dykerest.trincomalee/" },
},`,
};


// ────────────────────────────────────────────────────────────
//  5. PRESET TRIPS  (src/data/presetTrips.js)
// ────────────────────────────────────────────────────────────

export const PRESET_TRIPS_SCHEMA = {
  fields: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Unique kebab-case identifier.",
      example: "south-coast",
    },
    {
      name: "name",
      type: "string",
      required: true,
      description: "Display name of the trip.",
      example: "South Coast Road Trip",
    },
    {
      name: "description",
      type: "string",
      required: true,
      description: "Short one-line description of the trip.",
      example: "Explore the stunning southern coastline from Bentota to Yala.",
    },
    {
      name: "icon",
      type: "string (emoji)",
      required: true,
      description: "Single emoji shown on map markers and tooltips.",
      example: "\u{1F3D6}\u{FE0F}",
    },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Trip theme category.",
      example: "Beaches",
      options: [
        "Beaches", "Historical", "Nature", "Wildlife",
        "Adventure", "Photography", "Family", "Luxury",
        "Weekend",
      ],
    },
    {
      name: "duration",
      type: "string",
      required: true,
      description: "Estimated trip duration.",
      example: "3–4 days",
    },
    {
      name: "distance",
      type: "string",
      required: true,
      description: "Approximate total distance.",
      example: "~320 km",
    },
    {
      name: "color",
      type: "string",
      required: true,
      description: "Tailwind gradient class for the trip card.",
      example: "from-ocean-500 to-cyan-500",
      options: [
        "from-ocean-500 to-cyan-500", "from-amber-500 to-orange-500",
        "from-emerald-500 to-green-500", "from-blue-500 to-ocean-500",
        "from-amber-600 to-orange-500", "from-green-500 to-emerald-500",
        "from-red-500 to-rose-500", "from-rose-500 to-pink-500",
        "from-purple-500 to-indigo-500", "from-amber-400 to-yellow-500",
        "from-slate-500 to-slate-400",
      ],
    },
    {
      name: "stopIds",
      type: "array of strings",
      required: true,
      description: "Ordered list of destination IDs. Must exist in destinations.js. Minimum 2 stops.",
      example: ["beach-bentota", "beach-hikkaduwa", "fort-galle", "beach-unawatuna"],
    },
  ],

  template: `{
  id: "trip-shortname",
  name: "Trip Name",
  description: "Short one-line trip description.",
  icon: "\u{1F30A}",
  category: "Beaches",
  duration: "3–4 days",
  distance: "~320 km",
  color: "from-ocean-500 to-cyan-500",
  stopIds: ["stop-id-1", "stop-id-2", "stop-id-3"],
},`,

  example: `{
  id: "south-coast",
  name: "South Coast Road Trip",
  description: "Explore the stunning southern coastline from Bentota to Yala, with beaches, forts, and whale watching.",
  icon: "\u{1F3D6}\u{FE0F}",
  category: "Beaches",
  duration: "3–4 days",
  distance: "~320 km",
  color: "from-ocean-500 to-cyan-500",
  stopIds: [
    "beach-bentota", "beach-hikkaduwa", "fort-galle",
    "beach-unawatuna", "beach-weligama", "beach-mirissa",
    "beach-hiriketiya", "beach-tangalle", "wl-bundala", "wl-yala",
  ],
},`,

  notes: [
    "Each stopId must already exist as an id in destinations.js.",
    "Routes are rendered on the map via OSRM road-following polylines.",
    "The 'color' field uses Tailwind gradient classes from the custom palette.",
    "Minimum 2 stops required. Stops define the route order.",
  ],
};


// ────────────────────────────────────────────────────────────
//  4. GALLERY  (src/data/gallery.js)
// ────────────────────────────────────────────────────────────

export const GALLERY_SCHEMA = {
  fields: [
    {
      name: "name",
      type: "string",
      required: true,
      description: "Display name of the place (must match the destination/pride item name).",
      example: "Mirissa Beach",
    },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Gallery filter category.",
      example: "beaches",
      options: [
        "beaches", "nature", "waterfalls", "historical",
        "religious", "forts", "cultural", "ancient-kingdoms",
        "food-culinary", "cities-urban", "famous-people",
        "accommodation", "adventure", "shopping",
      ],
    },
    {
      name: "location",
      type: "string",
      required: true,
      description: "Town or area name.",
      example: "Mirissa",
    },
    {
      name: "page",
      type: "string",
      required: true,
      description: "Source page the item belongs to.",
      example: "destinations",
      options: ["destinations", "sri-lanka-pride"],
    },
    {
      name: "images",
      type: "array of strings",
      required: true,
      description: "Array of extra image URLs to show in the gallery for this place.",
      example: [
        "https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/mirissabeach2.jpg",
        "https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/mirissabeach3.jpg",
      ],
    },
  ],

  // Key = destination or pride item ID (must already exist in that data file)
  template: `'item-id': {
  name: 'Place Name',
  category: 'category',
  location: 'Town',
  page: 'destinations',
  images: [
    'https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/image2.jpg',
    'https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/image3.jpg',
  ],
},`,

  example: `'beach-mirissa': {
  name: 'Mirissa Beach',
  category: 'beaches',
  location: 'Mirissa',
  page: 'destinations',
  images: [
    'https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/mirissabeach2.jpg',
    'https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/mirissabeach3.jpg',
    'https://raw.githubusercontent.com/eastorysl/storyimages/main/destination/mirissabeach4.jpg',
  ],
},`,

  notes: [
    "The key must match an existing ID from destinations.js or sriLankaPride.js.",
    "'page' value: use 'destinations' for destination items, 'sri-lanka-pride' for pride items.",
    "These are EXTRA images beyond the main 'image' field in the data file.",
    "Images are pulled from the GitHub repo: raw.githubusercontent.com/eastorysl/storyimages/main/.",
  ],
};
