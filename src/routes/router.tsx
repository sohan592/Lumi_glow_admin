import Profile from '@/@components/layouts/header/components/edit-from/profile';
import Setting from '@/@components/layouts/header/components/edit-from/setting';
import LoginPage from '@/modules/auth';
import CustomersForm from '@/modules/customers/create';
import FaceDetectionApp from '@/modules/face-detect';
import OrderDetails from '@/modules/order/view';
import ReviewLIst from '@/modules/product/Reviews/List';
import { Col, Spin } from 'antd';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const PrivateOutlet = lazy(() => import('./private-outlet'));

const OrderList = lazy(() => import('@/modules/order/list/List'));
const TicketsList = lazy(() => import('@/modules/tickets/list/List'));

const CouponList = lazy(() => import('@/modules/coupons/list/List'));
const CouponForm = lazy(() => import('@/modules/coupons/create'));

const SalesDashboard = lazy(() => import('@/modules/dashboard/index'));

const ProductPages = lazy(() => import('@/modules/product/productPage'));

const ShipingList = lazy(() => import('@/modules/shipping/list/List'));

const CustomerList = lazy(() => import('@/modules/customers/list/List'));
const CustomerView = lazy(() => import('@/modules/customers/view'));

const ShippingForm = lazy(() => import('@/modules/shipping/create'));

const MediaList = lazy(() => import('@/modules/media/list'));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <Col className="h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-500 text-sm animate-pulse">
              Loading your content...
            </p>
          </div>
        </Col>
      }
    >
      <Routes>
        <Route
          path="/login"
          element={
            <div>
              <LoginPage />
            </div>
          }
        />
        <Route path="/detect" element={<FaceDetectionApp />} />

        <Route element={<PrivateOutlet />}>
          <Route path="/" element={<SalesDashboard />} />
          <Route path="/orders/all-orders" element={<OrderList />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />

          {/* <Route
            path="/orders/all-orders"
            element={
              <div>
                <h1>All Orders</h1>
              </div>
            }
          /> */}
          <Route path="/reviews" element={<ReviewLIst />} />
          <Route path="/profile-settings" element={<Profile />} />
          <Route path="/account-settings" element={<Setting />} />
          <Route path="/coupons" element={<CouponList />} />
          <Route path="/coupon/add" element={<CouponForm />} />
          <Route path="/coupons/edit/:id" element={<CouponForm />} />

          <Route path="/products/*" element={<ProductPages />} />
          <Route path="/medias" element={<MediaList />} />
          <Route path="/customers/add" element={<CustomersForm />} />
          <Route path="/tickets" element={<TicketsList />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customer/:id/view" element={<CustomerView />} />
          <Route path="/shipping-methods" element={<ShipingList />} />
          <Route path="/shipping-methods" element={<ShipingList />} />
          <Route path="/shipping-methods/add" element={<ShippingForm />} />
          <Route path="/shipping-methods/edit/:id" element={<ShippingForm />} />
          <Route path="*" element={<h1>Not Found!</h1>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
