import React from 'react'
import { Button } from '@/components/ui/button'
import { Navigation } from 'lucide-react'

function buildWazeUrl({ address, latitude, longitude }) {
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
  }
  if (address && address.trim().length > 0) {
    return `https://waze.com/ul?q=${encodeURIComponent(address.trim())}&navigate=yes`
  }
  return null
}

export function WazeButton({
  address,
  latitude,
  longitude,
  size = 'sm',
  variant = 'outline',
  className = '',
  label = 'פתח ב‑Waze',
}) {
  const wazeUrl = buildWazeUrl({ address, latitude, longitude })

  const handleOpenWaze = () => {
    if (!wazeUrl) return
    window.open(wazeUrl, '_blank', 'noopener,noreferrer')
  }

  if (!wazeUrl) {
    return null
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`inline-flex items-center gap-2 ${className}`}
      onClick={handleOpenWaze}
    >
      <Navigation className="w-4 h-4" />
      {label}
    </Button>
  )
}

export default WazeButton


