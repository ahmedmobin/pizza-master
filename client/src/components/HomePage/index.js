import React, { useState, useEffect } from "react";
import axios from "axios";
import http from "../../services/httpService";
import notification from "./../Common/notifications";
import OrderPizzaModal from "../OrderPizzaModal";

const HomePage = () => {
  const [menu, setMenu] = useState([]);
  const [crusts, setCrusts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [order, setOrder] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  useEffect(() => {
    const abortController = new AbortController();
    const source = axios.CancelToken.source();

    const loadData = async () => {
      try {
        const menuResponse = await axios.get("/menu/", {
          cancelToken: source.token
        });
        const crustResponse = await axios.get("/crusts/", {
          cancelToken: source.token
        });
        const toppingResponse = await axios.get("/topping/", {
          cancelToken: source.token
        });
        const sizeResponse = await axios.get("/size/", {
          cancelToken: source.token
        });

        setMenu(menuResponse.data);
        setCrusts(crustResponse.data);
        setToppings(toppingResponse.data);
        setSizes(sizeResponse.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("cancelled");
        } else {
          throw error;
        }
      }
    };
    loadData();
    return () => {
      abortController.abort();
      source.cancel();
    };
  }, []);
  function addOrderItem(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    var orderItem = {};
    data.forEach((value, key) => {
      if (!Reflect.has(orderItem, key)) {
        orderItem[key] = value;
        return;
      }
      if (!Array.isArray(orderItem[key])) {
        orderItem[key] = [orderItem[key]];
      }
      orderItem[key].push(value);
    });
    if (!orderItem.size) {
      notification("Please select Size", "danger");
      return;
    }
    if (!orderItem.crust) {
      notification("Please select crust", "danger");
      return;
    }
    if (!orderItem.toppings) {
      orderItem.toppings = ["-"];
    }

    if (typeof orderItem.toppings.valueOf() === "string") {
      orderItem.toppings = orderItem.toppings.split();
    }

    if (typeof orderItem.price.valueOf() === "string") {
      orderItem.price = parseFloat(orderItem.price);
    }

    let size = sizes.find(c => c._id === orderItem.size);
    orderItem.size = size.size;
    orderItem.price = orderItem.price + size.price;

    let crust = crusts.find(c => c._id === orderItem.crust);
    orderItem.crust = crust.name;
    orderItem.price = orderItem.price + crust.price;

    let toppingArray = [];
    orderItem.toppings.forEach((item, index) => {
      toppings.find(c => (c._id === item ? toppingArray.push(c) : null));
    });
    let toppingNames = [];
    toppingArray.forEach(item => {
      toppingNames.push(item.name);
      orderItem.price = orderItem.price + item.price;
    });
    orderItem.toppings = toppingNames;
    setOrder(order => [...order, orderItem]);
    setModalShow(false);
  }
  function orderNowAction() {
    if (order.length) {
      http
        .post("/orders/add", { order: order })
        .then(res => {
          notification("Order Placed", "success");
          setOrder([]);
        })
        .catch(err => {
          notification(err, "danger");
        });
    }
  }
  function openModalWithItem(item) {
    setModalShow(true);
    setSelectedItem(item);
  }
  function removeOrderItem(itemIndex) {
    let newOder = order.splice(itemIndex, 1);
    notification("Item removed from order", "danger");
    setOrder(newOder);
    setOrder(order);
  }

  return (
    <div className="container-fluid full-height d-flex flex-column">
      <div className="row h-100">
        <div className="col-md-8">
          <div className="row">
            {menu.length
              ? menu.map(s => (
                  <div
                    key={s._id}
                    className="col-12 col-md-6 col-lg-3 col-xl-4 mt-4 p-2"
                  >
                    <div className="pizza-item">
                      <figure>
                        <img alt={s.name} src={s.url} />
                      </figure>
                      <div className="pizza-box">
                        <div className="pizza-box-description">
                          <h2>{s.name}</h2>
                          <p>{s.description}</p>
                        </div>
                        <button
                          className="btn btn-addtocart"
                          onClick={() => {
                            openModalWithItem(s);
                          }}
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : "no record"}
          </div>
        </div>
        <div className="col-md-4 pr-0">
          <div className="d-flex flex-column order-area h-100">
            {order.length ? (
              <>
                <ul className="list-group">
                  {order.map((s, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <ul className="list-unstyled">
                        <li>
                          <h6 className="mb-0">{s.name}</h6>
                        </li>
                        <li>
                          <small>Size: {s.size}</small>
                        </li>
                        <li>
                          <small>Crust: {s.crust}</small>
                        </li>
                        <li>
                          <small>Toppings: {s.toppings.join(",")}</small>
                        </li>
                        <li>
                          <small>Price: {s.price}$</small>
                        </li>
                      </ul>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={removeOrderItem}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={orderNowAction}
                  className="btn btn-primary mt-auto"
                >
                  ORDER NOW
                </button>
              </>
            ) : (
              <div className="pizza-no-order">
                <figure>
                  <img alt="Pizza Chef" src="/images/static/pizza-chef.png" />
                </figure>
                <p>We’re Waiting for your Order!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <OrderPizzaModal
        show={modalShow}
        sizes={sizes}
        crusts={crusts}
        toppings={toppings}
        onSubmit={addOrderItem}
        onHide={() => {
          setModalShow(false);
        }}
        selecteditem={selectedItem}
      ></OrderPizzaModal>
    </div>
  );
};
export default HomePage;
