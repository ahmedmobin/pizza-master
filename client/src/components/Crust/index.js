import React, { useEffect, useState, useCallback } from "react";
import { Form } from "../Layout";
import axios from "axios";
import { store as notifications } from "react-notifications-component";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
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
  const handleDelete = pizzaFlavor => {
    if (window.confirm("Delete Flavor?" + pizzaFlavor.name)) {
      axios
        .get("/crusts/delete/" + pizzaFlavor._id)
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
          getCrusts();
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
        notifications.addNotification({
          message: res.data.crust,
          type: "success",
          insert: "top",
          container: "bottom-right",
          dismiss: {
            duration: 2000
          }
        });
        getCrusts();
        //setState({ crust: "" });
        setCrust("");
      })
      .catch(err =>
        notifications.addNotification({
          message: err.data,
          type: "danger",
          insert: "top",
          container: "bottom-right",
          dismiss: {
            duration: 2000
          }
        })
      );
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
// class Crust extends React.Component {
//   constructor(props) {
//     super(props);
//     this.addCrustAction = this.addCrustAction.bind(this);
//     this.handleDelete = this.handleDelete.bind(this);
//     this.state = {
//       crusts: [],
//       crust: "",
//       price: 0,
//       cellEditProps: {
//         mode: "click",
//         blurToSave: true,
//         beforeSaveCell(oldValue, newValue, row, column, done) {
//           if (window.confirm("Apply Changes?")) {
//             axios
//               .post("/crusts/update/" + row._id, row)
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

//   componentDidMount() {
//     this.getCrusts();
//   }
//   handleDelete(pizzaFlavor) {
//     if (window.confirm("Delete Flavor?" + pizzaFlavor.name)) {
//       axios
//         .get("/crusts/delete/" + pizzaFlavor._id)
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
//           this.getCrusts();
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

//   getCrusts() {
//     axios
//       .get("/crusts/")
//       .then(res => {
//         this.setState({
//           crusts: res.data
//         });
//       })
//       .catch(err => console.log(err));
//   }

//   onChange = e => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   addCrustAction(e) {
//     e.preventDefault();
//     const crust = {
//       name: this.state.crust,
//       price: this.state.price
//     };
//     axios
//       .post("/crusts/add", crust)
//       .then(res => {
//         notifications.addNotification({
//           message: res.data.crust,
//           type: "success",
//           insert: "top",
//           container: "bottom-right",
//           dismiss: {
//             duration: 2000
//           }
//         });
//         this.getCrusts();
//         this.setState({ crust: "" });
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
//     const { crust, crusts, price, cellEditProps } = this.state;
//     const columns = [
//       { dataField: "_id", text: "ID", hidden: true },
//       { dataField: "name", text: "Crusts" },
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
//           <h5>Add Crust Type</h5>
//           <Form onSubmit={this.addCrustAction} className="pb-4">
//             <div className="form-group">
//               <label className="col-form-label sr-only" htmlFor="crust">
//                 Crust
//               </label>
//               <input
//                 type="text"
//                 name="crust"
//                 value={crust}
//                 onChange={this.onChange}
//                 placeholder="Crust Type"
//                 className="form-control"
//               />
//             </div>
//             <div className="form-group">
//               <label className="col-form-label" htmlFor="price">
//                 Price
//               </label>
//               <input
//                 type="number"
//                 step="0.1"
//                 name="price"
//                 value={price}
//                 onChange={this.onChange}
//                 placeholder="Price"
//                 className="form-control"
//               />
//             </div>

//             <button className="btn btn-outline-secondary" type="submit">
//               Add Crust
//             </button>
//           </Form>
//         </div>
//         <div className="col-12 col-md-8">
//           <h5>Click to edit Crusts</h5>
//           <BootstrapTable
//             keyField="_id"
//             data={crusts}
//             columns={columns}
//             cellEdit={cellEditFactory(cellEditProps)}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default Crust;
