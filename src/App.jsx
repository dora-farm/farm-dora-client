import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Join from './pages/auth/Join';
import UserLayout from './layouts/UserLayout';
import SellerLayout from './layouts/SellerLayout';
import MyPage from './pages/user/MyPage';
import Wishlist from './pages/user/Wishlist';
import Basket from './pages/user/Basket.jsx';
import MyInquireies from './pages/user/MyInquireies';
import Orders from './pages/user/Orders';
import ManageAddress from './pages/user/ManageAddress';
import EditProfile from './pages/user/EditProfile';
import DeleteAccount from './pages/user/DeleteAccount';
import OrdermanageHome from './pages/seller/ordermanage/OrdermanageHome';
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
import JoinSeller from "./pages/user/JoinSeller.jsx";
import AdminPopupDetail from './pages/adminpage/AdminPopupDetail';
import AdminPopupEdit from './pages/adminpage/AdminPopupEdit';
import EventDetail from './pages/event/EventDetail';
import MyReviews from './pages/user/MyReviews';
import { CategoryProvider } from './layouts/CategoryContext';
import SellerApproval from "./pages/adminpage/SellerApproval.jsx";
import { TokenProvider } from './common/utils/TokenContxet';
import OrderPage from './pages/order/OrderPage';
import OrderCompletePage from './pages/order/OrderCompletePage';
import { BasketProvider } from './common/contexts/BasketContext.jsx';


function App() {
  return (
    <TokenProvider>
      <CategoryProvider>
        <BasketProvider>
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
                <Route path="/live/view/:id" element={<StreamView/>} /> {/* 방송 시청하는 화면 ex)/live/view?id=123 */}
                <Route path="/sale/:saleId" element={<ProductDetail />} />
                <Route path="/order" element={<OrderPage />} />
                  
                <Route element={<UserLayout/>}>
                  <Route path="/my/user" element={<MyPage/>} />
                  <Route path="/my/user/review" element={<MyReviews/>} />
                  <Route path="my/user/basket" element={<Basket />} />
                  <Route path="/my/user/inquiry" element={<MyInquireies/>} />
                  <Route path="/my/user/order" element={<Orders/>} />
                  <Route path="/my/user/address" element={<ManageAddress/>} />
                  <Route path="/my/user/join/seller" element={<JoinSeller/>} />
                  <Route path="/my/user/profile" element={<EditProfile/>} />
                  <Route path="/my/user/withdraw" element={<DeleteAccount/>} />
                  <Route path="/my/user/wishlist" element={<Wishlist/>} />
                  <Route path="/order/complete" element={<OrderCompletePage />} />
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
                <Route path="/admin/seller/approval" element={<SellerApproval/>} />
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
        </BasketProvider>
      </CategoryProvider>
    </TokenProvider>
  );
}

export default App;