import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Join from './pages/auth/Join';
import Wishlist from './pages/user/Wishlist';
import Mypage from './pages/user/Mypage';
import Cart from './pages/user/Cart';
import Live from './pages/live/live';
import LiveSetup from './pages/live/LiveSetup';
import StreamView from './pages/live/StreamView';
import Event from './pages/event/Event';
import ChatSupport from './pages/support/ChatSupport';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/join" element={<Join/>} />
          <Route path="/wishlist" element={<Wishlist/>} />
          <Route path="/mypage" element={<Mypage/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/event" element={<Event/>} />
          <Route path="/support" element={<ChatSupport/>} />
          <Route path="/live" element={<Live/>} /> {/* 방송리스트화면 */}
          <Route path="/live/setup" element={<LiveSetup/>} /> {/* 방송준비화면 */}
          <Route path="/live/view" element={<StreamView/>} /> {/* 방송 시청하는 화면 ex)/live/view/123 */} 
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;