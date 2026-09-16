import React, { useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import {
  Instagram,
  MessageCircle,
  MapPin,
  Menu,
  X
} from "lucide-react"

import { studio, whatsappUrl } from "../config"


export default function Layout({ children }) {

  const [open, setOpen] = useState(false)

  const location = useLocation()


  const nav = [
    {
      path: "/",
      label: "Home"
    },
    {
      path: "/portfolio",
      label: "Portfolio"
    },
    {
      path: "/about",
      label: "About"
    },
    {
      path: "/contact",
      label: "Contact"
    }
  ]


  return (
    <div className="site-shell">


      {/* =========================================
          NAVBAR
      ========================================== */}

      <header className="navbar">


        {/* =====================================
            LOGO
        ====================================== */}

        <Link
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
        >

          <span className="brand-mark">
            SR
          </span>

          <span>

            <strong>
              Shri Riddhi
            </strong>

            <small>
              Props Studio
            </small>

          </span>

        </Link>



        {/* =====================================
            DESKTOP NAVIGATION
        ====================================== */}

        <nav className="desktop-nav">

          {nav.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >

              {item.label}

            </NavLink>

          ))}

        </nav>



        {/* =====================================
            TOP RIGHT SOCIAL / CONTACT ICONS
        ====================================== */}

        <div className="nav-actions">


          {/* INSTAGRAM */}

          <a
            className="top-social-icon"
            href={studio.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >

            <Instagram size={18} />

          </a>



          {/* WHATSAPP */}

          <a
            className="top-social-icon"
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
          >

            <MessageCircle size={18} />

          </a>



          {/* LOCATION */}

          <a
            className="top-social-icon"
            href={studio.locationUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Studio Location"
            title="Studio Location"
          >

            <MapPin size={18} />

          </a>



          {/* MOBILE MENU */}

          <button
            type="button"
            className="icon-btn mobile-menu-btn"
            onClick={() => setOpen((value) => !value)}
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={open}
          >

            {open ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}

          </button>


        </div>

      </header>



      {/* =========================================
          MOBILE MENU
      ========================================== */}

      <AnimatePresence>

        {open && (

          <motion.div
            className="mobile-menu"

            initial={{
              opacity: 0,
              y: -15
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            exit={{
              opacity: 0,
              y: -15
            }}

            transition={{
              duration: 0.25
            }}
          >


            {/* MOBILE NAVIGATION */}

            {nav.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
              >

                {item.label}

              </NavLink>

            ))}



            {/* INSTAGRAM */}

            <a
              href={studio.instagramUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >

              <span>
                Instagram
              </span>

              <Instagram size={18} />

            </a>



            {/* WHATSAPP */}

            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >

              <span>
                WhatsApp
              </span>

              <MessageCircle size={18} />

            </a>



            {/* LOCATION */}

            <a
              href={studio.locationUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >

              <span>
                Studio Location
              </span>

              <MapPin size={18} />

            </a>


          </motion.div>

        )}

      </AnimatePresence>



      {/* =========================================
          PAGE CONTENT
      ========================================== */}

      <AnimatePresence mode="wait">

        <motion.main
          key={location.pathname}

          initial={{
            opacity: 0
          }}

          animate={{
            opacity: 1
          }}

          exit={{
            opacity: 0
          }}

          transition={{
            duration: 0.25
          }}
        >

          {children}

        </motion.main>

      </AnimatePresence>



      {/* =========================================
          FOOTER
      ========================================== */}

      <footer className="footer">

        <div className="footer-top">


          {/* FOOTER BRAND */}

          <div>

            <div className="brand footer-brand">

              <span className="brand-mark">
                SR
              </span>

              <span>

                <strong>
                  Shri Riddhi
                </strong>

                <small>
                  Props Studio
                </small>

              </span>

            </div>


            <p>
              Photography and films for the
              moments you never want to forget.
            </p>

          </div>



          {/* FOOTER LINKS */}

          <div className="footer-links">

            <Link to="/portfolio">
              Portfolio
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/contact">
              Contact
            </Link>

            <a
              href={studio.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

          </div>

        </div>



        {/* FOOTER BOTTOM */}

        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} Shri Vriddi Films
          </span>

          <span>
            {studio.location}
          </span>

        </div>

      </footer>

    </div>
  )
}