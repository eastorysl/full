import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import * as L from 'leaflet'
import { Link } from 'react-router-dom'
import { FiMapPin, FiArrowRight, FiNavigation } from 'react-icons/fi'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { getCategoryLabel, getDetailPath } from '../../utils/mapHelpers'
import { handleImgError } from '../../utils/fallback'
import { escapeHTML } from '../../utils/escapeHTML'

const iconMap = {
  religious: 'fa-place-of-worship', historical: 'fa-landmark', nature: 'fa-leaf', beaches: 'fa-umbrella-beach',
  cultural: 'fa-masks-theater', adventure: 'fa-person-hiking', Accommodation: 'fa-hotel', Dining: 'fa-utensils',
  Shopping: 'fa-bag-shopping', 'Water Sports': 'fa-water', Tours: 'fa-compass',
  Hotels: 'fa-hotel', Resorts: 'fa-hotel', Villas: 'fa-home', 'Guest Houses': 'fa-bed',
  'Eco Lodges': 'fa-tree', 'Local Markets': 'fa-store', Handicrafts: 'fa-hand',
  'Souvenir Shops': 'fa-gift', 'Gems & Jewellery': 'fa-gem', 'Batik & Clothing': 'fa-tshirt',
  Surfing: 'fa-water', Diving: 'fa-water', Snorkeling: 'fa-water',
  'Whale Watching': 'fa-ship', Hiking: 'fa-person-hiking', Cycling: 'fa-bicycle',
  Fishing: 'fa-fish', 'Boat Tours': 'fa-ship', Safari: 'fa-paw',
  'Photography Spots': 'fa-camera', default: 'fa-location-dot',
}

function getIcon(item) {
  if (item.subCategory) return iconMap[item.subCategory] || iconMap.default
  if (item.type) {
    const labels = { hotel: 'Hotels', restaurant: 'Dining', shop: 'Shopping', service: 'Service' }
    return iconMap[labels[item.type]] || iconMap.default
  }
  return iconMap[item.category] || iconMap.default
}

function createMarkerIcon(icon, isSelected = false, name = '') {
  const label = name
    ? `<span class="marker-label">${escapeHTML(name)}</span>`
    : ''
  return L.divIcon({
    className: `custom-marker${isSelected ? ' selected' : ''}`,
    html: `<div class="marker-body">${label}<span class="marker-circle"><i class="fa-solid ${icon}"></i></span>${
      isSelected ? '<div class="marker-ring"></div>' : ''
    }</div>`,
    iconSize: [54, 72],
    iconAnchor: [27, 72],
    popupAnchor: [0, -72],
  })
}




const userLocationIcon = L.divIcon({
  className: '',
  html: `
    <svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1px 4px rgba(0,0,0,0.3));">
      <path d="M11 0C4.94 0 0 4.94 0 11c0 8.25 11 19.25 11 19.25S22 19.25 22 11C22 4.94 17.06 0 11 0z" fill="#EA4335"/>
      <circle cx="11" cy="11" r="5.5" fill="white"/>
      <circle cx="11" cy="11" r="4" fill="#EA4335"/>
    </svg>
  `,
  iconSize: [22, 30],
  iconAnchor: [11, 30],
  popupAnchor: [0, -30],
})

function UserLocationMarker({ position }) {
  const map = useMap()

  useEffect(() => {
    if (!position) return

    const marker = L.marker(position, { icon: userLocationIcon })
    marker.addTo(map)

    return () => {
      map.removeLayer(marker)
    }
  }, [map, position])

  return null
}

