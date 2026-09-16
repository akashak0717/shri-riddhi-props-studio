import React, { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "../lib/supabase"
import {
  CalendarDays,
  Check,
  Edit3,
  Eye,
  EyeOff,
  FileImage,
  FolderOpen,
  Image,
  LayoutDashboard,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react"

const MEDIA_BUCKET = "studio-media"

export default function Admin() {
  const [session, setSession] = useState(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [categories, setCategories] = useState([])
  const [events, setEvents] = useState([])
  const [media, setMedia] = useState([])

  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showMediaManager, setShowMediaManager] = useState(false)

  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)

  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventCategory, setEventCategory] = useState("")
  const [eventPublished, setEventPublished] = useState(true)

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [mediaFilter, setMediaFilter] = useState("all")
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true

    async function getSession() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Session error:", error)
        if (mounted) showError(error.message)
        return
      }

      if (mounted) setSession(data.session)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) setSession(currentSession)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (session) loadData()
  }, [session])

  function showSuccess(text) {
    setMessage(text)
    setMessageType("success")
  }

  function showError(text) {
    setMessage(text)
    setMessageType("error")
  }

  async function login(e) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) showError(error.message)
    else showSuccess("Logged in successfully.")

    setLoading(false)
  }

  async function logout() {
    setLoading(true)
    const { error } = await supabase.auth.signOut()

    if (error) showError(error.message)
    else {
      setSession(null)
      setCategories([])
      setEvents([])
      setMedia([])
      setMessage("")
    }

    setLoading(false)
  }

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Categories error:", error)
      showError(`Categories error: ${error.message}`)
      return []
    }

    setCategories(data || [])
    return data || []
  }

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        categories (
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Events error:", error)
      showError(`Events error: ${error.message}`)
      return []
    }

    setEvents(data || [])
    return data || []
  }

  async function loadMedia() {
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Media error:", error)
      showError(`Media error: ${error.message}`)
      return []
    }

    setMedia(data || [])
    return data || []
  }

  async function loadData() {
    if (!session) return

    setLoading(true)
    await Promise.all([loadCategories(), loadEvents(), loadMedia()])
    setLoading(false)
  }

  function createSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  function makeUniqueSlug(baseValue, existingItems, currentId = null) {
    const base = createSlug(baseValue) || `item-${Date.now()}`
    let slug = base
    let number = 2

    while (
      existingItems.some(
        (item) => item.slug === slug && item.id !== currentId
      )
    ) {
      slug = `${base}-${number}`
      number += 1
    }

    return slug
  }

  function openAddCategory() {
    setEditingCategory(null)
    setCategoryName("")
    setCategoryDescription("")
    setShowCategoryForm(true)
  }

  function openEditCategory(category) {
    setEditingCategory(category)
    setCategoryName(category.name || "")
    setCategoryDescription(category.description || "")
    setShowCategoryForm(true)
  }

  function closeCategoryForm() {
    setShowCategoryForm(false)
    setEditingCategory(null)
    setCategoryName("")
    setCategoryDescription("")
  }

  async function saveCategory(e) {
    e.preventDefault()

    if (!categoryName.trim()) {
      showError("Please enter a category name.")
      return
    }

    setLoading(true)
    const cleanName = categoryName.trim()
    const slug = makeUniqueSlug(cleanName, categories, editingCategory?.id)
    const description =
      categoryDescription.trim() || `${cleanName} photography and films`

    if (editingCategory) {
      const { error } = await supabase
        .from("categories")
        .update({ name: cleanName, slug, description })
        .eq("id", editingCategory.id)

      if (error) {
        console.error("Update category error:", error)
        showError(`Failed to update category: ${error.message}`)
        setLoading(false)
        return
      }

      showSuccess(`"${cleanName}" updated successfully.`)
    } else {
      const { error } = await supabase.from("categories").insert({
        name: cleanName,
        slug,
        description,
        display_order: categories.length,
      })

      if (error) {
        console.error("Add category error:", error)
        showError(`Failed to create category: ${error.message}`)
        setLoading(false)
        return
      }

      showSuccess(`"${cleanName}" category created successfully.`)
    }

    closeCategoryForm()
    await loadCategories()
    setLoading(false)
  }

  async function deleteCategory(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?\n\nEvents in this category will become uncategorised.`
    )
    if (!confirmed) return

    setLoading(true)
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id)

    if (error) {
      console.error("Delete category error:", error)
      showError(`Failed to delete category: ${error.message}`)
      setLoading(false)
      return
    }

    showSuccess(`"${category.name}" deleted successfully.`)
    await Promise.all([loadCategories(), loadEvents()])
    setLoading(false)
  }

  function openAddEvent() {
    if (categories.length === 0) {
      showError("Please create a category before creating an event.")
      return
    }

    setEventTitle("")
    setEventDescription("")
    setEventDate("")
    setEventCategory(categories[0].id)
    setEventPublished(true)
    setShowEventForm(true)
  }

  function closeEventForm() {
    setShowEventForm(false)
    setEventTitle("")
    setEventDescription("")
    setEventDate("")
    setEventCategory("")
    setEventPublished(true)
  }

  async function saveEvent(e) {
    e.preventDefault()

    if (!eventTitle.trim()) {
      showError("Please enter an event title.")
      return
    }

    if (!eventCategory) {
      showError("Please select a category.")
      return
    }

    setLoading(true)
    const cleanTitle = eventTitle.trim()
    const slug = makeUniqueSlug(cleanTitle, events)

    const { error } = await supabase.from("events").insert({
      title: cleanTitle,
      slug,
      category_id: eventCategory,
      description: eventDescription.trim() || null,
      event_date: eventDate || null,
      published: eventPublished,
    })

    if (error) {
      console.error("Add event error:", error)
      showError(`Failed to create event: ${error.message}`)
      setLoading(false)
      return
    }

    showSuccess(`"${cleanTitle}" event created successfully.`)
    closeEventForm()
    await loadEvents()
    setLoading(false)
  }

  async function deleteEvent(event) {
    const confirmed = window.confirm(
      `Delete "${event.title}"?\n\nThis will delete its media database records too. Uploaded files will also be removed when possible.`
    )
    if (!confirmed) return

    setLoading(true)

    const eventMedia = media.filter((item) => item.event_id === event.id)

    if (eventMedia.length > 0) {
      const paths = eventMedia.map((item) => item.file_path).filter(Boolean)
      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .remove(paths)

        if (storageError) {
          console.error("Storage delete error:", storageError)
          showError(`Could not remove event files: ${storageError.message}`)
          setLoading(false)
          return
        }
      }
    }

    const { error } = await supabase.from("events").delete().eq("id", event.id)

    if (error) {
      console.error("Delete event error:", error)
      showError(`Failed to delete event: ${error.message}`)
      setLoading(false)
      return
    }

    showSuccess(`"${event.title}" deleted successfully.`)
    setSelectedEvent((current) => (current?.id === event.id ? null : current))
    await Promise.all([loadEvents(), loadMedia()])
    setLoading(false)
  }

  async function toggleEventPublished(event) {
    setLoading(true)

    const { error } = await supabase
      .from("events")
      .update({ published: !event.published })
      .eq("id", event.id)

    if (error) {
      console.error("Publish update error:", error)
      showError(`Failed to update event: ${error.message}`)
      setLoading(false)
      return
    }

    showSuccess(
      `"${event.title}" is now ${!event.published ? "published" : "hidden"}.`
    )
    await loadEvents()
    setLoading(false)
  }

  function openMediaManager(event) {
    setSelectedEvent(event)
    setSelectedFiles([])
    setMediaFilter("all")
    setShowMediaManager(true)
  }

  function closeMediaManager() {
    if (uploading) return
    setShowMediaManager(false)
    setSelectedEvent(null)
    setSelectedFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleFileSelection(event) {
    const files = Array.from(event.target.files || [])
    addSelectedFiles(files)
  }

  function addSelectedFiles(files) {
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")
      return isImage || isVideo
    })

    const maxSize = 100 * 1024 * 1024
    const oversized = validFiles.filter((file) => file.size > maxSize)

    if (oversized.length > 0) {
      showError("Each photo or video must be 100 MB or smaller.")
    }

    const accepted = validFiles.filter((file) => file.size <= maxSize)
    if (accepted.length === 0) return

    setSelectedFiles((current) => {
      const existingKeys = new Set(
        current.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
      )

      const newFiles = accepted.filter(
        (file) =>
          !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`)
      )

      return [...current, ...newFiles]
    })
  }

  function removeSelectedFile(index) {
    setSelectedFiles((current) => current.filter((_, i) => i !== index))
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B"
    const units = ["B", "KB", "MB", "GB"]
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    )
    return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
  }

  function safeFileName(name) {
    const extension = name.includes(".") ? `.${name.split(".").pop()}` : ""
    const base = name
      .replace(/\.[^/.]+$/, "")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 70)

    return `${base || "media"}${extension.toLowerCase()}`
  }

  function uniqueId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  async function uploadMedia() {
    if (!selectedEvent) {
      showError("Please select an event.")
      return
    }

    if (selectedFiles.length === 0) {
      showError("Please choose at least one photo or video.")
      return
    }

    setUploading(true)
    setMessage("")

    const uploadedRows = []
    const failedFiles = []

    for (const file of selectedFiles) {
      const type = file.type.startsWith("video/") ? "video" : "image"
      const filePath = `${selectedEvent.slug}/${uniqueId()}-${safeFileName(file.name)}`

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        failedFiles.push(`${file.name}: ${uploadError.message}`)
        continue
      }

      const { data: publicData } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(filePath)

      const fileUrl = publicData?.publicUrl

      if (!fileUrl) {
        failedFiles.push(`${file.name}: Could not create public URL.`)
        await supabase.storage.from(MEDIA_BUCKET).remove([filePath])
        continue
      }

      const { data: insertedMedia, error: mediaError } = await supabase
        .from("media")
        .insert({
          event_id: selectedEvent.id,
          type,
          file_url: fileUrl,
          file_path: filePath,
          alt_text: `${selectedEvent.title} ${type}`,
          display_order: media.filter((item) => item.event_id === selectedEvent.id)
            .length + uploadedRows.length,
        })
        .select()
        .single()

      if (mediaError) {
        console.error("Media record error:", mediaError)
        failedFiles.push(`${file.name}: ${mediaError.message}`)
        await supabase.storage.from(MEDIA_BUCKET).remove([filePath])
        continue
      }

      uploadedRows.push(insertedMedia)
    }

    if (uploadedRows.length > 0) {
      const firstImage = uploadedRows.find((item) => item.type === "image")

      if (firstImage) {
        if (!selectedEvent.cover_image) {
          const { error: coverError } = await supabase
            .from("events")
            .update({ cover_image: firstImage.file_url })
            .eq("id", selectedEvent.id)

          if (coverError) {
            console.error("Event cover image update error:", coverError)
          }
        }

        const selectedCategoryId = selectedEvent.category_id
        const selectedCategory = categories.find(
          (category) => category.id === selectedCategoryId
        )

        if (selectedCategory && !selectedCategory.cover_image) {
          const { error: categoryCoverError } = await supabase
            .from("categories")
            .update({ cover_image: firstImage.file_url })
            .eq("id", selectedCategory.id)

          if (categoryCoverError) {
            console.error(
              "Category cover image update error:",
              categoryCoverError
            )
          }
        }
      }
    }

    await Promise.all([loadMedia(), loadEvents()])

    if (failedFiles.length === 0) {
      showSuccess(
        `${uploadedRows.length} file${uploadedRows.length === 1 ? "" : "s"} uploaded successfully.`
      )
    } else if (uploadedRows.length > 0) {
      showError(
        `${uploadedRows.length} uploaded, ${failedFiles.length} failed. ${failedFiles[0]}`
      )
    } else {
      showError(`Upload failed. ${failedFiles[0] || "Please try again."}`)
    }

    setSelectedFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ""
    setUploading(false)
  }

  const selectedEventMedia = useMemo(() => {
    if (!selectedEvent) return []

    return media
      .filter((item) => {
        if (item.event_id !== selectedEvent.id) return false
        if (mediaFilter === "all") return true
        return item.type === mediaFilter
      })
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  }, [media, selectedEvent, mediaFilter])

  async function deleteMedia(item) {
    const confirmed = window.confirm("Delete this file permanently?")
    if (!confirmed) return

    setLoading(true)

    if (item.file_path) {
      const { error: storageError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .remove([item.file_path])

      if (storageError) {
        console.error("Delete storage file error:", storageError)
        showError(`Could not delete file: ${storageError.message}`)
        setLoading(false)
        return
      }
    }

    const { error } = await supabase.from("media").delete().eq("id", item.id)

    if (error) {
      console.error("Delete media record error:", error)
      showError(`Could not delete media record: ${error.message}`)
      setLoading(false)
      return
    }

    if (item.type === "image") {
      const currentEvent = events.find((event) => event.id === item.event_id)

      if (currentEvent?.cover_image === item.file_url) {
        const replacement = media
          .filter(
            (mediaItem) =>
              mediaItem.event_id === item.event_id &&
              mediaItem.id !== item.id &&
              mediaItem.type === "image"
          )
          .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0]

        await supabase
          .from("events")
          .update({ cover_image: replacement?.file_url || null })
          .eq("id", item.event_id)
      }
    }

    showSuccess("Media deleted successfully.")
    await Promise.all([loadMedia(), loadEvents()])
    setLoading(false)
  }

  const photoCount = media.filter((item) => item.type === "image").length
  const videoCount = media.filter((item) => item.type === "video").length

  if (!supabase) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <h1>Supabase setup required</h1>
          <p>Check your Supabase environment variables.</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="admin-page">
        <form className="admin-card login-card" onSubmit={login}>
          <div className="admin-logo">
            <LayoutDashboard size={20} />
          </div>

          <span className="eyebrow">SHRI RIDDHI PROPS STUDIO</span>
          <h1>Welcome back.</h1>
          <p>Manage your photography portfolio, events and media from one place.</p>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="primary-btn" type="submit" disabled={loading}>
            <LogIn size={17} />
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {message && (
            <small className={messageType === "error" ? "form-message error" : "form-message"}>
              {message}
            </small>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <span className="eyebrow">SHRI RIDDHI PROPS STUDIO</span>
          <h1>Dashboard</h1>
          <p className="admin-welcome">Manage your studio content.</p>
        </div>

        <div className="admin-header-actions">
          <button className="ghost-btn" onClick={loadData} disabled={loading || uploading}>
            <RefreshCw size={16} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
          <button className="ghost-btn" onClick={logout} disabled={loading || uploading}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className={messageType === "error" ? "notice error" : "notice"}>
          {message}
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-icon"><FolderOpen size={20} /></div>
          <div><span>CATEGORIES</span><strong>{categories.length}</strong></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon"><CalendarDays size={20} /></div>
          <div><span>EVENTS</span><strong>{events.length}</strong></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon"><Image size={20} /></div>
          <div><span>PHOTOS</span><strong>{photoCount}</strong></div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon"><Video size={20} /></div>
          <div><span>VIDEOS</span><strong>{videoCount}</strong></div>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <span className="eyebrow">PORTFOLIO</span>
              <h2>Categories</h2>
            </div>
            <button className="small-btn" onClick={openAddCategory} disabled={loading || uploading}>
              <Plus size={15} /> Add
            </button>
          </div>

          <div className="admin-list">
            {categories.length === 0 && (
              <div className="empty-state">
                <FolderOpen size={25} />
                <strong>No categories yet</strong>
                <span>Add your first photography category.</span>
              </div>
            )}

            {categories.map((category) => (
              <div className="admin-row" key={category.id}>
                <div className="admin-row-info">
                  <strong>{category.name}</strong>
                  <small>/{category.slug}</small>
                </div>
                <div className="row-actions">
                  <button
                    className="icon-action"
                    onClick={() => openEditCategory(category)}
                    title="Edit category"
                    disabled={loading || uploading}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteCategory(category)}
                    title="Delete category"
                    disabled={loading || uploading}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-section-head">
            <div>
              <span className="eyebrow">CONTENT</span>
              <h2>Events</h2>
            </div>
            <button className="small-btn" onClick={openAddEvent} disabled={loading || uploading}>
              <Plus size={15} /> Add
            </button>
          </div>

          <div className="admin-list">
            {events.length === 0 && (
              <div className="empty-state">
                <CalendarDays size={25} />
                <strong>No events yet</strong>
                <span>Create an event, then upload its photos and videos.</span>
              </div>
            )}

            {events.map((event) => {
              const count = media.filter((item) => item.event_id === event.id).length

              return (
                <div className="admin-row event-admin-row" key={event.id}>
                  <div className="admin-row-info">
                    <strong>{event.title}</strong>
                    <small>
                      {event.categories?.name || "Uncategorised"}
                      {event.event_date ? ` • ${event.event_date}` : ""}
                      {` • ${count} media`}
                    </small>
                  </div>

                  <div className="row-actions">
                    <button
                      className="icon-action event-upload-action"
                      onClick={() => openMediaManager(event)}
                      title="Upload photos and videos"
                      disabled={loading || uploading}
                    >
                      <Upload size={15} />
                      <span>Upload</span>
                    </button>
                    <button
                      className="icon-action"
                      onClick={() => toggleEventPublished(event)}
                      title={event.published ? "Hide event" : "Publish event"}
                      disabled={loading || uploading}
                    >
                      {event.published ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteEvent(event)}
                      title="Delete event"
                      disabled={loading || uploading}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <div className="admin-upload-hint">
        <div className="admin-upload-hint-icon">
          <Upload size={20} />
        </div>
        <div className="admin-upload-hint-copy">
          <strong>Photo & Video Management</strong>
          <p>
            Upload photos or videos to an event. Click the Upload button beside an event to choose exactly where the files should go.
          </p>
        </div>
        <button
          type="button"
          className="small-btn upload-hint-btn"
          onClick={() => {
            if (events.length > 0) {
              openMediaManager(events[0])
            } else {
              showError("Create an event first, then you can upload photos and videos.")
            }
          }}
          disabled={loading || uploading || events.length === 0}
        >
          <Upload size={15} />
          {events.length > 0 ? "Upload Media" : "Create Event First"}
        </button>
      </div>

      {showCategoryForm && (
        <div className="admin-modal-overlay" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Category form">
            <div className="admin-modal-header">
              <div>
                <span className="eyebrow">PORTFOLIO</span>
                <h2>{editingCategory ? "Edit Category" : "Add Category"}</h2>
              </div>
              <button className="icon-action" onClick={closeCategoryForm} type="button" disabled={loading}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveCategory}>
              <label>
                Category Name
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Example: Wedding"
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Wedding photography and films"
                  rows="4"
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={closeCategoryForm} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={loading}>
                  <Check size={17} />
                  {loading ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventForm && (
        <div className="admin-modal-overlay" role="presentation">
          <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Event form">
            <div className="admin-modal-header">
              <div>
                <span className="eyebrow">CONTENT</span>
                <h2>Add Event</h2>
              </div>
              <button className="icon-action" onClick={closeEventForm} type="button" disabled={loading}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveEvent}>
              <label>
                Event Title
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Example: Rahul & Priya Wedding"
                  required
                />
              </label>

              <label>
                Category
                <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} required>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Event Date
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </label>

              <label>
                Description
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Describe this event..."
                  rows="4"
                />
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={eventPublished}
                  onChange={(e) => setEventPublished(e.target.checked)}
                />
                <span>Publish this event</span>
              </label>

              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={closeEventForm} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={loading}>
                  <Check size={17} />
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMediaManager && selectedEvent && (
        <div className="admin-modal-overlay media-modal-overlay" role="presentation">
          <div className="admin-modal media-manager-modal" role="dialog" aria-modal="true" aria-label="Media manager">
            <div className="admin-modal-header">
              <div>
                <span className="eyebrow">MEDIA MANAGER</span>
                <h2>{selectedEvent.title}</h2>
                <p className="media-manager-subtitle">
                  Upload photos and videos for this event. Supported files are stored in <strong>{MEDIA_BUCKET}</strong>.
                </p>
              </div>
              <button className="icon-action" onClick={closeMediaManager} type="button" disabled={uploading}>
                <X size={18} />
              </button>
            </div>

            <div
              className="upload-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                addSelectedFiles(Array.from(e.dataTransfer.files || []))
              }}
            >
              <div className="upload-dropzone-icon">
                <Upload size={22} />
              </div>
              <strong>Choose photos or videos</strong>
              <span>Multiple files supported • Maximum 100 MB per file</span>
              <button
                type="button"
                className="small-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <FileImage size={15} /> Choose Files
              </button>
              <input
                ref={fileInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelection}
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="selected-files">
                <div className="media-panel-head">
                  <div>
                    <strong>{selectedFiles.length} file{selectedFiles.length === 1 ? "" : "s"} ready</strong>
                    <span>These files have not been uploaded yet.</span>
                  </div>
                  <button
                    type="button"
                    className="primary-btn upload-now-btn"
                    onClick={uploadMedia}
                    disabled={uploading}
                  >
                    <Upload size={16} />
                    {uploading ? "Uploading..." : "Upload Media"}
                  </button>
                </div>

                <div className="selected-file-list">
                  {selectedFiles.map((file, index) => (
                    <div className="selected-file-row" key={`${file.name}-${file.lastModified}-${index}`}>
                      <div className="selected-file-icon">
                        {file.type.startsWith("video/") ? <Video size={17} /> : <Image size={17} />}
                      </div>
                      <div className="selected-file-info">
                        <strong>{file.name}</strong>
                        <small>{formatBytes(file.size)}</small>
                      </div>
                      <button
                        type="button"
                        className="icon-action"
                        onClick={() => removeSelectedFile(index)}
                        disabled={uploading}
                        title="Remove from selection"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="media-library">
              <div className="media-panel-head">
                <div>
                  <strong>Uploaded media</strong>
                  <span>{selectedEventMedia.length} shown for this event</span>
                </div>
                <div className="media-filter-buttons">
                  <button
                    type="button"
                    className={mediaFilter === "all" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setMediaFilter("all")}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={mediaFilter === "image" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setMediaFilter("image")}
                  >
                    Photos
                  </button>
                  <button
                    type="button"
                    className={mediaFilter === "video" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setMediaFilter("video")}
                  >
                    Videos
                  </button>
                </div>
              </div>

              {selectedEventMedia.length === 0 ? (
                <div className="media-library-empty">
                  <Image size={28} />
                  <strong>No media uploaded yet</strong>
                  <span>Choose files above to add the first photos or videos.</span>
                </div>
              ) : (
                <div className="media-admin-grid">
                  {selectedEventMedia.map((item) => (
                    <div className="media-admin-item" key={item.id}>
                      {item.type === "video" ? (
                        <video src={item.file_url} controls preload="metadata" />
                      ) : (
                        <img src={item.file_url} alt={item.alt_text || selectedEvent.title} />
                      )}
                      <div className="media-admin-item-footer">
                        <span>{item.type === "video" ? "VIDEO" : "PHOTO"}</span>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteMedia(item)}
                          disabled={loading || uploading}
                          title="Delete media"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}