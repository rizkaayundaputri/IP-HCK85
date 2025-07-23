import React, { useEffect, useState } from 'react'
import http from '../lib/http'
import CardSong from '../components/CardSong'

const Home = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    http.get(`/songs?page=${page}&search=${encodeURIComponent(search)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => {
        setSongs(res.data.songs)
        setTotalPages(res.data.totalPages)
      })
      .catch(() => setSongs([]))
      .finally(() => setLoading(false))
  }, [page, search])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    setSearch(e.target.search.value)
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold text-primary">Song Collection</h1>
      <form className="mb-4" onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Search by title or artist..."
            defaultValue={search}
          />
          <button className="btn btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </form>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-4 g-5 mt-2 mb-5">
            {songs.map(song => (
                <CardSong key={song.id} song={song} />
            ))}
          </div>
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}

export default Home