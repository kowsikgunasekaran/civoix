import { create } from 'zustand'
import { REQUESTS } from '../data/requests'

let counter = 11

export const useRequestStore = create((set, get) => ({
  requests: [...REQUESTS],
  newRequest: null,

  addRequest(req) {
    const id = `REQ-${String(counter).padStart(3,'0')}`
    const refId = `A${4212 + counter}`
    counter++
    const full = { ...req, id, refId, status:'clustered', timestamp: new Date().toISOString() }
    set(s => ({ requests:[full, ...s.requests], newRequest:full }))
    return full
  },

  clearNew() { set({ newRequest:null }) },
}))
