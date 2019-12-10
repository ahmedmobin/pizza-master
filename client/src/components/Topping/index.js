import React, { useState, useEffect } from "react";
import { Form } from "../Layout";
import axios from "axios";
import { store as notifications } from "react-notifications-component";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

const Topping = () => {
  const [toppings, setToppings] = useState([]);
  const [topping, setTopping] = useState("");
  const [price, setPrice] = useState(0);
  useEffect(() => {
    getTopping();
  }, []);

  const getTopping = () => {
    axios
      .get("/topping/")
      .then(res => {
        setToppings(res.data);
      })
      .catch(err => console.log(err));
  };

  const addToppingAction = e => {
    e.preventDefault();
    const pizza = {
      name: topping,
      price: price
    };
    axios
      .post("/topping/add", pizza)
      .then(res => {
        notifications.addNotification({
          message: res.data.topping,
          type: "success",
          insert: "top",
          container: "bottom-right",
          dismiss: {
            duration: 2000
          }
        });
        getTopping();
        setTopping("");
        setPrice(0);
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
  const handleDelete = topping => {
    if (window.confirm("Delete Topping?" + topping.name)) {
      axios
        .get("/topping/delete/" + topping._id)
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
          this.getTopping();
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
    { dataField: "name", text: "Toppings" },
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
          .post("/topping/update/" + row._id, row)
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
        <h5>Add Topping</h5>
        <Form onSubmit={addToppingAction} className="pb-4">
          <div className="form-group">
            <label className="col-form-label" htmlFor="topping">
              Topping
            </label>
            <input
              type="text"
              name="topping"
              value={topping}
              onChange={e => setTopping(e.target.value)}
              placeholder="Topping"
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
            Add Toppings
          </button>
        </Form>
      </div>
      <div className="col-12 col-md-8">
        <h5>Click to edit Topping</h5>
        <BootstrapTable
          keyField="_id"
          data={toppings}
          columns={columns}
          cellEdit={cellEditFactory(cellEditProps)}
        />
      </div>
    </div>
  );
};

export default Topping;

// class Topping extends React.Component {
//   constructor(props) {
//     super(props);
//     this.addToppingAction = this.addToppingAction.bind(this);
//     this.handleDelete = this.handleDelete.bind(this);
//     this.state = {
//       toppings: [],
//       topping: "",
//       price: 0
//     };
//   }

//   onChange = e => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   componentDidMount() {
//     this.getTopping();
//   }

//   getTopping() {
//     axios
//       .get("/topping/")
//       .then(res => {
//         this.setState({
//           toppings: res.data
//         });
//       })
//       .catch(err => console.log(err));
//   }

//   addToppingAction(e) {
//     e.preventDefault();
//     const pizza = {
//       name: this.state.topping,
//       price: this.state.price
//     };
//     axios
//       .post("/topping/add", pizza)
//       .then(res => {
//         notifications.addNotification({
//           message: res.data.topping,
//           type: "success",
//           insert: "top",
//           container: "bottom-right",
//           dismiss: {
//             duration: 2000
//           }
//         });
//         this.getTopping();
//         this.setState({ topping: "", price: 0 });
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
//   handleDelete(topping) {
//     if (window.confirm("Delete Topping?" + topping.name)) {
//       axios
//         .get("/topping/delete/" + topping._id)
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
//           this.getTopping();
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
//   render() {
//     const { topping, toppings, price } = this.state;
//     const columns = [
//       { dataField: "_id", text: "ID", hidden: true },
//       { dataField: "name", text: "Toppings" },
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
//     const cellEditProps = {
//       mode: "click",
//       blurToSave: true,
//       beforeSaveCell(oldValue, newValue, row, column, done) {
//         if (window.confirm("Apply Changes?")) {
//           axios
//             .post("/topping/update/" + row._id, row)
//             .then(res => {
//               notifications.addNotification({
//                 message: res.data,
//                 type: "success",
//                 insert: "top",
//                 container: "bottom-right",
//                 dismiss: {
//                   duration: 5000
//                 }
//               });
//             })
//             .catch(err => {
//               console.log(err);
//               notifications.addNotification({
//                 message: "Update Error",
//                 type: "danger",
//                 insert: "top",
//                 container: "bottom-right",
//                 dismiss: {
//                   duration: 5000
//                 }
//               });
//             });
//           done(); // contine to save the changes
//         } else {
//           notifications.addNotification({
//             message: "action Cancelled",
//             type: "danger",
//             insert: "top",
//             container: "bottom-right",
//             dismiss: {
//               duration: 5000
//             }
//           });
//           done(false); // reject the changes
//         }
//         return { async: true };
//       }
//     };
//     return (
//       <div className="row">
//         <div className="col-12 col-md-4">
//           <h5>Add Topping</h5>
//           <Form onSubmit={this.addToppingAction} className="pb-4">
//             <div className="form-group">
//               <label className="col-form-label" htmlFor="topping">
//                 Topping
//               </label>
//               <input
//                 type="text"
//                 name="topping"
//                 value={topping}
//                 onChange={this.onChange}
//                 placeholder="Topping"
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
//               Add Toppings
//             </button>
//           </Form>
//         </div>
//         <div className="col-12 col-md-8">
//           <h5>Click to edit Topping</h5>
//           <BootstrapTable
//             keyField="_id"
//             data={toppings}
//             columns={columns}
//             cellEdit={cellEditFactory(cellEditProps)}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default Topping;
