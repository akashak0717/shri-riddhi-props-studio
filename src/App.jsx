import React from "react"
import { supabase } from "./lib/supabase"

import {
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom"

import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Sparkles
} from "lucide-react"

import { motion } from "framer-motion"

import Layout from "./components/Layout"
import SectionHeading from "./components/SectionHeading"
import CategoryCard from "./components/CategoryCard"
import EventCard from "./components/EventCard"
import MediaPlaceholder from "./components/MediaPlaceholder"
import Admin from "./components/Admin"

import {
  useCategories,
  useEvents,
  useEvent
} from "./hooks/useStudioData"

import {
  studio,
  whatsappUrl
} from "./config"


/* =====================================================
   DEMO CATEGORIES
===================================================== */

const demoCategories = [
  {
    id: "1",
    name: "Wedding",
    slug: "wedding",
    description:
      "The rituals, people and little moments that make the day yours."
  },
  {
    id: "2",
    name: "Pre-Wedding",
    slug: "pre-wedding",
    description:
      "Relaxed, romantic frames before the big celebration."
  },
  {
    id: "3",
    name: "Maternity",
    slug: "maternity",
    description:
      "A beautiful chapter, photographed with warmth."
  },
  {
    id: "4",
    name: "Kids",
    slug: "kids",
    description:
      "Playful personalities and memories that grow with them."
  },
  {
    id: "5",
    name: "Portraits",
    slug: "portraits",
    description:
      "Confident, natural portraits with character."
  },
  {
    id: "6",
    name: "Events",
    slug: "events",
    description:
      "The energy, people and atmosphere of your celebration."
  }
]


/* =====================================================
   BUTTON
===================================================== */

function Button({ to, children }) {
  return (
    <Link
      to={to}
      className="primary-btn"
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  )
}


/* =====================================================
   HOME
===================================================== */

function Home() {
  const { data: categories } = useCategories()
  const { data: events } = useEvents(6)

  const [siteSettings, setSiteSettings] = React.useState(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadSiteSettings() {
      if (!supabase) return

      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle()

      if (!cancelled && !error) {
        setSiteSettings(data || null)
      }
    }

    loadSiteSettings()

    return () => {
      cancelled = true
    }
  }, [])

  const cats =
    categories.length > 0
      ? categories
      : demoCategories

  return (
    <Layout>

      {/* HERO */}

      <section className="hero">

        <div className="hero-color-orb orb-one" />
        <div className="hero-color-orb orb-two" />

        <div className="hero-copy">

          <motion.div
            initial={{
              opacity: 0,
              y: 16
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6
            }}
          >

            <span className="eyebrow">

              <Sparkles size={14} />

              PHOTOGRAPHY · FILMS · STORIES

            </span>

          </motion.div>


          <motion.h1
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.7,
              delay: 0.08
            }}
          >

            Your moments.
            <br />

            <em>
              Beautifully remembered.
            </em>

          </motion.h1>


          <motion.p
            initial={{
              opacity: 0,
              y: 18
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.18
            }}
          >

            Wedding, pre-wedding, maternity,
            kids, portraits and events —
            captured with colour, emotion
            and a cinematic eye.

          </motion.p>


          <motion.div
            className="hero-actions"
            initial={{
              opacity: 0,
              y: 15
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.28
            }}
          >

            <Button to="/portfolio">
              Explore our work
            </Button>


            <a
              className="text-link"
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
            >

              Book a conversation

              <ArrowRight size={16} />

            </a>

          </motion.div>

        </div>


        {/* HERO IMAGE */}

        <motion.div
          className="hero-visual"

          initial={{
            opacity: 0,
            scale: 0.97
          }}

          animate={{
            opacity: 1,
            scale: 1
          }}

          transition={{
            duration: 0.8,
            delay: 0.1
          }}
        >

          <div className="hero-photo">

            {siteSettings?.hero_image ? (
              <div
                className="managed-home-image hero-managed-image"
                role="img"
                aria-label="Shri Riddhi Props Studio hero photograph"
                style={{ backgroundImage: `url("${siteSettings.hero_image}")` }}
              />
            ) : (
              <MediaPlaceholder
                label="Your hero photograph"
              />
            )}

          </div>


          <div className="hero-badge">

            <span>
              SR
            </span>

            <small>
              STORIES
              <br />
              WORTH
              <br />
              KEEPING
            </small>

          </div>


          <div className="hero-caption">

            <span>
              01
            </span>

            <span>
              SHRI RIDDHI PROPS STUDIO
            </span>

          </div>

        </motion.div>

      </section>


      {/* INTRO */}

      <section className="intro-strip">

        <span>
          01 — WHAT WE CAPTURE
        </span>

        <p>

          From intimate portraits to
          full-scale celebrations, every
          gallery is built around the people
          and emotions that make your story unique.

        </p>

      </section>


      {/* CATEGORIES */}

      <section className="section section-colorful">

        <SectionHeading
          eyebrow="OUR SERVICES"
          title="Choose your story."
          text="A visual collection made for every chapter worth celebrating."
        />


        <div className="category-grid">

          {cats.map((category, index) => (

            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />

          ))}

        </div>

      </section>


      {/* RECENT WORK */}

      <section className="section work-section">

        <SectionHeading
          eyebrow="RECENT WORK"
          title="Moments in motion."
          action={
            <Button to="/portfolio">
              View all work
            </Button>
          }
        />


        {events.length > 0 ? (

          <div className="event-grid">

            {events.map((event, index) => (

              <EventCard
                key={event.id}
                event={event}
                index={index}
              />

            ))}

          </div>

        ) : (

          <div className="empty-work">

            <MediaPlaceholder
              label="Your latest event galleries"
            />

            <p>

              Once you add events in Supabase,
              your latest work will appear here automatically.

            </p>

          </div>

        )}

      </section>


      {/* STATEMENT */}

      <section className="statement">

        <div className="statement-shape" />

        <span className="eyebrow">
          THE SRF APPROACH
        </span>


        <h2>

          Not just how it looked.
          <br />

          <em>
            How it felt.
          </em>

        </h2>


        <p>

          We keep things natural, expressive
          and personal — so years from now,
          your photographs still take you back
          to the moment.

        </p>

      </section>


      {/* CTA */}

      <section className="cta-section">

        <div>

          <span className="eyebrow">
            HAVE A STORY TO TELL?
          </span>

          <h2>

            Let's create something
            <br />

            <em>
              you'll keep forever.
            </em>

          </h2>

        </div>


        <Button to="/contact">
          Start an enquiry
        </Button>

      </section>

    </Layout>
  )
}


