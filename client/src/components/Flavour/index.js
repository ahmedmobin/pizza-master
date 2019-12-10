import React, { useState, useEffect, useCallback } from "react";
import { Form } from "../Layout";
import axios from "axios";
import { store as notifications } from "react-notifications-component";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
const Flavour = () => {
  //const [ date, setDate ] = useState(new Date());
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
          notifications.addNotification({
            message: res.data,
            type: "success",
            insert: "top",
            container: "bottom-right",
            dismiss: {
              duration: 5000
            }
          });
          getMenu();
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
        notifications.addNotification({
          message: res.data.menu,
          type: "success",
          insert: "top",
          container: "bottom-right",
          dismiss: {
            duration: 2000
          }
        });
        getMenu();
        setName("");
        setPrice(7);
        setDesc("");
        setUrl("");
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
  console.log("pizzaFlavor", pizzaFlavor);
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
// class Flavour extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.addPizzaAction = this.addPizzaAction.bind(this);
// 		this.handleDelete = this.handleDelete.bind(this);
// 		this.state = {
// 			pizzaFlavor: [],
// 			date: new Date(),
// 			name: "",
// 			desc: "",
// 			url: "",
// 			price: 7.25,
// 			cellEditProps: {
// 				mode: "click",
// 				blurToSave: true,
// 				beforeSaveCell(oldValue, newValue, row, column, done) {
// 					if (window.confirm("Apply Changes?")) {
// 						Axios.post("/menu/update/" + row._id, row)
// 							.then(res => {
// 								notifications.addNotification({
// 									message: res.data,
// 									type: "success",
// 									insert: "top",
// 									container: "bottom-right",
// 									dismiss: {
// 										duration: 5000
// 									}
// 								});
// 							})
// 							.catch(err => {
// 								console.log(err);
// 								notifications.addNotification({
// 									message: "Update Error",
// 									type: "danger",
// 									insert: "top",
// 									container: "bottom-right",
// 									dismiss: {
// 										duration: 5000
// 									}
// 								});
// 							});
// 						done(); // contine to save the changes
// 					} else {
// 						notifications.addNotification({
// 							message: "action Cancelled",
// 							type: "danger",
// 							insert: "top",
// 							container: "bottom-right",
// 							dismiss: {
// 								duration: 5000
// 							}
// 						});
// 						done(false); // reject the changes
// 					}
// 					return { async: true };
// 				}
// 			}
// 		};
// 	}

// 	componentDidMount() {
// 		this.getMenu();
// 	}
// 	handleDelete(pizzaFlavor) {
// 		if (window.confirm("Delete Flavor?" + pizzaFlavor.name)) {
// 			Axios.get("/menu/delete/" + pizzaFlavor._id)
// 				.then(res => {
// 					notifications.addNotification({
// 						message: res.data,
// 						type: "success",
// 						insert: "top",
// 						container: "bottom-right",
// 						dismiss: {
// 							duration: 5000
// 						}
// 					});
// 					this.getMenu();
// 				})
// 				.catch(err => {});
// 		} else {
// 			notifications.addNotification({
// 				message: "action Cancelled",
// 				type: "danger",
// 				insert: "top",
// 				container: "bottom-right",
// 				dismiss: {
// 					duration: 5000
// 				}
// 			});
// 		}
// 	}

// 	getMenu() {
// 		Axios.get("/menu/")
// 			.then(res => {
// 				this.setState({
// 					pizzaFlavor: res.data
// 				});
// 			})
// 			.catch(err => console.log(err));
// 	}

// 	onChange = e => {
// 		this.setState({ [e.target.name]: e.target.value });
// 	};

// 	addPizzaAction(e) {
// 		e.preventDefault();
// 		const pizza = {
// 			name: this.state.name,
// 			description: this.state.desc,
// 			url: this.state.url,
// 			price: this.state.price
// 		};
// 		Axios.post("/menu/add", pizza)
// 			.then(res => {
// 				notifications.addNotification({
// 					message: res.data.menu,
// 					type: "success",
// 					insert: "top",
// 					container: "bottom-right",
// 					dismiss: {
// 						duration: 2000
// 					}
// 				});
// 				this.getMenu();
// 				this.setState({ name: "", price: 7, desc: "", url: "" });
// 			})
// 			.catch(err =>
// 				notifications.addNotification({
// 					message: err.data,
// 					type: "danger",
// 					insert: "top",
// 					container: "bottom-right",
// 					dismiss: {
// 						duration: 2000
// 					}
// 				})
// 			);
// 	}
// 	render() {
// 		const { name, desc, url, price, pizzaFlavor, cellEditProps } = this.state;
// 		const columns = [
// 			{ dataField: "_id", text: "ID", hidden: true },
// 			{ dataField: "name", text: "Flavor" },
// 			{ dataField: "description", text: "Description" },
// 			{ dataField: "price", text: "Price" },
// 			{
// 				dataField: "databasePkey",
// 				text: "Remove",
// 				editable: false,
// 				formatter: (cellContent, pizzaFlavor) => {
// 					return (
// 						<button
// 							className="btn btn-danger btn-xs"
// 							onClick={() => this.handleDelete(pizzaFlavor)}
// 						>
// 							x
// 						</button>
// 					);
// 				}
// 			}
// 		];
// 		return (
// 			<div className="row">
// 				<div className="col-12 col-md-4">
// 					<h5>Add Flavor</h5>
// 					<Form onSubmit={this.addPizzaAction} className="pb-4">
// 						<div className="form-group">
// 							<label className="col-form-label" htmlFor="name">
// 								Flavor
// 							</label>
// 							<input
// 								type="text"
// 								name="name"
// 								value={name}
// 								onChange={this.onChange}
// 								placeholder="Flavor"
// 								className="form-control"
// 							/>
// 						</div>
// 						<div className="form-group">
// 							<label className="col-form-label" htmlFor="desc">
// 								Description
// 							</label>
// 							<input
// 								type="text"
// 								name="desc"
// 								value={desc}
// 								onChange={this.onChange}
// 								placeholder="Description"
// 								className="form-control"
// 							/>
// 						</div>
// 						<div className="form-group">
// 							<label className="col-form-label" htmlFor="inputDefault">
// 								Image Url
// 							</label>
// 							<input
// 								type="text"
// 								name="url"
// 								value={url}
// 								onChange={this.onChange}
// 								placeholder="Image Url"
// 								className="form-control"
// 							/>
// 						</div>
// 						<div className="form-group">
// 							<label className="col-form-label" htmlFor="inputDefault">
// 								Price
// 							</label>
// 							<input
// 								type="number"
// 								name="price"
// 								value={price}
// 								step="0.25"
// 								onChange={this.onChange}
// 								placeholder="Price"
// 								className="form-control"
// 							/>
// 						</div>

// 						<button className="btn btn-outline-secondary" type="submit">
// 							Add Pizza
// 						</button>
// 					</Form>
// 				</div>
// 				<div className="col-12 col-md-8">
// 					<h5>Click to edit Flavors</h5>
// 					<BootstrapTable
// 						keyField="_id"
// 						data={pizzaFlavor}
// 						columns={columns}
// 						cellEdit={cellEditFactory(cellEditProps)}
// 					/>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// export default Flavour;
