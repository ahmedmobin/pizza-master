import React, { useState, useEffect, useCallback } from "react";
import { Form } from "../Layout";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import notification from "./../Common/notifications";
const Flavour = () => {
  const [pizzaFlavor, setPizzaFlavor] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState(7.25);

  const getMenu = useCallback(() => {
    axios
      .get("/menu/")
      .then(res => setPizzaFlavor(res.data))
      .catch(err => console.log(err));
  }, []);
  useEffect(() => {
    getMenu();
  }, [getMenu]);

  const handleDelete = pizzaFlavor => {
    if (window.confirm("Delete Flavor?" + pizzaFlavor.name)) {
      axios
        .get("/menu/delete/" + pizzaFlavor._id)
        .then(res => {
          notification(res.data, "danger");
          getMenu();
        })
        .catch(err => {});
    } else {
      notification("action Cancelled", "danger");
    }
  };

  const addPizzaAction = e => {
    e.preventDefault();
    const pizza = {
      name: name,
      description: desc,
      url: url,
      price: price
    };
    axios
      .post("/menu/add", pizza)
      .then(res => {
        notification(res.data.menu, "success");
        getMenu();
        setName("");
        setPrice(7);
        setDesc("");
        setUrl("");
      })
      .catch(err => notification(err.data, "danger"));
  };
  const columns = [
    { dataField: "_id", text: "ID", hidden: true },
    { dataField: "name", text: "Flavor" },
    { dataField: "description", text: "Description" },
    { dataField: "price", text: "Price" },
    {
      dataField: "databasePkey",
      text: "Remove",
      editable: false,
      formatter: (cellContent, pizzaFlavor) => {
        return (
          <button
            className="btn btn-danger btn-xs"
            onClick={() => handleDelete(pizzaFlavor)}
          >
            x
          </button>
        );
      }
    }
  ];
  const cellEditProps = {
    mode: "click",
    blurToSave: true,
    beforeSaveCell(oldValue, newValue, row, column, done) {
      if (window.confirm("Apply Changes?")) {
        axios
          .post("/menu/update/" + row._id, row)
          .then(res => {
            notification(res.data, "success");
          })
          .catch(err => {
            notification("Update Error", "danger");
          });
        done(); // contine to save the changes
      } else {
        notification("action Cancelled", "danger");
        done(false); // reject the changes
      }
      return { async: true };
    }
  };
  return (
    <div className="row">
      <div className="col-12 col-md-4">
        <h5>Add Flavor</h5>
        <Form onSubmit={addPizzaAction} className="pb-4">
          <div className="form-group">
            <label className="col-form-label" htmlFor="name">
              Flavor
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Flavor"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="col-form-label" htmlFor="desc">
              Description
            </label>
            <input
              type="text"
              name="desc"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Description"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="col-form-label" htmlFor="inputDefault">
              Image Url
            </label>
            <input
              type="text"
              name="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Image Url"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="col-form-label" htmlFor="inputDefault">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={price}
              step="0.25"
              onChange={e => setPrice(e.target.value)}
              placeholder="Price"
              className="form-control"
            />
          </div>

          <button className="btn btn-outline-secondary" type="submit">
            Add Pizza
          </button>
        </Form>
      </div>
      <div className="col-12 col-md-8">
        <h5>Click to edit Flavors</h5>
        <BootstrapTable
          keyField="_id"
          data={pizzaFlavor}
          columns={columns}
          cellEdit={cellEditFactory(cellEditProps)}
        />
      </div>
    </div>
  );
};

export default Flavour;