/* =====================================================
   PORTFOLIO
===================================================== */

function Portfolio() {

  const { data: categories } =
    useCategories()

  const { data: events } =
    useEvents()

  const cats =
    categories.length > 0
      ? categories
      : demoCategories


  return (
    <Layout>

      <section className="page-hero">

        <span className="eyebrow">
          PORTFOLIO
        </span>


        <h1>

          Work with
          <br />

          <em>
            feeling.
          </em>

        </h1>


        <p>

          Explore our photography and films
          across weddings, portraits,
          maternity, kids and celebrations.

        </p>

      </section>


      <section className="section section-colorful">

        <SectionHeading
          eyebrow="CATEGORIES"
          title="Find your chapter."
        />


        <div className="category-grid">

          {cats.map((category, index) => (

            <CategoryCard
              key={category.id}
              category={category}
              index={index}
            />

          ))}

        </div>

      </section>


      <section className="section">

        <SectionHeading
          eyebrow="EVENT GALLERIES"
          title="Real stories, real people."
        />


        {events.length > 0 ? (

          <div className="event-grid">

            {events.map((event, index) => (

              <EventCard
                key={event.id}
                event={event}
                index={index}
              />

            ))}

          </div>

        ) : (

          <div className="empty-work">

            <MediaPlaceholder
              label="Event galleries appear here"
            />

            <p>
              Publish your first event
              from the admin dashboard.
            </p>

          </div>

        )}

      </section>

    </Layout>
  )
}


/* =====================================================
   CATEGORY PAGE
===================================================== */

