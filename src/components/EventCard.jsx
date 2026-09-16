import React from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, CalendarDays } from "lucide-react"
import { motion } from "framer-motion"
import MediaPlaceholder from "./MediaPlaceholder"

export default function EventCard({ event, index=0 }) {
  return (
    <motion.article
      className="event-card"
      initial={{opacity:0, y:20}}
      whileInView={{opacity:1, y:0}}
      viewport={{once:true, margin:"-30px"}}
      transition={{duration:.45, delay:index*.04}}
    >
      <Link to={`/event/${event.slug}`}>
        <div className="event-image">
          {event.cover_image ? <img src={event.cover_image} alt={event.title}/> : <MediaPlaceholder label={event.title}/>}
          <span className="event-arrow"><ArrowUpRight size={19}/></span>
        </div>
        <div className="event-meta">
          <span>{event.categories?.name || "Photography"}</span>
          {event.event_date && <span><CalendarDays size={13}/> {event.event_date}</span>}
        </div>
        <h3>{event.title}</h3>
      </Link>
    </motion.article>
  )
}
