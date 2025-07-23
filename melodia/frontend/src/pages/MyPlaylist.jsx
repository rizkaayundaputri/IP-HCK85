import React, { useEffect, useState } from 'react'
import http from '../lib/http'
import { FaTrash, FaPlus, FaEdit, FaSave } from 'react-icons/fa'

const MyPlaylist = () => {
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(true)
  const [playlistName, setPlaylistName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')

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

  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold text-primary">My Playlist</h1>
      <form className="mb-4" onSubmit={handleCreatePlaylist}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Playlist Name"
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">
            <FaPlus /> Create Playlist
          </button>
        </div>
      </form>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
      
    <div className="row row-cols-1 row-cols-md-4 g-4 mt-3">
    {playlist.map(item => (
        <div className="col" key={item.id}>
        <div className="card h-100 shadow-sm text-center rounded-5 border-0 py-3"
                style={{ overflow: 'hidden' }}
            >
            <div className="card-body d-flex flex-column justify-content-between mt-3">
            <div>
                <h5 className="card-title">{item.name}</h5>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-3">
                {editId === item.id ? (
                <div className="input-group mb-2">
                    <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    />
                    <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 border-0"
                    style={{ minWidth: '90px' }}
                    onClick={() => handleSaveEdit(item.id)}
                    >
                    <FaSave /> Save
                    </button>
                </div>
                ) : (
                <>
                    <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 border-0 justify-content-center mt-4"
                    style={{ minWidth: '90px' }}
                    onClick={() => handleEdit(item.id, item.name)}
                    title="Edit Playlist Name"
                    >
                    <FaEdit /> Edit
                    </button>
                    <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 border-0 justify-content-center mt-4"
                    style={{ minWidth: '90px' }}
                    onClick={() => handleDelete(item.id)}
                    title="Remove Playlist"
                    >
                    <FaTrash /> Remove
                    </button>
                    <button
                    className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 border-0 justify-content-center mt-4"
                    style={{ minWidth: '90px' }}
                    title="Read Playlist"
                    onClick={() => alert(`Playlist: ${item.name}`)}
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
    </div>
  )
}

export default MyPlaylist