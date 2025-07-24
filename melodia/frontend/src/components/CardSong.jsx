import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router'
import { FaPlus, FaAlignLeft } from 'react-icons/fa'
import http from '../lib/http'

const CardSong = ({ song }) => {
  const [showModal, setShowModal] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState('')

  // Fetch playlists saat modal dibuka
  const handleOpenModal = async () => {
    setShowModal(true)
    try {
      const res = await http.get('/playlists', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      setPlaylists(res.data)
    } catch {
      setPlaylists([])
    }
  }

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) return alert('Pilih playlist terlebih dahulu!')
    try {
      console.log("Mengirim songId:", song.id, "ke playlist:", selectedPlaylist)
      await http.post(`/playlists/${selectedPlaylist}/songs`, { songId: song.id }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      alert('Berhasil menambahkan ke playlist!')
      setShowModal(false)
      setSelectedPlaylist('')
    } catch {
      alert('Gagal menambahkan ke playlist!')
    }
  }

  return (
    <div className="col" key={song.id}>
      <style>
        {`
          .glass-card {
            background: rgba(88, 88, 88, 0.81);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(57, 58, 81, 0.37);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          
          .glass-card:hover {
            transform: translateY(-8px);
           
            background: rgba(255, 255, 255, 0.15);
          }
          
          .glass-modal {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          
          .glass-modal-backdrop {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
          }
          
          .gradient-btn {
            background: linear-gradient(135deg, #0b1a54ff 0%, #14077aff 100%);
            border: none;
            transition: all 0.3s ease;
          }
          
          .gradient-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
          
          .glass-select {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
          }
          
          .rotate-img {
            animation: rotate 20s linear infinite;
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .pulse-border {
            animation: pulse-border 2s ease-in-out infinite;
          }
          
        
        `}
      </style>
      
      <div
        className="card glass-card text-center rounded-5 border-0 py-4 px-3"
        style={{ overflow: 'hidden', minHeight: '350px' }}
      >
        <div className="card-body d-flex flex-column justify-content-between h-100">
          <div>
            <img
              src={song.coverUrl}
              alt=""
              className="rounded-circle rotate-img pulse-border mb-3"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                border: '3px solid rgba(255,255,255,0.6)',
                animation: 'rotate 5s linear infinite', // Added rotation animation
              }}
            />

            <h5 className="card-title mt-2 text-white fw-bold">{song.title}</h5>
            <p className="card-text text-light opacity-75">{song.artist}</p>
          </div>

          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              className="btn gradient-btn text-white btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
              title="Add to Playlist"
              onClick={handleOpenModal}
            >
              <FaPlus /> Playlist
            </button>

            <NavLink
              to={`/lyric/${song.id}`}
              className="btn btn-light btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
              title="View Lyric"
            >
              <FaAlignLeft /> Lyric
            </NavLink>
          </div>
        </div>
      </div>

      {/* Enhanced Glass Modal */}
      {showModal && (
        <div className="modal fade show glass-modal-backdrop d-flex align-items-center justify-content-center" 
             style={{ display: 'block', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '450px' }}>
            <div className="modal-content glass-modal border-0">
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <FaPlus className="text-primary" />
                  Add to Playlist
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                  style={{ filter: 'invert(1)' }}
                ></button>
              </div>
              
              <div className="modal-body py-4">
                <div className="mb-3">
                  <p className="text-muted mb-3">
                    Adding "<strong>{song.title}</strong>" by <em>{song.artist}</em>
                  </p>
                  
                  <label className="form-label fw-semibold">Select Playlist:</label>
                  <select
                    className="form-select glass-select border-0 py-3"
                    value={selectedPlaylist}
                    onChange={e => setSelectedPlaylist(e.target.value)}
                  >
                    <option value="" disabled>Choose a playlist...</option>
                    {playlists.map(pl => (
                      <option key={pl.id} value={pl.id}>{pl.name}</option>
                    ))}
                  </select>
                  
                  {playlists.length === 0 && (
                    <div className="alert alert-info mt-3 border-0" style={{ background: 'rgba(13, 202, 240, 0.1)' }}>
                      <small>No playlists found. Create a playlist first!</small>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-footer border-0 pt-0">
                <button 
                  className="btn btn-outline-secondary rounded-pill px-4" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn gradient-btn text-white rounded-pill px-4" 
                  onClick={handleAddToPlaylist}
                  disabled={!selectedPlaylist}
                >
                  <FaPlus className="me-2" />
                  Add to Playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardSong