import React from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import Crust from "../Crust";
import Flavour from "../Flavour";
import Topping from "../Topping";
import Size from "../Size";
import OrderList from "./orderList";

function DashboardPage(props) {
  const { setAuthTokens } = useAuth();

  function logOut() {
    setAuthTokens();
  }

  return (
    <div className="container-fluid pt-3">
      <div className="row">
        <div className="col-3">
          <div
            className="nav flex-column nav-pills"
            aria-orientation="vertical"
          >
            <NavLink
              exact
              className="nav-link"
              activeClassName="active"
              to="/admin/"
            >
              Dashboard
            </NavLink>
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/admin/flavor"
            >
              Flavors
            </NavLink>
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/admin/crust"
            >
              Crusts
            </NavLink>
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/admin/size"
            >
              Sizes
            </NavLink>
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/admin/topping"
            >
              Toppings
            </NavLink>
            <button className="btn btn-danger" onClick={logOut}>
              Logout
            </button>
          </div>
        </div>
        <div className="col-9">
          <Switch>
            <Route exact path="/admin/" component={OrderList} />
            <Route exact path="/admin/flavor" component={Flavour} />
            <Route exact path="/admin/size" component={Size} />
            <Route exact path="/admin/crust" component={Crust} />
            <Route exact path="/admin/topping" component={Topping} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
