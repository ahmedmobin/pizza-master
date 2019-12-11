import React, { useState, useEffect } from "react";
import { Form } from "../Layout";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import notification from "./../Common/notifications";
const Size = () => {
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    getSizes();
  }, []);
  const getSizes = () => {
    axios
      .get("/size/")
      .then(res => {
        setSizes(res.data);
      })
      .catch(err => console.log(err));
  };
  const handleDelete = size => {
    if (window.confirm("Delete size?" + size.size)) {
      axios
        .get("/size/delete/" + size._id)
        .then(res => {
          notification(res.data, "danger");
          getSizes();
        })
        .catch(err => {});
    } else {
      notification("action Cancelled", "danger");
    }
  };
  const addSizeAction = e => {
    e.preventDefault();
    const sizea = {
      size: size,
      price: price
    };
    axios.post("/size/add", sizea).then(res => {
      notification(res.data.size, "success");
      getSizes();
      setSize("");
      setPrice(0);
    });
  };
  const columns = [
    { dataField: "_id", text: "ID", hidden: true },
    { dataField: "size", text: "Sizes" },
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

  const cellEditProps = {
    mode: "click",
    blurToSave: true,
    beforeSaveCell(oldValue, newValue, row, column, done) {
      if (window.confirm("Apply Changes?")) {
        axios
          .post("/size/update/" + row._id, row)
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
        <h5>Add Size</h5>
        <Form onSubmit={addSizeAction} className="pb-4">
          <div className="form-group">
            <label className="col-form-label" htmlFor="size">
              size
            </label>
            <input
              type="text"
              name="size"
              value={size}
              step="2"
              onChange={e => setSize(e.target.value)}
              placeholder="Size"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="col-form-label" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={price}
              step=".01"
              onChange={e => setPrice(e.target.value)}
              placeholder="Price"
              className="form-control"
            />
          </div>

          <button className="btn btn-outline-secondary" type="submit">
            Add Size
          </button>
        </Form>
      </div>
      <div className="col-12 col-md-8">
        <h5>Click to edit Sizes</h5>
        <BootstrapTable
          keyField="_id"
          data={sizes}
          columns={columns}
          cellEdit={cellEditFactory(cellEditProps)}
        />
      </div>
    </div>
  );
};
export default Size;