function CategoryPage() {

  const { slug } =
    useParams()

  const { data: events } =
    useEvents()


  const filteredEvents =
    events.filter(
      (event) =>
        event.categories?.slug === slug
    )


  const category =
    demoCategories.find(
      (item) =>
        item.slug === slug
    )


  const categoryName =
    category?.name ||
    slug?.replaceAll("-", " ")


  return (
    <Layout>

      <section className="page-hero category-page-hero">

        <span className="eyebrow">

          PORTFOLIO /
          {" "}
          {categoryName?.toUpperCase()}

        </span>


        <h1>

          {categoryName}

          <br />

          <em>
            stories.
          </em>

        </h1>


        <p>

          {category?.description ||
            "A collection of photographs and films from Shri Riddhi Props Studio."}

        </p>

      </section>


      <section className="section">

        {filteredEvents.length > 0 ? (

          <div className="event-grid">

            {filteredEvents.map(
              (event, index) => (

                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                />

              )
            )}

          </div>

        ) : (

          <div className="empty-work">

            <MediaPlaceholder
              label="Gallery coming soon"
            />

            <p>

              This category is ready
              for your next collection.

            </p>

          </div>

        )}

      </section>

    </Layout>
  )
}


/* =====================================================
   EVENT PAGE
===================================================== */

