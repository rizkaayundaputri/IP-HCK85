import React from 'react'
import { NavLink } from 'react-router'
import { FaPlus, FaAlignLeft } from 'react-icons/fa'
import http from '../lib/http'

const CardSong = ({ song }) => {
  return (
    <div>
      <style>
        {`
        .rotate-img {
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
        `}
      </style>

      <div className="col" key={song.id} >
        <div  className="card shadow-sm text-center rounded-5 border-0 py-3"
                style={{ overflow: 'hidden' }}
            >
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <img src={song.coverUrl} alt="" className='rounded-circle rotate-img mb-3' style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <h5 className="card-title mt-3">{song.title}</h5>
              <p className="card-text text-muted">{song.artist}</p>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 rounded-4"
                title="Add to Playlist"
                onClick={() => {
                  
                }}
              >
                <FaPlus /> Playlist
              </button>
              <NavLink
                to={`/songs/${song.id}/lyric`}
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 rounded-4"
                title="View Lyric"
              >
                <FaAlignLeft /> Lyric
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardSong