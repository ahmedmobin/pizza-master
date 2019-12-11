import React, { useEffect, useState, useCallback } from "react";
import { Form } from "../Layout";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import notification from "./../Common/notifications";
const Crust = () => {
  const [crusts, setCrusts] = useState([]);
  const [crust, setCrust] = useState("");
  const [price, setPrice] = useState(0);
  const getCrusts = useCallback(() => {
    axios
      .get("/crusts/")
      .then(res => {
        setCrusts(res.data);
      })
      .catch(err => console.log(err));
  }, [setCrusts]);
  useEffect(() => {
    getCrusts();
  }, [getCrusts]);
  const cellEditProps = {
    mode: "click",
    blurToSave: true,
    beforeSaveCell(oldValue, newValue, row, column, done) {
      if (window.confirm("Apply Changes?")) {
        axios
          .post("/crusts/update/" + row._id, row)
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
  const handleDelete = pizzaFlavor => {
    if (window.confirm("Delete Flavor?" + pizzaFlavor.name)) {
      axios
        .get("/crusts/delete/" + pizzaFlavor._id)
        .then(res => {
          notification(res.data, "danger");
          getCrusts();
        })
        .catch(err => {});
    } else {
      notification("action Cancelled", "danger");
    }
  };

  const columns = [
    { dataField: "_id", text: "ID", hidden: true },
    { dataField: "name", text: "Crusts" },
    { dataField: "price", text: "price" },
    {
      dataField: "databasePkey",
      text: "Remove",
      editable: false,
      formatter: (cellContent, sizes) => {
        return (
          <button
            className="btn btn-danger btn-xs"
            onClick={() => handleDelete(sizes)}
          >
            x
          </button>
        );
      }
    }
  ];
  const addCrustAction = e => {
    e.preventDefault();
    const addCrust = {
      name: crust,
      price: price
    };
    axios
      .post("/crusts/add", addCrust)
      .then(res => {
        notification(res.data.crust, "success");
        getCrusts();
        setCrust("");
      })
      .catch(err => notification(err.data, "danger"));
  };
  return (
    <div className="row">
      <div className="col-12 col-md-4">
        <h5>Add Crust Type</h5>
        <Form onSubmit={addCrustAction} className="pb-4">
          <div className="form-group">
            <label className="col-form-label sr-only" htmlFor="crust">
              Crust
            </label>
            <input
              type="text"
              name="crust"
              value={crust}
              onChange={e => setCrust(e.target.value)}
              placeholder="Crust Type"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="col-form-label" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              step="0.1"
              name="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price"
              className="form-control"
            />
          </div>

          <button className="btn btn-outline-secondary" type="submit">
            Add Crust
          </button>
        </Form>
      </div>
      <div className="col-12 col-md-8">
        <h5>Click to edit Crusts</h5>
        <BootstrapTable
          keyField="_id"
          data={crusts}
          columns={columns}
          cellEdit={cellEditFactory(cellEditProps)}
        />
      </div>
    </div>
  );
};

export default Crust;
