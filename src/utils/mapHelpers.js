// Shared helpers for map components
// Centralized to avoid duplication across MapView, MapPlaceList, MapSidePanel

const prideLabels = {
  'ancient-kingdoms': 'Ancient Kingdoms',
  'caves-geological-wonders': 'Caves & Geology',
  'museums': 'Museums',
  'cities-urban': 'Cities & Urban',
  'food-culinary': 'Food & Culinary',
  'seasonal-foods': 'Seasonal Foods',
  'tea-spice-trails': 'Tea & Spice Trails',
  'famous-people': 'Famous People',
}

const destLabels = {
  beaches: 'Beaches',
  nature: 'Nature',
  waterfalls: 'Waterfalls',
  mountains: 'Mountains',
  wildlife: 'Wildlife',
  parks: 'Parks',
  historical: 'Historical',
  religious: 'Religious',
  forts: 'Forts',
  'lakes & rivers': 'Lakes & Rivers',
  islands: 'Islands',
  'botanical gardens': 'Botanical Gardens',
  cultural: 'Culture',
  'scenic train journeys': 'Scenic Train Journeys',
  viewpoints: 'Viewpoints',
  'marine attractions': 'Marine Attractions',
  'adventure activities': 'Adventure',
  'festivals & events': 'Festivals & Events',
}

export function getCategoryLabel(item) {
  if (item.subCategory) return item.subCategory
  if (item._source === 'pride') return prideLabels[item.category] || item.category || ''
  if (item._source === 'businesses') return item.subCategory || item.category || ''
  return destLabels[item.category] || item.category || ''
}

export function getDetailPath(item) {
  const cat = item.category ? encodeURIComponent(item.category) : ''
  if (item._source === 'destinations') return '/destinations/' + cat + '/' + item.id
  if (item._source === 'pride') return '/sri-lanka-pride/' + cat + '/' + item.id
  if (item._source === 'businesses') return '/discover-more'
  if (item.type) return '/discover-more'
  return '/destinations/' + cat + '/' + item.id
}

const prideClasses = {
  'ancient-kingdoms': 'bg-amber-100 text-amber-700',
  'caves-geological-wonders': 'bg-stone-100 text-stone-700',
  'museums': 'bg-indigo-100 text-indigo-700',
  'cities-urban': 'bg-blue-100 text-blue-700',
  'food-culinary': 'bg-rose-100 text-rose-700',
  'seasonal-foods': 'bg-orange-100 text-orange-700',
  'tea-spice-trails': 'bg-green-100 text-green-700',
  'famous-people': 'bg-pink-100 text-pink-700',
}

const destClasses = {
  religious: 'bg-teal-100 text-teal-700',
  historical: 'bg-amber-100 text-amber-700',
  nature: 'bg-emerald-100 text-emerald-700',
  beaches: 'bg-blue-100 text-blue-700',
  cultural: 'bg-coral-100 text-coral-700',
  adventure: 'bg-sunset-100 text-sunset-700',
  waterfalls: 'bg-blue-100 text-blue-700',
  mountains: 'bg-stone-100 text-stone-700',
  wildlife: 'bg-amber-100 text-amber-700',
  parks: 'bg-green-100 text-green-700',
  forts: 'bg-rose-100 text-rose-700',
  islands: 'bg-cyan-100 text-cyan-700',
  viewpoints: 'bg-yellow-100 text-yellow-700',
  'botanical gardens': 'bg-lime-100 text-lime-700',
  'scenic train journeys': 'bg-slate-200 text-slate-700',
  'marine attractions': 'bg-cyan-100 text-cyan-700',
  'adventure activities': 'bg-red-100 text-red-700',
  'festivals & events': 'bg-pink-100 text-pink-700',
  'lakes & rivers': 'bg-cyan-100 text-cyan-700',
}

