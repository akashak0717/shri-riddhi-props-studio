import React from "react"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export function useCategories() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase) { setLoading(false); return }
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true })
      if (!error && active) setData(data || [])
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])
  return { data, loading }
}

export function useEvents(limit) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase) { setLoading(false); return }
      let query = supabase
        .from("events")
        .select("*, categories(name, slug)")
        .eq("published", true)
        .order("event_date", { ascending: false })
      if (limit) query = query.limit(limit)
      const { data, error } = await query
      if (!error && active) setData(data || [])
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [limit])
  return { data, loading }
}

export function useEvent(slug) {
  const [event, setEvent] = useState(null)
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase || !slug) { setLoading(false); return }
      const { data: e } = await supabase
        .from("events")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .eq("published", true)
        .single()

      if (!e) { if (active) setLoading(false); return }

      const { data: m } = await supabase
        .from("media")
        .select("*")
        .eq("event_id", e.id)
        .order("display_order", { ascending: true })

      if (active) {
        setEvent(e)
        setMedia(m || [])
        setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [slug])

  return { event, media, loading }
}