function MapContent({ filteredData, onSelectItem, flyToCoord, selectedItem, userLocation, onMapReady, onMapMove }) {
  const map = useMap()

  const onMapReadyRef = useRef(onMapReady)
  onMapReadyRef.current = onMapReady

  useEffect(() => {
    if (onMapReadyRef.current) onMapReadyRef.current(map)
  }, [map])
  const markerRefs = useRef({})
  const prevFlyTo = useRef(null)

  const bounds = useMemo(() => {
    const valid = filteredData.filter((d) => d.coordinates?.length === 2)
    if (valid.length === 0) return null
    return L.latLngBounds(valid.map((d) => d.coordinates))
  }, [filteredData])

  useEffect(() => {
    if (flyToCoord && flyToCoord.length === 2 && (flyToCoord[0] !== prevFlyTo.current?.[0] || flyToCoord[1] !== prevFlyTo.current?.[1])) {
      prevFlyTo.current = flyToCoord

      map.flyTo(flyToCoord, 16, { duration: 0.6 })

      const match = filteredData.find(
        (d) =>
          d.coordinates?.[0] === flyToCoord[0] &&
          d.coordinates?.[1] === flyToCoord[1]
      )
      const leafletMarker = match && markerRefs.current[match.id]?.leafletMarker

      if (leafletMarker) {
        const timer = setTimeout(() => {
          leafletMarker.openPopup()
        }, 700)
        return () => clearTimeout(timer)
      }
    }
  }, [map, flyToCoord, filteredData, selectedItem])

  useEffect(() => {
    if (bounds && filteredData.length > 0 && !flyToCoord && !selectedItem) {
      const valid = filteredData.filter((d) => d.coordinates?.length === 2)
      if (valid.length === 1) {
        map.flyTo(valid[0].coordinates, 12, { duration: 0.8 })
      } else if (valid.length > 1) {
        map.flyToBounds(bounds, { padding: [50, 50], duration: 0.8 })
      }
    }
  }, [map, bounds, filteredData, flyToCoord, selectedItem])

  useEffect(() => {
    if (!flyToCoord && filteredData.filter((d) => d.coordinates?.length === 2).length === 0) {
      map.setView([8.0, 81.0], 4.5)
    }
  }, [map, filteredData, flyToCoord])

  useEffect(() => {
    if (!onMapMove) return
    const handler = () => onMapMove()
    map.on('dragstart', handler)
    return () => { map.off('dragstart', handler) }
  }, [map, onMapMove])

  return (
    <>
      {userLocation && <UserLocationMarker position={userLocation} />}
    <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
      {filteredData.filter((d) => d.coordinates?.length === 2).map((item) => {
        const isSelected = selectedItem?.id === item.id
        return (
          <Marker
            key={item.id}
            position={item.coordinates}
            icon={createMarkerIcon(getIcon(item), isSelected, item.name)}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[item.id] = ref
              } else {
                delete markerRefs.current[item.id]
              }
            }}
            eventHandlers={{
              click: () => {
                onSelectItem?.(item)
              },
              mouseover: (e) => {
                if (!selectedItem) e.target.openPopup()
              },
              mouseout: (e) => {
                const related = e.originalEvent?.relatedTarget
                if (related?.closest?.('.leaflet-popup')) return
                e.target.closePopup()
              },
            }}
          >
            <Popup>
              <div className="min-w-[200px] sm:min-w-[240px] max-w-[260px] sm:max-w-[280px]">
                <div className="relative h-20 sm:h-28 -mx-3 -mt-3 mb-2 overflow-hidden rounded-t-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImgError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-[10px] text-white font-semibold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {getCategoryLabel(item)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-xs text-slate-900 leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <FiMapPin className="text-teal-500" />
                    {item.location || item.district}
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Link
                      to={getDetailPath(item)}
                      onClick={() => onSelectItem?.(item)}
                      className="flex items-center justify-center gap-1 flex-1 min-h-[44px] text-[10px] font-semibold text-white bg-gradient-to-r from-teal-500 to-ocean-500 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      View Details
                      <FiArrowRight className="text-[10px]" />
                    </Link>
                    {item.coordinates && (
                      <button
                        onClick={() => window.open(item.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates[0]},${item.coordinates[1]}`, '_blank', 'noopener')}
                        className="flex items-center justify-center gap-1 px-2 min-h-[44px] text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                      >
                        <FiNavigation className="text-[10px]" />
                        Directions
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MarkerClusterGroup>
    </>
  )
}

export default function MapView({ filteredData, onSelectItem, flyToCoord, selectedItem, userLocation, onMapReady, onMapMove, children }) {
  return (
    <MapContainer
      center={[8.0, 81.0]}
      zoom={7}
      minZoom={7}
      maxZoom={18}
      className="w-full h-full"
      zoomControl={false}
      zoomSnap={0.5}
      zoomDelta={1}
      wheelPxPerZoomLevel={80}
      zoomAnimation={true}
      zoomAnimationThreshold={6}
      fadeAnimation={true}
      markerZoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapContent filteredData={filteredData} onSelectItem={onSelectItem} flyToCoord={flyToCoord} selectedItem={selectedItem} userLocation={userLocation} onMapReady={onMapReady} onMapMove={onMapMove} />
      {children}
    </MapContainer>
  )
}

