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
              <Route path="/mypage" element={<MyPage/>} />
              <Route path="/wishlist" element={<Wishlist/>} />
              <Route path="/cart" element={<Cart/>} />
              <Route path="/myreviews" element={<MyReviews/>} />
              <Route path="/myinquireies" element={<MyInquireies/>} />
              <Route path="/orders" element={<Orders/>} />
              <Route path="/manageaddress" element={<ManageAddress/>} />
              <Route path="/editprofile" element={<EditProfile/>} />
              <Route path="/deleteaccount" element={<DeleteAccount/>} />
            </Route>
            {/* <Route path="/category" element={<Category />} /> */}
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