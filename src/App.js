import "./App.scss";
import { Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "./actions/loading";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import HomePage from "./pages/Home";
import ContactPage from "./pages/Contact";
import OrderPage from "./pages/Order";
import OrderAddPage from "./pages/OrderAdd";
import ProductPage from "./pages/Product";
import ProductAddPage from "./pages/ProductAdd";
import ImportPage from "./pages/Import";
import ImportAddPage from "./pages/ImportAdd";
function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading);
  return (
    <Router>
      <div className="App">
        <div className="_navbar">
          <h1>Phần mềm Quản Lý Kho Hàng</h1>
        </div>
        <div className="_body">
          <div className="_sidebar">
            <Link to="/" onClick={() => dispatch(setLoading(false))}>
              <div className="_sidebar_item">Trang chủ</div>
            </Link>
            <Link to="/order" onClick={() => dispatch(setLoading(false))}>
              <div className="_sidebar_item">Quản lý bán hàng</div>
            </Link>
            <Link to="/import" onClick={() => dispatch(setLoading(false))}>
              <div className="_sidebar_item">Quản lý nhập hàng</div>
            </Link>
            <Link to="/product" onClick={() => dispatch(setLoading(false))}>
              <div className="_sidebar_item">Quản lý sản phẩm</div>
            </Link>
            <Link to="/contact" onClick={() => dispatch(setLoading(false))}>
              <div className="_sidebar_item _contact">Liên hệ</div>
            </Link>
          </div>
          <div className="_content">
            <Spin spinning={isLoading} tip="Đang xử lý ..." size="large">
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route exact path="/order">
                  <OrderPage />
                </Route>
                <Route exact path="/order/add">
                  <OrderAddPage />
                </Route>
                <Route exact path="/import">
                  <ImportPage />
                </Route>
                <Route exact path="/import/add">
                  <ImportAddPage />
                </Route>
                <Route exact path="/product">
                  <ProductPage />
                </Route>
                <Route exact path="/product/add">
                  <ProductAddPage />
                </Route>
                <Route exact path="/contact">
                  <ContactPage />
                </Route>
              </Switch>
            </Spin>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
