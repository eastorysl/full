import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiArrowLeft, FiSearch, FiExternalLink } from 'react-icons/fi'
import { handleImgError } from '../../utils/fallback'

export default function GalleryGrid({ images, initialItem, showAllLink }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  const scopedImages = useMemo(() => {
    if (!images) return []
    if (!initialItem) return images
    return images.filter((img) => img.itemId === initialItem)
  }, [images, initialItem])

  const filtered = useMemo(() => {
    if (!search.trim()) return scopedImages
    const q = search.toLowerCase()
    return scopedImages.filter((img) =>
      (img.alt || '').toLowerCase().includes(q) ||
      (img.category || '').toLowerCase().includes(q) ||
      (img.location && img.location.toLowerCase().includes(q))
    )
  }, [scopedImages, search])

  const currentIndex = useMemo(() => {
    if (!selectedImage) return -1
    return filtered.findIndex((img) => img.id === selectedImage.id)
  }, [filtered, selectedImage])

  useEffect(() => {
    if (selectedImage && currentIndex === -1) {
      setSelectedImage(null)
    }
  }, [selectedImage, currentIndex])

  useEffect(() => {
    if (!selectedImage) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKeyDown(e) {
      if (e.key === 'ArrowLeft' && currentIndex > 0) setSelectedImage(filtered[currentIndex - 1])
      else if (e.key === 'ArrowRight' && currentIndex < filtered.length - 1) setSelectedImage(filtered[currentIndex + 1])
      else if (e.key === 'Escape') setSelectedImage(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [selectedImage, currentIndex, filtered])

  function handlePrev() {
    if (currentIndex > 0) setSelectedImage(filtered[currentIndex - 1])
  }

  function handleNext() {
    if (currentIndex < filtered.length - 1) setSelectedImage(filtered[currentIndex + 1])
  }

  return (
    <>
      {showAllLink && (
        <div className="mb-6 w-full">
          <Link
            to="/gallery"
            className="flex items-center gap-3 w-full px-5 py-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-semibold hover:bg-teal-100 transition-all"
          >
            <FiArrowLeft className="shrink-0" />
            <span>Showing photos for {scopedImages[0]?.alt || 'this place'} — <span className="underline">click here</span> to browse all photos</span>
          </Link>
        </div>
      )}

      {!showAllLink && (
        <div className="relative mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, or location..."
            aria-label="Search gallery photos"
            className="w-full pl-12 pr-4 py-3.5 min-h-[44px] rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 italic outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {filtered.map((image, i) => (
          <motion.button
            key={image.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
            onClick={() => setSelectedImage(image)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              onError={handleImgError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-sm font-medium text-left leading-tight">{image.alt}</p>
              {image.location && (
                <p className="text-white/70 text-xs text-left mt-0.5 flex items-center gap-1">
                  <FiMapPin className="text-teal-400" />
                  {image.location}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-2">No photos found</p>
          <p className="text-slate-400 text-sm">Try a different search term</p>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <FiX className="text-xl" />
            </button>

            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev() }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              >
                <FiChevronLeft className="text-xl" />
              </button>
            )}
            {currentIndex < filtered.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNext() }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              >
                <FiChevronRight className="text-xl" />
              </button>
            )}

            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                loading="eager"
                onError={handleImgError}
                onClick={() => { if (selectedImage.page) navigate('/' + selectedImage.page + '/' + encodeURIComponent(selectedImage.dataCategory || selectedImage.category) + '/' + selectedImage.itemId) }}
                className="w-full max-h-[80vh] object-contain rounded-2xl cursor-pointer"
              />
              <div className="text-center mt-4">
                <p className="text-white text-lg font-medium inline">
                  {selectedImage.alt}
                  {selectedImage.page && (
                    <button
                      onClick={() => navigate('/' + selectedImage.page + '/' + (selectedImage.dataCategory || selectedImage.category) + '/' + selectedImage.itemId)}
                      className="text-teal-400 hover:text-teal-300 text-sm font-semibold ml-2 underline underline-offset-2 italic transition-colors inline-flex items-center gap-1"
                    >
                      View Page <FiExternalLink className="text-xs" />
                    </button>
                  )}
                </p>
                {selectedImage.location && (
                  <p className="text-white/60 text-sm mt-1">{selectedImage.location}</p>
                )}
                <p className="text-white/40 text-xs mt-1">{currentIndex + 1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
