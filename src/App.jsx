import React, { useRef, useState, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LottieLoading from "./components/LottieLoading";
import UserLayout from "./components/Layouts/UserLayout.jsx";
import AdminLayout from "./components/Layouts/AdminLayout.jsx";
const HomeScreen = React.lazy(() => import("./screens/user/HomeScreen"));
const ShopScreen = React.lazy(() => import("./screens/user/ShopScreen"));
const ProductScreen = React.lazy(() => import("./screens/user/ProductScreen"));
const CartScreen = React.lazy(() => import("./screens/user/CartScreen"));
const ProfileScreen = React.lazy(() => import("./screens/user/ProfileScreen"));
const ShippingScreen = React.lazy(() => import("./screens/user/ShippingScreen"));
const PaymentScreen = React.lazy(() => import("./screens/user/PaymentScreen"));
const PlaceOrderScreen = React.lazy(() => import("./screens/user/PlaceOrderScreen"));
const OrderScreen = React.lazy(() => import("./screens/user/OrderScreen"));
const AboutUs = React.lazy(() => import("./screens/user/AboutUs"));
const AdminOrderScreen = React.lazy(() => import("./screens/admin/AdminOrderScreen"));
const CategoryListScreen = React.lazy(() => import("./screens/admin/CategoryListScreen"));
const OrderListScreen = React.lazy(() => import("./screens/admin/OrderListScreen"));
const ProductCreateScreen = React.lazy(() => import("./screens/admin/ProductCreateScreen"));
const ProductEditScreen = React.lazy(() => import("./screens/admin/ProductEditScreen"));
const ProductListScreen = React.lazy(() => import("./screens/admin/ProductListScreen"));
const UserListScreen = React.lazy(() => import("./screens/admin/UserListScreen"));
const UserEditScreen = React.lazy(() => import("./screens/admin/UserEditScreen"));
const StatisticsScreen = React.lazy(() => import("./screens/admin/StatisticsScreen"));
const AdminChatScreen = React.lazy(() => import("./screens/admin/AdminChatScreen"));
const HomeContentEditScreen = React.lazy(() => import("./screens/admin/HomeContentEditScreen"));
const RecommendProductsScreen = React.lazy(() => import("./screens/admin/RecommendProductsScreen"));
const NotFoundScreen = React.lazy(() => import("./screens/NotFoundScreen"));

const App = () => {
  const setHasNewMessageRef = useRef(null);
  const hasNewMessageRef = useRef(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (hasNewMessageRef.current) {
      setHasNewMessage(true);
      hasNewMessageRef.current = false;
    }
  }, [hasNewMessageRef]);

  useEffect(() => {
    if (hasNewMessage) {
      setHasNewMessage(false);
    }
  }, [hasNewMessage]);

  return (
    <Router>
      <Suspense fallback={<LottieLoading />}>
        <Switch>
          <Route path="/admin" exact>
            {userInfo && userInfo.isAdmin ? (
              <Redirect to="/admin/products" />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route path="/admin">
            {userInfo && userInfo.isAdmin ? (
              <AdminLayout>
                <Switch>
                  <Route path="/admin/statistics" component={StatisticsScreen} exact />
                  <Route path="/admin/orders" component={OrderListScreen} />
                  <Route path="/admin/product/create" component={ProductCreateScreen} />
                  <Route path="/admin/product/:id" component={ProductEditScreen} />
                  <Route path="/admin/products" component={ProductListScreen} />
                  <Route path="/admin/categories" component={CategoryListScreen} />
                  <Route path="/admin/home-content" component={HomeContentEditScreen} />
                  <Route path="/admin/order/:id" component={AdminOrderScreen} />
                  <Route path="/admin/user/:userId/edit" component={UserEditScreen} />
                  <Route path="/admin/users" component={UserListScreen} />
                  <Route
                    path="/admin/chat"
                    render={(props) => (
                      <AdminChatScreen {...props} setHasNewMessageRef={hasNewMessageRef} />
                    )}
                  />
                  <Route path="/admin/products" component={RecommendProductsScreen} />
                  <Redirect to="/admin/products" />
                </Switch>
              </AdminLayout>
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route>
            <UserLayout setHasNewMessageRef={setHasNewMessageRef}>
              <Switch>
                <Route path="/shop" component={ShopScreen} />
                <Route path="/about-us" component={AboutUs} />
                <Route path="/product" component={ProductScreen} />
                <Route path="/cart/:id?" component={CartScreen} />
                <Route path="/profile" component={ProfileScreen} />
                <Route path="/shipping" component={ShippingScreen} />
                <Route path="/payment" component={PaymentScreen} />
                <Route path="/placeorder" component={PlaceOrderScreen} />
                <Route path="/order/:id" component={OrderScreen} />
                <Route path="/search" component={HomeScreen} exact />
                <Route path="/" component={HomeScreen} exact />
                <Route component={NotFoundScreen} />
              </Switch>
            </UserLayout>
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;

