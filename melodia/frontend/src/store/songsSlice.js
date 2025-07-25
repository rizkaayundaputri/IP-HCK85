import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import http from '../lib/http'

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async ({ page, search }, { rejectWithValue }) => {
    try {
      const res = await http.get(`/songs?page=${page}&search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      return res.data
    } catch (err) {
      return rejectWithValue({ songs: [], totalPages: 1 })
    }
  }
)

const songsSlice = createSlice({
  name: 'songs',
  initialState: {
    songs: [],
    loading: false,
    page: 1,
    totalPages: 1,
    search: '',
    error: null
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload
    },
    setSearch: (state, action) => {
      state.search = action.payload
      state.page = 1 
    },
    resetSongs: (state) => {
      state.songs = []
      state.page = 1
      state.totalPages = 1
      state.search = ''
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false
        state.songs = action.payload.songs
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false
        state.songs = []
        state.totalPages = 1
        state.error = action.payload
      })
  }
})

export const { setPage, setSearch, resetSongs } = songsSlice.actions
export default songsSlice.reducer