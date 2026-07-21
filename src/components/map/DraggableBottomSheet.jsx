import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

const SPRING = { type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }

export default function DraggableBottomSheet({
  snapIndex = 1,
  onSnapChange,
  peekHeight = 80,
  halfHeight,
  fullHeight,
  className = '',
  children,
}) {
  const sheetRef = useRef(null)
  const y = useMotionValue(0)
  const [vh, setVh] = useState(() => window.innerHeight)

  const half = halfHeight || Math.round(vh * 0.45)
  const full = fullHeight || Math.round(vh * 0.9)
  const snaps = useMemo(() => [peekHeight, half, full], [peekHeight, half, full])

  const dragState = useRef({
    active: false,
    startY: 0,
    startTranslate: 0,
    velocity: 0,
    lastY: 0,
    lastTime: 0,
    startTime: 0,
    totalDistance: 0,
  })

  useEffect(() => {
    const vp = window.visualViewport
    const handler = () => setVh(vp ? vp.height : window.innerHeight)
    if (vp) vp.addEventListener('resize', handler)
    window.addEventListener('resize', handler)
    return () => {
      if (vp) vp.removeEventListener('resize', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])

  const getTranslate = useCallback((idx) => full - snaps[idx], [full, snaps])

  useEffect(() => {
    animate(y, getTranslate(snapIndex), SPRING)
  }, [snapIndex, getTranslate, y])

  const cycleSnap = useCallback(() => {
    if (snapIndex === 0) {
      onSnapChange?.(1)
    } else if (snapIndex === 1) {
      onSnapChange?.(2)
    } else {
      onSnapChange?.(1)
    }
  }, [snapIndex, onSnapChange])

  const snapToNearest = useCallback((velocity, currentY) => {
    let targetIdx = 0
    let minDist = Infinity

    snaps.forEach((_, i) => {
      const translate = full - snaps[i]
      const dist = Math.abs(translate - currentY)
      if (dist < minDist) {
        minDist = dist
        targetIdx = i
      }
    })

    if (Math.abs(velocity) > 400) {
      if (velocity > 0 && targetIdx > 0) {
        targetIdx--
      } else if (velocity < 0 && targetIdx < snaps.length - 1) {
        targetIdx++
      }
    }

    onSnapChange?.(targetIdx)
  }, [snaps, full, onSnapChange])

  useEffect(() => {
    const ds = dragState.current

    const onMove = (e) => {
      if (!ds.active) return

      e.preventDefault()

      const deltaY = e.clientY - ds.startY
      ds.totalDistance = Math.abs(deltaY)

      const now = performance.now()
      const dt = now - ds.lastTime
      if (dt > 0) {
        ds.velocity = ((e.clientY - ds.lastY) / dt) * 1000
      }
      ds.lastY = e.clientY
      ds.lastTime = now

      let newTranslate = ds.startTranslate + deltaY
      newTranslate = Math.max(0, Math.min(full - peekHeight, newTranslate))
      y.set(newTranslate)
    }

    const onUp = () => {
      if (!ds.active) return

      ds.active = false

      const elapsed = performance.now() - ds.startTime
      const wasTap = ds.totalDistance < 8 && elapsed < 300

      if (wasTap) {
        cycleSnap()
        return
      }

      snapToNearest(ds.velocity, y.get())
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [full, peekHeight, y, snapToNearest, cycleSnap])

  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()

    const ds = dragState.current
    ds.active = true
    ds.startY = e.clientY
    ds.startTranslate = y.get()
    ds.velocity = 0
    ds.lastY = e.clientY
    ds.lastTime = performance.now()
    ds.startTime = performance.now()
    ds.totalDistance = 0
  }, [y])

  return (
    <motion.div
      ref={sheetRef}
      style={{
        y,
        height: full,
        willChange: 'transform',
      }}
      className={`absolute bottom-0 left-0 right-0 z-20 md:hidden select-none ${className}`}
    >
      <div className="bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border-t border-slate-200/60 overflow-hidden flex flex-col h-full" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <button
          onPointerDown={handlePointerDown}
          className="w-full flex justify-center pt-4 pb-3 shrink-0 cursor-pointer touch-manipulation"
          aria-label="Drag handle"
        >
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </button>

        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
