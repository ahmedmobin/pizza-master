
import React from "react";
import { Form } from "../Layout";
import Axios from "axios";
import { store as notifications } from "react-notifications-component";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

class Size extends React.Component {
	constructor(props) {
		super(props);
		this.addSizeAction = this.addSizeAction.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.state = {
			sizes: [],
			size: "",
			price: 0,
			cellEditProps: {
				mode: "click",
				blurToSave: true,
				beforeSaveCell(oldValue, newValue, row, column, done) {
					if (window.confirm("Apply Changes?")) {
						Axios.post("/size/update/" + row._id, row)
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
			}
		};
	}
	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	componentDidMount() {
		this.getSizes();
	}
	getSizes() {
		Axios.get("/size/")
			.then(res => {
				this.setState({
					sizes: res.data
				});
			})
			.catch(err => console.log(err));
	}
	handleDelete(size) {
		if (window.confirm("Delete size?" + size.size)) {
			Axios.get("/size/delete/" + size._id)
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
					this.getSizes();
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
	}
	addSizeAction(e) {
		e.preventDefault();
		const size = {
			size: this.state.size,
			price: this.state.price
		};
		Axios.post("/size/add", size)
			.then(res => {
				notifications.addNotification({
					message: res.data.size,
					type: "success",
					insert: "top",
					container: "bottom-right",
					dismiss: {
						duration: 2000
					}
				});
				this.getSizes();
				this.setState({ size: 10 });
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
	}
	render() {
		const { size, sizes, price, cellEditProps } = this.state;
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
							onClick={() => this.handleDelete(sizes)}
						>
							x
						</button>
					);
				}
			}
		];
		return (
			<div className="row">
				<div className="col-12 col-md-4">
					<h5>Add Size</h5>
					<Form onSubmit={this.addSizeAction} className="pb-4">
						<div className="form-group">
							<label className="col-form-label" htmlFor="size">
								size
							</label>
							<input
								type="text"
								name="size"
								value={size}
								step="2"
								onChange={this.onChange}
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
								onChange={this.onChange}
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
	}
}

export default Size;