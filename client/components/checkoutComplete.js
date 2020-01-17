import React from 'react'

class CheckoutComplete extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchCart()
  }

  render() {
    const {order} = this.props
    return (
      <div className="checkout-complete">
        <div className="checkout-complete-info">
          <div className="checkout-complete-info_text">
            Thank you for placing your order!
          </div>
          <div className="checkout-complete-info_text">Your order: </div>
        </div>
        <div className="checkout-complete-items">
          <div className="checkout-complete-items_count">{`${
            order.products.length
          } item(s) total`}</div>
          {order.products.map(product => (
            <div className="checkout-complete-item" key={product.id}>
              <div className="checkout-complete-item_field">
                {product.productName}
              </div>
              <div className="checkout-complete-item_field">
                Unit Price: {product.orderItems.purchasePrice}
              </div>
              <div className="checkout-complete-item_field">
                Quantity: {product.orderItems.quantity}
              </div>
              <img
                src={product.imageUrl}
                height="200px"
                className="checkout-complete-item_field"
              />
            </div>
          ))}
          <div className="checkout-complete-item_field">
            Total: {order.cartTotal}
          </div>
        </div>
      </div>
    )
  }
}

export default CheckoutComplete
