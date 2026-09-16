import React from "react"
import { motion } from "framer-motion"

export default function SectionHeading({ eyebrow, title, text, action }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <motion.h2
          initial={{opacity:0, y:18}}
          whileInView={{opacity:1, y:0}}
          viewport={{once:true, margin:"-60px"}}
        >{title}</motion.h2>
      </div>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}
