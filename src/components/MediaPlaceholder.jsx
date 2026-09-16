import React from "react"
import { Image as ImageIcon } from "lucide-react"

export default function MediaPlaceholder({
  label = "Your photograph"
}) {
  return (
    <div className="media-placeholder">

      <div className="placeholder-glow" />

      <ImageIcon size={28} />

      <span>
        {label}
      </span>

      <small>
        Upload your image from the admin dashboard
      </small>

    </div>
  )
}