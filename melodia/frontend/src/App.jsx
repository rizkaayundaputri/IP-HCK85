import { BrowserRouter, Routes, Route } from 'react-router';
import { Provider } from "react-redux";
import PublicLayout from './layouts/PublicLayout';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import MyPlaylist from './pages/MyPlaylist'
import Lyric from './pages/Lyric';
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<MyPlaylist />} />
          <Route path="/lyric/:id" element={<Lyric />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

