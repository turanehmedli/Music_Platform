import api from "./axios"
import type { Track } from "../types/track"

export const getTrendingTracks = async (): Promise<Track[]> => {
  const res = await api.get('/tracks/trending')
  return res.data.data
}

export const getPopTracks = async (): Promise<Track[]> => {
  const res = await api.get('/tracks/search?query=pop')
  return res.data.data
}

export const getRockTracks = async (): Promise<Track[]> => {
  const res = await api.get('/tracks/search?query=rock')
  return res.data.data
}

export const getFunkTracks = async (): Promise<Track[]> => {
  const res = await api.get('/tracks/search?query=funk')
  return res.data.data
}

export const searchTracks = async (query:string):Promise<Track[]>=>{
  const res = await api.get(`/tracks/search?query=${encodeURIComponent(query)}`)
  return res.data.data
}