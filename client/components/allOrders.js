//import react to access JSX, be able to create react functional component
import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {setOrders, fetchOrders} from '../store/orders'

//export functional component which maps through props.products
class AllOrders extends React.Component {
  componentDidMount() {
    this.props.fetchOrders()
  }

  componentWillUnmount() {
    this.props.setOrders([])
  }

  render() {
    if (this.props.orders.length === 0) {
      return <div>No Orders Yet!</div>
    } else {
      return (
        <div className="orders">
          <div className="orders-info">
            <div className="orders-info-text">Past orders</div>
          </div>
          <div className="orders-list">
            {this.props.orders.map(order => (
              <div key={order.id} className="orders-list_item">
                <NavLink to={`/orders/${order.id}`} activeClassName="active">
                  <h2>Order number: {order.id}</h2>
                </NavLink>
                <p>Status: {order.status}</p>
                <p>Total: {order.cartTotal}</p>
                <p>Items: </p>
                {order.products.map(product => (
                  <div className="orders-product" key={product.id}>
                    {`${product.productName} ${product.orderItems.quantity}`}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  orders: state.orders
})

const mapDispatchToProps = dispatch => {
  return {
    setOrders: ordersArr => dispatch(setOrders(ordersArr)),
    fetchOrders: () => dispatch(fetchOrders())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllOrders)
)
