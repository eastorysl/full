import { useState, useEffect, useCallback } from 'react'

let sharedLocation = null
let sharedLoading = false
let sharedError = null
let watchPromise = null

function requestLocation() {
  if (watchPromise) return watchPromise
  if (!navigator.geolocation) {
    sharedError = 'Geolocation not supported'
    return Promise.resolve(null)
  }
  sharedLoading = true
  sharedError = null
  watchPromise = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sharedLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        sharedLoading = false
        resolve(sharedLocation)
      },
      (err) => {
        sharedLoading = false
        sharedError =
          err.code === 1 ? 'Location access denied'
          : err.code === 2 ? 'Location unavailable'
          : 'Location timed out'
        resolve(null)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
  return watchPromise
}

export default function useGeolocation() {
  const [location, setLocation] = useState(sharedLocation)
  const [loading, setLoading] = useState(sharedLoading)
  const [error, setError] = useState(sharedError)

  useEffect(() => {
    if (sharedLocation) {
      setLocation(sharedLocation)
      setLoading(false)
      return
    }
    setLoading(true)
    requestLocation().then(() => {
      setLocation(sharedLocation)
      setLoading(sharedLoading)
      setError(sharedError)
    })
  }, [])

  const refetch = useCallback(() => {
    watchPromise = null
    sharedLocation = null
    sharedError = null
    setLoading(true)
    requestLocation().then(() => {
      setLocation(sharedLocation)
      setLoading(sharedLoading)
      setError(sharedError)
    })
  }, [])

  return { location, loading, error, refetch }
}
