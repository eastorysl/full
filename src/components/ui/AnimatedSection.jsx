import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'

export default function AnimatedSection({ children, className = '', variants = null, delay = 0, style = {} }) {
  const [ref, isInView] = useInView()

  const defaultVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants || defaultVariants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