const bizClasses = {
  Hotels: 'bg-purple-100 text-purple-700',
  Resorts: 'bg-indigo-100 text-indigo-700',
  'Guest Houses': 'bg-blue-100 text-blue-700',
  'Souvenir Shops': 'bg-pink-100 text-pink-700',
  Surfing: 'bg-cyan-100 text-cyan-700',
  Diving: 'bg-blue-100 text-blue-700',
  Snorkeling: 'bg-teal-100 text-teal-700',
  'Whale Watching': 'bg-sky-100 text-sky-700',
  Hiking: 'bg-green-100 text-green-700',
  Cycling: 'bg-amber-100 text-amber-700',
  Fishing: 'bg-blue-100 text-blue-700',
  'Boat Tours': 'bg-cyan-100 text-cyan-700',
  Safari: 'bg-orange-100 text-orange-700',
  'Photography Spots': 'bg-rose-100 text-rose-700',
}

export function getCategoryClass(item) {
  if (item.subCategory) return bizClasses[item.subCategory] || bizClasses[item.type] || 'bg-slate-100 text-slate-600'
  if (item._source === 'pride') return prideClasses[item.category] || 'bg-slate-100 text-slate-600'
  return destClasses[item.category] || 'bg-slate-100 text-slate-600'
}

const prideStyles = {
  'ancient-kingdoms': 'bg-gradient-to-r from-amber-600 to-orange-500',
  'caves-geological-wonders': 'bg-gradient-to-r from-stone-600 to-stone-500',
  'museums': 'bg-gradient-to-r from-indigo-600 to-purple-500',
  'cities-urban': 'bg-gradient-to-r from-blue-600 to-blue-500',
  'food-culinary': 'bg-gradient-to-r from-rose-600 to-pink-500',
  'seasonal-foods': 'bg-gradient-to-r from-orange-600 to-amber-500',
  'tea-spice-trails': 'bg-gradient-to-r from-green-600 to-emerald-500',
  'famous-people': 'bg-gradient-to-r from-pink-600 to-rose-500',
}

const destStyles = {
  beaches: 'bg-gradient-to-r from-ocean-500 to-cyan-500',
  nature: 'bg-gradient-to-r from-emerald-500 to-green-500',
  waterfalls: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  mountains: 'bg-gradient-to-r from-stone-500 to-slate-500',
  wildlife: 'bg-gradient-to-r from-amber-500 to-orange-500',
  parks: 'bg-gradient-to-r from-green-500 to-emerald-500',
  historical: 'bg-gradient-to-r from-amber-600 to-orange-500',
  religious: 'bg-gradient-to-r from-teal-500 to-emerald-500',
  forts: 'bg-gradient-to-r from-rose-500 to-pink-500',
  'lakes & rivers': 'bg-gradient-to-r from-cyan-500 to-blue-500',
  islands: 'bg-gradient-to-r from-cyan-500 to-teal-500',
  'botanical gardens': 'bg-gradient-to-r from-lime-500 to-green-500',
  cultural: 'bg-gradient-to-r from-coral-500 to-pink-500',
  'scenic train journeys': 'bg-gradient-to-r from-slate-500 to-slate-400',
  viewpoints: 'bg-gradient-to-r from-yellow-500 to-amber-500',
  'marine attractions': 'bg-gradient-to-r from-cyan-500 to-blue-500',
  'adventure activities': 'bg-gradient-to-r from-red-500 to-rose-500',
  'festivals & events': 'bg-gradient-to-r from-pink-500 to-rose-500',
}

export function getCategoryStyle(item) {
  if (item.type) return 'bg-gradient-to-r from-sunset-500 to-rose-500'
  if (item._source === 'pride') return prideStyles[item.category] || 'bg-gradient-to-r from-coral-500 to-pink-500'
  return destStyles[item.category] || 'bg-gradient-to-r from-teal-500 to-emerald-500'
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getEffectiveTier(item) {
  if (!item.tier || item.tier === 'standard' || item.tier === 'free') return 'standard'
  if (!item.expiresAt) return item.tier
  return new Date(item.expiresAt) > new Date() ? item.tier : 'standard'
}
