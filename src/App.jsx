import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Join from './pages/auth/Join';
import UserLayout from './layouts/UserLayout';
import MyPage from './pages/user/MyPage';
import Wishlist from './pages/user/Wishlist';
import Cart from './pages/user/Cart';
import MyReviews from './pages/user/MyReviews';
import MyInquireies from './pages/user/MyInquireies';
import Orders from './pages/user/Orders';
import ManageAddress from './pages/user/ManageAddress';
import EditProfile from './pages/user/EditProfile';
import DeleteAccount from './pages/user/DeleteAccount';
import Live from './pages/live/live';
import LiveSetup from './pages/live/LiveSetup';
import StreamView from './pages/live/StreamView';
import Event from './pages/event/Event';
import ChatSupport from './pages/support/ChatSupport';
import AddItem from './pages/seller/AddItem';
// import Category from './pages/category/Category';  

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/join" element={<Join/>} />

            <Route element={<UserLayout/>}>
              <Route path="/my/user" element={<MyPage/>} />
              <Route path="/my/user/wishlist" element={<Wishlist/>} />
              <Route path="/my/user/cart" element={<Cart/>} />
              <Route path="/my/user/review" element={<MyReviews/>} />
              <Route path="/my/user/inquiry" element={<MyInquireies/>} />
              <Route path="/my/user/order" element={<Orders/>} />
              <Route path="/my/user/address" element={<ManageAddress/>} />
              <Route path="/my/user/prifile" element={<EditProfile/>} />
              <Route path="/my/user/withdraw" element={<DeleteAccount/>} />
            </Route>
            
             <Route path="/my/seller/item/register" element={<AddItem/>} />

            <Route path="/event" element={<Event/>} />
            <Route path="/support" element={<ChatSupport/>} />
            <Route path="/live" element={<Live/>} /> {/* 방송리스트화면 */}
            <Route path="/live/setup" element={<LiveSetup/>} /> {/* 방송준비화면 */}
            <Route path="/live/view" element={<StreamView/>} /> {/* 방송 시청하는 화면 ex)/live/view?id=123 */}
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;