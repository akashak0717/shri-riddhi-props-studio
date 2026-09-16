import React from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import MediaPlaceholder from "./MediaPlaceholder"

export default function CategoryCard({ category, index=0 }) {
  return (
    <motion.div
      className={`category-card category-${index % 4}`}
      initial={{opacity:0, y:24}}
      whileInView={{opacity:1, y:0}}
      viewport={{once:true, margin:"-40px"}}
      transition={{duration:.5, delay:index*.05}}
    >
      <Link to={`/portfolio/${category.slug}`}>
        {category.cover_image ? (
          <img src={category.cover_image} alt={category.name}/>
        ) : <MediaPlaceholder label={category.name}/>}
        <div className="category-overlay">
          <span>0{index+1}</span>
          <div>
            <h3>{category.name}</h3>
            <p>{category.description || "Stories captured with intention."}</p>
          </div>
          <ArrowUpRight/>
        </div>
      </Link>
    </motion.div>
  )
}
