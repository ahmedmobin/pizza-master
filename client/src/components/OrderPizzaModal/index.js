import React from "react";
import BModal from "react-bootstrap/Modal";
const OrderPizzaModal = props => {
  const { name, price, description, url } = props.selecteditem;
  const { sizes, crusts, onSubmit, toppings, show } = props;
  return (
    <BModal size="lg" show={show} {...props}>
      <form onSubmit={() => {}}>
        <div className="card">
          <input
            type="text"
            name="name"
            className="sr-only"
            onChange={() => {}}
            value={name}
          />
          <input
            type="text"
            name="price"
            className="sr-only"
            onChange={() => {}}
            value={price}
          />
          <input
            type="text"
            name="description"
            className="sr-only"
            onChange={() => {}}
            value={description}
          />
          <div className="row no-gutters">
            <div className="col-md-4">
              <img src={url} className="card-img" alt={name} />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text">
                  <small className="text-muted">Price: {price}$</small>
                </p>
                <h5>1- Select Pizza Size</h5>
                <div className="form-group">
                  {sizes.length
                    ? sizes.map(s => (
                        <div
                          key={s._id}
                          className="custom-control custom-radio custom-control-inline"
                        >
                          <input
                            type="radio"
                            id={s._id}
                            name="size"
                            value={s._id}
                            className="custom-control-input"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={s._id}
                          >
                            {s.size}&#x22;
                            {s.price > 0 ? (
                              <span className="price">+{s.price}$</span>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      ))
                    : "Oops! Manager has forgotten to add Pizza Sizes."}
                </div>
                <h5>2- Select Pizza Crust</h5>
                <div className="form-group">
                  {crusts.length
                    ? crusts.map(s => (
                        <div
                          key={s._id}
                          className="custom-control custom-radio custom-control-inline"
                        >
                          <input
                            type="radio"
                            id={s._id}
                            name="crust"
                            value={s._id}
                            className="custom-control-input"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={s._id}
                          >
                            {s.name}
                            {s.price > 0 ? (
                              <span className="price">+{s.price}$</span>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      ))
                    : "Oops! Manager has forgotten to add Crusts."}
                </div>
                <h5>3- Select Extra Topping</h5>
                <div className="form-group">
                  {toppings.length
                    ? toppings.map(s => (
                        <div
                          key={s._id}
                          className="custom-control custom-checkbox custom-control-inline"
                        >
                          <input
                            type="checkbox"
                            id={s._id}
                            name="toppings"
                            value={s._id}
                            className="custom-control-input"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={s._id}
                          >
                            {s.name}{" "}
                            {s.price > 0 ? (
                              <span className="price">+{s.price}$</span>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      ))
                    : "Oops! Manager has forgotten to add Pizza Toppings."}
                </div>
                <button
                  type="submit"
                  onSubmit={onSubmit}
                  className="btn btn-addtoorder"
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </BModal>
  );
};
export default OrderPizzaModal;
