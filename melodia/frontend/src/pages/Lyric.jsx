import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import http from '../lib/http'
import { FaMusic } from 'react-icons/fa'

const Lyric = () => {
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [lyric, setLyric] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    http.get(`/songs/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then(res => {
        setSong(res.data)
        return http.post('/ai/gemini-lyric', { title: res.data.title, artist: res.data.artist }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        })
      })
      .then(res => setLyric(res.data.lyric))
      .catch(() => setLyric('❌ Failed to generate lyric.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="container py-5 min-vh-100">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <h1
              className="fw-bold text-light display-5 px-4 py-2 rounded-pill d-inline-block"
              style={{ backgroundColor: '#001f3f' }}
            >
              <FaMusic className="me-2" /> {song?.title}
            </h1><br/>
            <div className="badge bg-secondary-subtle text-dark px-3 py-2 rounded-pill shadow-sm">
              {song?.artist}
            </div>
          </div>

          <div className="lyric-box mx-auto mt-4 text-light">
            <pre className="m-0">{lyric}</pre>
          </div>

          <style>{`

            .lyric-box {
              background: rgba(36, 35, 35, 0.84);
              backdrop-filter: blur(6px);
              padding: 2rem;
              border-radius: 1.5rem;
              font-family: 'Courier New', monospace;
              color: #333;
              max-width: 800px;
              box-shadow: 0 6px 20px rgba(224, 224, 224, 0.1);
              border: 1px solid rgba(0,0,0,0.05);
              white-space: pre-wrap;
            }

          `}</style>
        </>
      )}
    </div>
  )
}

export default Lyric
