import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSongs, setPage, setSearch } from '../store/songsSlice'
import CardSong from '../components/CardSong'
import { FaSearch } from 'react-icons/fa'

const Home = () => {
  const dispatch = useDispatch()
  const { songs, loading, page, totalPages, search } = useSelector(state => state.songs)

  useEffect(() => {
    dispatch(fetchSongs({ page, search }))
  }, [dispatch, page, search])

  function handleSearch(e) {
    e.preventDefault()
    const searchValue = e.target.search.value
    dispatch(setSearch(searchValue))
  }

  return (
    <>
    <style>{`
    .gradient-btn {
            background: linear-gradient(135deg, #0b1a54ff 0%, #14077aff 100%);
            border: none;
            transition: all 0.3s ease;
          }
    `}
    </style>
    <div className="container py-5 min-vh-100 ">
      <div className="row mb-4 align-items-center justify-content-between">
        <div className="col"></div>
        <div className="col">
          <form onSubmit={handleSearch}>
            <div className="input-group rounded-pill overflow-hidden shadow-sm">
              <input
                type="text"
                name="search"
                className="form-control  border-0 px-4 py-2"
                placeholder="Search by title or artist..."
                defaultValue={search}
                style={{ borderRadius: 50 }}
              />
              <button
                className="btn gradient-btn text-white px-4 d-flex align-items-center gap-2 mx-3"
                type="submit"
                style={{ borderRadius: 50 }}
              >
                <FaSearch />
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="col"></div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-3 g-5 mt-2 mb-5">
            {songs.map(song => (
              <CardSong key={song.id} song={song} />
            ))}
          </div>
          <nav className="mt-4 d-flex justify-content-center">
            <ul className="pagination gap-2">
              {/* Tombol Prev */}
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link rounded-circle shadow-sm bg-white text-dark"
                  onClick={() => dispatch(setPage(page - 1))}
                  style={{ border: 'none' }}
                >
                  &laquo;
                </button>
              </li>

              {Array.from({ length: 3 }, (_, i) => {
                let start = Math.max(1, Math.min(page - 1, totalPages - 2));
                const pageNumber = start + i;

                if (pageNumber > totalPages) return null;

                return (
                  <li key={pageNumber} className={`page-item ${page === pageNumber ? 'active' : ''}`}>
                    <button
                      className={`page-link rounded-circle px-3 shadow-sm ${
                        page === pageNumber ? 'btn gradient-btn text-white' : 'bg-white text-dark'
                      }`}
                      onClick={() => dispatch(setPage(pageNumber))}
                      style={{ border: 'none' }}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              })}
              
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link rounded-circle shadow-sm bg-white text-dark"
                  onClick={() => dispatch(setPage(page + 1))}
                  style={{ border: 'none' }}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
    </>
  )
}

export default Home