function EventPage() {

  const { slug } = useParams()

  const {
    event,
    media,
    loading
  } = useEvent(slug)

  /*
    Gallery order:
    - Horizontal media is always shown first.
    - Vertical media starts in a separate section.
    - Clicking any media opens the full-screen gallery viewer.
  */

  const [mediaOrientation, setMediaOrientation] =
    React.useState({})

  const [orientationReady, setOrientationReady] =
    React.useState(false)

  const [selectedMediaIndex, setSelectedMediaIndex] =
    React.useState(null)


  React.useEffect(() => {

    let cancelled = false

    async function detectOrientations() {

      if (!media || media.length === 0) {
        setMediaOrientation({})
        setOrientationReady(true)
        return
      }

      setOrientationReady(false)

      const detected = {}

      await Promise.all(
        media.map(
          (item) =>
            new Promise((resolve) => {

              if (item.type === "video") {

                const video =
                  document.createElement("video")

                video.preload = "metadata"

                video.onloadedmetadata = () => {

                  detected[item.id] =
                    video.videoWidth >= video.videoHeight
                      ? "horizontal"
                      : "vertical"

                  resolve()
                }

                video.onerror = () => {
                  detected[item.id] = "horizontal"
                  resolve()
                }

                video.src = item.file_url

                return
              }

              const image = new Image()

              image.onload = () => {

                detected[item.id] =
                  image.naturalWidth >= image.naturalHeight
                    ? "horizontal"
                    : "vertical"

                resolve()
              }

              image.onerror = () => {
                detected[item.id] = "horizontal"
                resolve()
              }

              image.src = item.file_url
            })
        )
      )

      if (cancelled) return

      setMediaOrientation(detected)
      setOrientationReady(true)
    }

    detectOrientations()

    return () => {
      cancelled = true
    }

  }, [media])


  const horizontalMedia =
    media.filter(
      (item) =>
        mediaOrientation[item.id] !== "vertical"
    )

  const verticalMedia =
    media.filter(
      (item) =>
        mediaOrientation[item.id] === "vertical"
    )


  function openViewer(item) {
    const index = media.findIndex(
      (mediaItem) => mediaItem.id === item.id
    )

    if (index !== -1) {
      setSelectedMediaIndex(index)
    }
  }


  function closeViewer() {
    setSelectedMediaIndex(null)
  }


  function showPrevious() {
    if (selectedMediaIndex === null || media.length === 0) return

    setSelectedMediaIndex(
      (selectedMediaIndex - 1 + media.length) % media.length
    )
  }


  function showNext() {
    if (selectedMediaIndex === null || media.length === 0) return

    setSelectedMediaIndex(
      (selectedMediaIndex + 1) % media.length
    )
  }


  React.useEffect(() => {

    if (selectedMediaIndex === null) return

    function handleKeyDown(event) {
      if (event.key === "Escape") closeViewer()
      if (event.key === "ArrowLeft") showPrevious()
      if (event.key === "ArrowRight") showNext()
    }

    document.addEventListener("keydown", handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }

  }, [selectedMediaIndex, media.length])


  function renderGalleryItem(item) {

    return (

      <motion.div
        key={item.id}
        className="gallery-item"
        style={{ WebkitTouchCallout: "none" }}
        initial={{
          opacity: 0,
          y: 12
        }}
        whileInView={{
          opacity: 1,
          y: 0
        }}
        viewport={{
          once: true
        }}
        transition={{
          duration: 0.35
        }}
        role="button"
        tabIndex={0}
        onClick={() => openViewer(item)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            openViewer(item)
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
        aria-label="Open image in gallery viewer"
      >

        {item.type === "video" ? (

          <video
            src={item.file_url}
            playsInline
            muted
            preload="metadata"
            draggable="false"
            onContextMenu={(event) => event.preventDefault()}
          />

        ) : (

          <div
            className="protected-gallery-image"
            role="img"
            aria-label={
              item.alt_text ||
              event?.title ||
              "Shri Riddhi Props Studio"
            }
            style={{ backgroundImage: `url("${item.file_url}")` }}
            onContextMenu={(event) => event.preventDefault()}
          />

        )}

      </motion.div>
    )
  }


  if (loading) {

    return (
      <Layout>

        <div className="loading-page">
          Loading gallery…
        </div>

      </Layout>
    )
  }


  const selectedMedia =
    selectedMediaIndex !== null
      ? media[selectedMediaIndex]
      : null


  return (
    <Layout>

      <section className="event-hero">

        <div>

          <span className="eyebrow">
            {event?.categories?.name ||
              "EVENT GALLERY"}
          </span>

          <h1>
            {event?.title ||
              "Gallery not found"}
            <br />
            <em>
              in frames.
            </em>
          </h1>

          <p>
            {event?.description ||
              "A collection by Shri Riddhi Props Studio."}
          </p>

        </div>

        {event?.cover_image ? (
          <img
            src={event.cover_image}
            alt={event.title}
            draggable="false"
            onContextMenu={(event) => event.preventDefault()}
          />
        ) : (
          <MediaPlaceholder
            label="Event cover"
          />
        )}

      </section>


      {media.length > 0 ? (

        <section className="gallery-groups">

          {orientationReady &&
            horizontalMedia.length > 0 && (

              <div className="gallery-grid gallery-horizontal-grid">
                {horizontalMedia.map(renderGalleryItem)}
              </div>
            )}

          {orientationReady &&
            verticalMedia.length > 0 && (

              <div className="gallery-grid gallery-vertical-grid">
                {verticalMedia.map(renderGalleryItem)}
              </div>
            )}

        </section>

      ) : (

        <section className="gallery-grid">

          <div className="empty-work gallery-empty">

            <MediaPlaceholder
              label="Photos and videos will appear here"
            />

            <p>
              Upload media for this event
              from the admin dashboard.
            </p>

          </div>

        </section>
      )}


      {selectedMedia && (

        <div
          className="gallery-lightbox"
          style={{ WebkitTouchCallout: "none" }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery viewer"
          onClick={closeViewer}
          onContextMenu={(event) => event.preventDefault()}
        >

          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={closeViewer}
            aria-label="Close gallery"
          >
            ×
          </button>

          <button
            type="button"
            className="gallery-lightbox-prev"
            onClick={(event) => {
              event.stopPropagation()
              showPrevious()
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >

            {selectedMedia.type === "video" ? (
              <video
                src={selectedMedia.file_url}
                autoPlay
                muted
                playsInline
                controls={false}
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                draggable="false"
                onContextMenu={(event) => event.preventDefault()}
              />
            ) : (
              <div
                className="protected-lightbox-image"
                role="img"
                aria-label={
                  selectedMedia.alt_text ||
                  event?.title ||
                  "Shri Riddhi Props Studio"
                }
                style={{ backgroundImage: `url("${selectedMedia.file_url}")` }}
                onContextMenu={(event) => event.preventDefault()}
              />
            )}

          </div>

          <button
            type="button"
            className="gallery-lightbox-next"
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
            aria-label="Next image"
          >
            ›
          </button>

          <div className="gallery-lightbox-count">
            {selectedMediaIndex + 1} / {media.length}
          </div>

        </div>
      )}

    </Layout>
  )
}


/* =====================================================
   ABOUT
===================================================== */

function About() {
  const [siteSettings, setSiteSettings] = React.useState(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadSiteSettings() {
      if (!supabase) return

      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle()

      if (!cancelled && !error) {
        setSiteSettings(data || null)
      }
    }

    loadSiteSettings()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Layout>

      <section className="page-hero">

        <span className="eyebrow">
          ABOUT SHRI RIDDHI PROPS STUDIO
        </span>


        <h1>

          People first.
          <br />

          <em>
            Always.
          </em>

        </h1>


        <p>

          We believe the best photographs
          aren't forced. They happen when
          people feel comfortable, present
          and completely themselves.

        </p>

      </section>


      <section className="about-grid section">

        <div className="about-art">

          <div
            className={`about-card card-a ${siteSettings?.about_image_1 ? "about-card-with-image" : ""}`}
            style={
              siteSettings?.about_image_1
                ? { backgroundImage: `url("${siteSettings.about_image_1}")` }
                : undefined
            }
          >
            {siteSettings?.about_image_1 && <span className="about-card-image-overlay" />}
            <span className="about-card-content">
              AUTHENTIC
              <br />
              <strong>EMOTION</strong>
            </span>
          </div>


          <div
            className={`about-card card-b ${siteSettings?.about_image_2 ? "about-card-with-image" : ""}`}
            style={
              siteSettings?.about_image_2
                ? { backgroundImage: `url("${siteSettings.about_image_2}")` }
                : undefined
            }
          >
            {siteSettings?.about_image_2 && <span className="about-card-image-overlay" />}
            <span className="about-card-content">
              COLOUR
              <br />
              <strong>& LIGHT</strong>
            </span>
          </div>


          <div
            className={`about-card card-c ${siteSettings?.about_image_3 ? "about-card-with-image" : ""}`}
            style={
              siteSettings?.about_image_3
                ? { backgroundImage: `url("${siteSettings.about_image_3}")` }
                : undefined
            }
          >
            {siteSettings?.about_image_3 && <span className="about-card-image-overlay" />}
            <span className="about-card-content">
              YOUR
              <br />
              <strong>STORY</strong>
            </span>
          </div>

        </div>


        <div className="about-copy">

          <span className="eyebrow">
            OUR PHILOSOPHY
          </span>


          <h2>

            Natural moments.
            <br />

            <em>
              Thoughtful frames.
            </em>

          </h2>


          <p>

            From a bride's quiet pause
            to a child's unstoppable energy,
            we look for the moments that
            feel like you — not a template.

          </p>


          <div className="check-list">

            <span>

              <CheckCircle2 />

              Candid and comfortable direction

            </span>


            <span>

              <CheckCircle2 />

              Rich colour and cinematic composition

            </span>


            <span>

              <CheckCircle2 />

              Photography and films under one studio

            </span>

          </div>

        </div>

      </section>

    </Layout>
  )
}


/* =====================================================
   CONTACT
===================================================== */

function Contact() {

  return (
    <Layout>

      <section className="contact-page">

        <div className="contact-intro">

          <span className="eyebrow">
            CONTACT
          </span>


          <h1>

            Let's make
            <br />

            <em>
              something lasting.
            </em>

          </h1>


          <p>

            Tell us what you're planning
            and we'll get back to you
            with the next steps.

          </p>


          <div className="contact-note">

            <Sparkles size={17} />

            <span>

              Wedding · Pre-Wedding ·
              Maternity · Kids · Portraits · Events

            </span>

          </div>

        </div>


        <div className="contact-links">

          {/* WHATSAPP */}

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
          >

            <MessageCircle />

            <div>

              <span>
                WHATSAPP
              </span>

              <strong>
                Start a conversation
              </strong>

            </div>

            <ArrowUpRight />

          </a>


          {/* INSTAGRAM */}

          <a
            href={studio.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >

            <Instagram />

            <div>

              <span>
                INSTAGRAM
              </span>

              <strong>
                @shri_riddhi_props_studio
              </strong>

            </div>

            <ArrowUpRight />

          </a>


          {/* PHONE */}

          <a
            href={`tel:${studio.phone.replace(
              /\s/g,
              ""
            )}`}
          >

            <Phone />

            <div>

              <span>
                CALL
              </span>

              <strong>
                {studio.phone}
              </strong>

            </div>

            <ArrowUpRight />

          </a>


          {/* EMAIL */}

          <a
            href={`mailto:${studio.email}`}
          >

            <Mail />

            <div>

              <span>
                EMAIL
              </span>

              <strong>
                {studio.email}
              </strong>

            </div>

            <ArrowUpRight />

          </a>

        </div>

      </section>

    </Layout>
  )
}


/* =====================================================
   APP
===================================================== */

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/portfolio"
        element={<Portfolio />}
      />

      <Route
        path="/portfolio/:slug"
        element={<CategoryPage />}
      />

      <Route
        path="/event/:slug"
        element={<EventPage />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/admin"
        element={<Admin />}
      />

    </Routes>
  )
}


/* =====================================================
   DEFAULT EXPORT
===================================================== */

export default App