import "./App.scss";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import HomePage from "./pages/Home";
import ContactPage from "./pages/Contact";
import OrderPage from "./pages/Order";
import OrderAddPage from "./pages/OrderAdd";
import ProductPage from "./pages/Product";
import ImportPage from "./pages/Import";
function App() {
  return (
    <Router>
      <div className="App">
        <div className="_navbar">
          <h1>Phần mềm Quản Lý Bán Hàng</h1>
        </div>
        <div className="_body">
          <div className="_sidebar">
            <Link to="/">
              <div className="_sidebar_item">Trang chủ</div>
            </Link>
            <Link to="/order">
              <div className="_sidebar_item">Quản lý bán hàng</div>
            </Link>
            <Link to="/import">
              <div className="_sidebar_item">Quản lý nhập hàng</div>
            </Link>
            <Link to="/product">
              <div className="_sidebar_item">Quản lý sản phẩm</div>
            </Link>
            <Link to="/contact">
              <div className="_sidebar_item _contact">Liên hệ</div>
            </Link>
          </div>
          <div className="_content">
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
              <Route exact path="/product">
                <ProductPage />
              </Route>
              <Route exact path="/contact">
                <ContactPage />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
