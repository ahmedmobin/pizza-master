import React, { useState, useEffect } from "react";
import { Form } from "../Layout";
import axios from "axios";
import { store as notifications } from "react-notifications-component";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
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
          notifications.addNotification({
            message: res.data,
            type: "success",
            insert: "top",
            container: "bottom-right",
            dismiss: {
              duration: 5000
            }
          });
          getSizes();
        })
        .catch(err => {});
    } else {
      notifications.addNotification({
        message: "action Cancelled",
        type: "danger",
        insert: "top",
        container: "bottom-right",
        dismiss: {
          duration: 5000
        }
      });
    }
  };
  const addSizeAction = e => {
    e.preventDefault();
    const sizea = {
      size: size,
      price: price
    };
    axios.post("/size/add", sizea).then(res => {
      notifications.addNotification({
        message: res.data.size,
        type: "success",
        insert: "top",
        container: "bottom-right",
        dismiss: {
          duration: 2000
        }
      });
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
            notifications.addNotification({
              message: res.data,
              type: "success",
              insert: "top",
              container: "bottom-right",
              dismiss: {
                duration: 5000
              }
            });
          })
          .catch(err => {
            console.log(err);
            notifications.addNotification({
              message: "Update Error",
              type: "danger",
              insert: "top",
              container: "bottom-right",
              dismiss: {
                duration: 5000
              }
            });
          });
        done(); // contine to save the changes
      } else {
        notifications.addNotification({
          message: "action Cancelled",
          type: "danger",
          insert: "top",
          container: "bottom-right",
          dismiss: {
            duration: 5000
          }
        });
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
// class Size extends React.Component {
//   constructor(props) {
//     super(props);
//     this.addSizeAction = this.addSizeAction.bind(this);
//     this.handleDelete = this.handleDelete.bind(this);
//     this.state = {
//       sizes: [],
//       size: "",
//       price: 0,
//       cellEditProps: {
//         mode: "click",
//         blurToSave: true,
//         beforeSaveCell(oldValue, newValue, row, column, done) {
//           if (window.confirm("Apply Changes?")) {
//             axios
//               .post("/size/update/" + row._id, row)
//               .then(res => {
//                 notifications.addNotification({
//                   message: res.data,
//                   type: "success",
//                   insert: "top",
//                   container: "bottom-right",
//                   dismiss: {
//                     duration: 5000
//                   }
//                 });
//               })
//               .catch(err => {
//                 console.log(err);
//                 notifications.addNotification({
//                   message: "Update Error",
//                   type: "danger",
//                   insert: "top",
//                   container: "bottom-right",
//                   dismiss: {
//                     duration: 5000
//                   }
//                 });
//               });
//             done(); // contine to save the changes
//           } else {
//             notifications.addNotification({
//               message: "action Cancelled",
//               type: "danger",
//               insert: "top",
//               container: "bottom-right",
//               dismiss: {
//                 duration: 5000
//               }
//             });
//             done(false); // reject the changes
//           }
//           return { async: true };
//         }
//       }
//     };
//   }
//   onChange = e => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   componentDidMount() {
//     this.getSizes();
//   }
//   getSizes() {
//     axios
//       .get("/size/")
//       .then(res => {
//         this.setState({
//           sizes: res.data
//         });
//       })
//       .catch(err => console.log(err));
//   }
//   handleDelete(size) {
//     if (window.confirm("Delete size?" + size.size)) {
//       axios
//         .get("/size/delete/" + size._id)
//         .then(res => {
//           notifications.addNotification({
//             message: res.data,
//             type: "success",
//             insert: "top",
//             container: "bottom-right",
//             dismiss: {
//               duration: 5000
//             }
//           });
//           this.getSizes();
//         })
//         .catch(err => {});
//     } else {
//       notifications.addNotification({
//         message: "action Cancelled",
//         type: "danger",
//         insert: "top",
//         container: "bottom-right",
//         dismiss: {
//           duration: 5000
//         }
//       });
//     }
//   }
//   addSizeAction(e) {
//     e.preventDefault();
//     const size = {
//       size: this.state.size,
//       price: this.state.price
//     };
//     axios
//       .post("/size/add", size)
//       .then(res => {
//         notifications.addNotification({
//           message: res.data.size,
//           type: "success",
//           insert: "top",
//           container: "bottom-right",
//           dismiss: {
//             duration: 2000
//           }
//         });
//         this.getSizes();
//         this.setState({ size: 10 });
//       })
//       .catch(err =>
//         notifications.addNotification({
//           message: err.data,
//           type: "danger",
//           insert: "top",
//           container: "bottom-right",
//           dismiss: {
//             duration: 2000
//           }
//         })
//       );
//   }
//   render() {
//     const { size, sizes, price, cellEditProps } = this.state;
//     const columns = [
//       { dataField: "_id", text: "ID", hidden: true },
//       { dataField: "size", text: "Sizes" },
//       { dataField: "price", text: "price" },
//       {
//         dataField: "databasePkey",
//         text: "Remove",
//         editable: false,
//         formatter: (cellContent, sizes) => {
//           return (
//             <button
//               className="btn btn-danger btn-xs"
//               onClick={() => this.handleDelete(sizes)}
//             >
//               x
//             </button>
//           );
//         }
//       }
//     ];
//     return (
//       <div className="row">
//         <div className="col-12 col-md-4">
//           <h5>Add Size</h5>
//           <Form onSubmit={this.addSizeAction} className="pb-4">
//             <div className="form-group">
//               <label className="col-form-label" htmlFor="size">
//                 size
//               </label>
//               <input
//                 type="text"
//                 name="size"
//                 value={size}
//                 step="2"
//                 onChange={this.onChange}
//                 placeholder="Size"
//                 className="form-control"
//               />
//             </div>
//             <div className="form-group">
//               <label className="col-form-label" htmlFor="price">
//                 Price
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={price}
//                 step=".01"
//                 onChange={this.onChange}
//                 placeholder="Price"
//                 className="form-control"
//               />
//             </div>

//             <button className="btn btn-outline-secondary" type="submit">
//               Add Size
//             </button>
//           </Form>
//         </div>
//         <div className="col-12 col-md-8">
//           <h5>Click to edit Sizes</h5>
//           <BootstrapTable
//             keyField="_id"
//             data={sizes}
//             columns={columns}
//             cellEdit={cellEditFactory(cellEditProps)}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default Size;
