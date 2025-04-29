import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Join from './pages/auth/Join';
import UserLayout from './layouts/UserLayout';
import SellerLayout from './layouts/SellerLayout';
import MyPage from './pages/user/MyPage';
import Wishlist from './pages/user/Wishlist';
import Cart from './pages/user/Cart';
// import MyReviews from './pages/user/MyReviews';
import MyInquireies from './pages/user/MyInquireies';
import Orders from './pages/user/Orders';
import ManageAddress from './pages/user/ManageAddress';
import EditProfile from './pages/user/EditProfile';
import DeleteAccount from './pages/user/DeleteAccount';
import Cancel from './pages/seller/ordermanage/Cancel';
import Exchange from './pages/seller/ordermanage/Exchange';
import Inquiry from './pages/seller/ordermanage/Inquiry';
import New from './pages/seller/ordermanage/New';
import OrdermanageHome from './pages/seller/ordermanage/OrdermanageHome';
import Order from './pages/seller/ordermanage/Order'
import Refund from './pages/seller/ordermanage/Refund';
import Review from './pages/seller/ordermanage/Review';
import SellerHome from './pages/seller/dashboard/SellerHome';
import VideoManage from './pages/seller/video/VideoManage';
import Manage from './pages/seller/product/Manage';
import Register from './pages/seller/product/Register';
import AdminHome from './pages/adminpage/AdminHome';
import AdminPopup from './pages/adminpage/AdminPopup';
import AdminPopupRegi from './pages/adminpage/AdminPopupRegi';
import AdminProduct from './pages/adminpage/AdminProduct';
import AdminReview from './pages/adminpage/AdminReview';
import AdminUser from './pages/adminpage/AdminUser';
import Event from './pages/event/Event';
import ChatSupport from './pages/support/ChatSupport';
import AdminLayout from './layouts/AdminLayout';
import AdminBroadcast from './pages/adminpage/AdminBroadcast';
import ProductEdit from './pages/seller/product/ProductEdit';
import './pages/seller/dashboard/utils/ChartRegistry';
import ProductDetail from './pages/product/ProductDetail';
import Live from './pages/live/Live';
import StreamView from './pages/live/StreamView';

import Category from './pages/category/Category';
import AdminPopupDetail from './pages/adminpage/AdminPopupDetail';
import AdminPopupEdit from './pages/adminpage/AdminPopupEdit';
import EventDetail from './pages/event/EventDetail';
import MyReviews from './pages/user/MyReviews';

function App() {
  return (
    <BrowserRouter>
        <Routes>
        
          <Route path="/" element={<Layout/>}>
            <Route index element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/join" element={<Join/>} />
            <Route path="/category" element={<Category/>} />
            <Route path="/event" element={<Event/>} />
            <Route path="/event/:id" element={<EventDetail/>} />
            <Route path="/support" element={<ChatSupport/>} />
            <Route path="/live" element={<Live/>} /> {/* 방송리스트화면 */}
            <Route path="/live/view" element={<StreamView/>} /> {/* 방송 시청하는 화면 ex)/live/view?id=123 */}
            <Route path="/sale/:saleId" element={<ProductDetail />} />

            <Route element={<UserLayout/>}>
              <Route path="/my/user" element={<MyPage/>} />
              <Route path="/my/user/review" element={<MyReviews/>} />
              <Route path="/my/user/cart" element={<Cart/>} />
              <Route path="/my/user/inquiry" element={<MyInquireies/>} />
              <Route path="/my/user/order" element={<Orders/>} />
              <Route path="/my/user/address" element={<ManageAddress/>} />
              <Route path="/my/user/profile" element={<EditProfile/>} />
              <Route path="/my/user/withdraw" element={<DeleteAccount/>} />
              <Route path="/my/user/wishlist" element={<Wishlist/>} />
            </Route>

            <Route element={<AdminLayout/>}>
              <Route path="/admin/broadcast" element={<AdminBroadcast/>} />
              <Route path="/admin" element={<AdminHome/>} />
              <Route path="/admin/popup" element={<AdminPopup/>} />
              <Route path="/admin/popup/:id" element={<AdminPopupDetail/>} />
              <Route path="/admin/popup/edit/:id" element={<AdminPopupEdit/>} />
              <Route path="/admin/popup/register" element={<AdminPopupRegi/>} />
              <Route path="/admin/product" element={<AdminProduct/>} />
              <Route path="/admin/review" element={<AdminReview/>} />
              <Route path="/admin/user" element={<AdminUser/>} />
            </Route>

            <Route element={<SellerLayout/>}>
              <Route path="/my/seller" element={<SellerHome/>} />
              <Route path="/my/seller/order/*" element={<OrdermanageHome/>} />
              <Route path="/my/seller/item/manage" element={<Manage/>} />
              <Route path="/my/seller/item/register" element={<Register/>} />
              <Route path="/my/seller/item/edit" element={<ProductEdit/>} />
              <Route path="/my/seller/live" element={<VideoManage/>} />
            </Route>
      
          </Route>
        </Routes>
        
    </BrowserRouter>
    
  );
}

export default App;