import { BrowserRouter, Routes, Route } from 'react-router';
import PublicLayout from './layouts/PublicLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import MyPlaylist from './pages/MyPlaylist'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<MyPlaylist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

