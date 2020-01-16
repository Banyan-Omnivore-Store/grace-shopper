//import react to access JSX, be able to create react functional component
import React from 'react'
import {connect} from 'react-redux'
import {setOrder, fetchOrder} from '../store/orders'

//export functional component which maps through props.products
class SingleOrder extends React.Component {
  componentDidMount() {
    this.props.fetchOrder(this.props.match.params.orderId)
  }

  componentWillUnmount() {
    this.props.setOrder({})
  }

  render() {
    if (this.props.order.length === 0) {
      return <div>No Order Yet!</div>
    } else {
      return (
        <div className="order">
          <div className="order-info">
            <div className="order-info-text">
              Details for Order Number: {this.props.order.id}
            </div>
          </div>
          <div className="order-details">
            <div className="order-details_items">
              <p>Status: {order.status}</p>
              <p>Total: {order.cartTotal}</p>
              <p>Items: </p>
              {order.products.map(product => (
                <div className="order-product" key={product.id}>
                  <div>{product.productName}</div>
                  <div>Quantity: {product.orderItems.quantity}</div>
                  <div>Price: {product.orderItems.purchasePrice}</div>
                  <img src={product.imageUrl} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  order: state.order
})

const mapDispatchToProps = dispatch => {
  return {
    setOrder: orderObj => dispatch(setOrder(orderObj)),
    fetchOrder: orderId => dispatch(fetchOrder(orderId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleOrder)
