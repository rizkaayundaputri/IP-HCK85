import React, { useEffect, useState } from 'react'
import http from '../lib/http'
import { FaTrash, FaPlus, FaEdit, FaSave, FaMusic } from 'react-icons/fa'

const MyPlaylist = () => {
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(true)
  const [playlistName, setPlaylistName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalSongs, setModalSongs] = useState([])
  const [modalPlaylistName, setModalPlaylistName] = useState('')

  useEffect(() => {
    setLoading(true)
    http.get('/playlists', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => setPlaylist(res.data))
      .catch(() => setPlaylist([]))
      .finally(() => setLoading(false))
  }, [])

  function handleDelete(id) {
    http.delete(`/playlists/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(() => setPlaylist(playlist.filter(item => item.id !== id)))
  }

  function handleCreatePlaylist(e) {
    e.preventDefault()
    if (!playlistName) return alert('Please enter playlist name')
    http.post('/playlists', { name: playlistName }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(() => {
        setPlaylistName('')
        return http.get('/playlists', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
      })
      .then(res => setPlaylist(res.data))
  }

  function handleEdit(id, name) {
    setEditId(id)
    setEditName(name)
  }

  function handleSaveEdit(id) {
    if (!editName) return alert('Please enter new name')
    http.put(`/playlists/${id}`, { name: editName }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(() => {
        setEditId(null)
        setEditName('')
        return http.get('/playlists', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
      })
      .then(res => setPlaylist(res.data))
  }

  // MODAL: Read Playlist
  async function handleReadPlaylist(playlistId, playlistName) {
    try {
    
      const res = await http.get(`/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      setModalSongs(res.data.songs || [])
      setModalPlaylistName(playlistName)
      setShowModal(true)
    } catch {
      setModalSongs([])
      setModalPlaylistName(playlistName)
      setShowModal(true)
    }
  }

  return (

    <>  
    <style>{`
      .gradient-btn {
        background: linear-gradient(135deg, #041143ff 0%, #251980ff 100%);
        border: none;
        transition: all 0.3s ease;
      }
    `}</style>

    <div className="container py-5 vh-100">
      <div className="row align-items-center mb-4 px-2 px-md-0" >
        <div className="col"></div>
        <div className="col">
          <form onSubmit={handleCreatePlaylist}>
            <div className="d-flex gap-2 rounded-pill overflow-hidden shadow-sm">
              <input
                type="text"
                className="form-control border-0 px-4 py-2"
                placeholder="Enter Playlist Name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                style={{ fontSize: "0.9rem", borderRadius: 50 }}
              />
              <button
                type="submit"
                className="btn gradient-btn text-white px-4 d-flex align-items-center gap-2"
                style={{ fontSize: "0.9rem", borderRadius: 50 }}
              >
                <FaPlus /> Create
              </button>
            </div>
          </form>

        </div>
        <div className="col"></div>
        <style>{`
          .text-gradient {
            background: linear-gradient(90deg, #0064c8ff, #00f2ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}</style>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
          {playlist.map(item => (
            <div className="col" key={item.id}>
              <div className="card h-100 shadow-sm text-center rounded-5 border-0 py-3"
                style={{ overflow: 'hidden' }}>
                <div className="card-body d-flex flex-column justify-content-between mt-3">
                  <div>
                    <h5 className="card-title">{item.name}</h5>
                  </div>
                  <div className="d-flex flex-wrap justify-content-center gap-1 mt-3">
                    {editId === item.id ? (
                      <div className="input-group mb-2 w-100">
                        <input
                          type="text"
                          className="form-control"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                        />
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-1 border-0 flex-grow-1"
                          style={{ minWidth: '70px', fontSize: '0.75rem' }}
                          onClick={() => handleSaveEdit(item.id)}
                        >
                          <FaSave /> Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center gap-1 border-0 flex-grow-1"
                          style={{ minWidth: '70px', fontSize: '0.75rem' }}
                          onClick={() => handleEdit(item.id, item.name)}
                          title="Edit Playlist Name"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-1 border-0 flex-grow-1"
                          style={{ minWidth: '70px', fontSize: '0.75rem' }}
                          onClick={() => handleDelete(item.id)}
                          title="Remove Playlist"
                        >
                          <FaTrash /> Remove
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-1 border-0 flex-grow-1"
                          style={{ minWidth: '70px', fontSize: '0.75rem' }}
                          title="Read Playlist"
                          onClick={() => handleReadPlaylist(item.id, item.name)}
                        >
                          <FaPlus /> Read
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
{/* MODAL */}
{showModal && (
  <div
    className="modal fade show"
    style={{
      display: 'block',
      background: 'rgba(0, 0, 0, 0.5)',
    }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div
        className="modal-content border-0 shadow-lg"
        style={{
          borderRadius: '1.5rem', // ✅ Lebih melengkung
          overflow: 'hidden',     // biar kontennya tidak bocor keluar radius
        }}
      >
        <div
          className="modal-header border-0"
          style={{
            backgroundColor: '#f8f9fa',
            borderTopLeftRadius: '1.5rem',
            borderTopRightRadius: '1.5rem',
          }}
        >
          <h5 className="modal-title">{`Playlist: ${modalPlaylistName}`}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          {modalSongs.length === 0 ? (
            <div className="text-center text-muted">
              No songs in this playlist.
            </div>
          ) : (
            <ul className="list-group list-group-flush rounded">
              {modalSongs.map((song) => (
                <li
                  className="list-group-item d-flex align-items-center gap-2"
                  key={song.id}
                  style={{ border: 'none' }}
                >
                  <FaMusic /> {song.title}
                  <span
                    className="ms-auto text-secondary"
                    style={{ fontSize: '0.85em' }}
                  >
                    {song.artist}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="modal-footer border-0"
          style={{
            backgroundColor: '#f8f9fa',
            borderBottomLeftRadius: '1.5rem',
            borderBottomRightRadius: '1.5rem',
          }}
        >
          <button
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}



<style>{`
  .modal-content {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .modal-header {
    border-bottom: none;
    padding: 1rem 1.5rem;
  }

  .modal-footer {
    border-top: none;
    padding: 1rem 1.5rem;
  }

  .btn-close {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }

  .btn-close:hover {
    opacity: 1;
  }

  .list-group-item {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
  }

  .list-group-item:hover {
    background: #e9ecef;
  }
`}</style>
    </div>
    </>
  )
}

export default MyPlaylist