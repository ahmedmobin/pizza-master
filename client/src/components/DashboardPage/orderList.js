import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios";

const OrderList = () => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const source = axios.CancelToken.source();

    const loadData = async () => {
      try {
        const orderResponse = await axios.get("/orders/", {
          cancelToken: source.token
        });
        let newOrder = [];
        orderResponse.data.map(e => {
          return e.order.map(r => {
            return newOrder.push(r);
          });
        });
        setOrder(newOrder);
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
  }, [order]);

  const columns = [
    { dataField: "_id", text: "ID", hidden: true },
    { dataField: "name", text: "Flavor", sort: true },
    { dataField: "size", text: "size", sort: true },
    { dataField: "crust", text: "crust", sort: true },
    {
      dataField: "toppings",
      text: "toppings",
      formatter: (cell, row) => cell.join(",")
    },
    { dataField: "price", text: "Price", sort: true }
  ];
  return (
    <div className="container">
      <BootstrapTable keyField="key" data={order} columns={columns} />
    </div>
  );
};

export default OrderList;
