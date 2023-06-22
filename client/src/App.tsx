import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./views/HomeView/Home";
import Error from "./views/ErrorView/Error";
import UserProvider from "./providers/UserProvider";
import Product from "./views/ProductView/Product";
import Cart from "./views/CartView/Cart";
import Checkout from "./views/CheckoutView/Checkout";
import OrderPlaced from "./views/OrderPlacedView/OrderPlaced";
import { ThemeProvider } from "./providers/ThemeProvider";
import MyOrders from "./views/MyOrdersView/MyOrders";

const App = () => {
  return (
    <ThemeProvider>
        <div className="bg-bg-light dark:bg-bg-dark">
          <UserProvider>
              <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="products/:id" element={<Product />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="orders/" element={<MyOrders />} />
                    <Route path="orders/:id" element={<OrderPlaced />} />
                    <Route path="*" element={<Error />} />
                    </Route>
                </Routes>
              </BrowserRouter>
          </UserProvider>
        </div>
    </ThemeProvider>
  )
};

export default App;