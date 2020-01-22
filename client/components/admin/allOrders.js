//import react to access JSX, be able to create react functional component
import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {setOrders, fetchOrders, fetchAdminOrders} from '../../store/orders'
import {
  Grid,
  Image,
  Card,
  Icon,
  Container,
  Input,
  Button,
  Dropdown
} from 'semantic-ui-react'

//export functional component which maps through props.products
class AdminOrders extends React.Component {
  componentDidMount() {
    this.props.fetchAdminOrders()
  }

  componentWillUnmount() {
    this.props.setOrders([])
  }

  render() {
    //probably good to institute a check on user for admin here
    return (
      <Container>
        <Grid columns={4}>
          {this.props.orders.map((order, index) => (
            <Grid.Column key={index}>
              <Card width="100px">
                <Card.Content as={NavLink} to={`/orders/${order.id}`}>
                  <Card.Header>Order #: {order.id}</Card.Header>
                  <Card.Description>
                    <p>Items: </p>
                    {order.products.map(product => (
                      <div className="orders-product" key={product.id}>
                        {`${product.productName}: ${
                          product.orderItems.quantity
                        }`}
                      </div>
                    ))}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <p>User: {order.userId}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: {order.cartTotal}</p>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  orders: state.orders
})

const mapDispatchToProps = dispatch => {
  return {
    setOrders: ordersArr => dispatch(setOrders(ordersArr)),
    fetchOrders: () => dispatch(fetchOrders()),
    fetchAdminOrders: () => dispatch(fetchAdminOrders())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminOrders)
)
