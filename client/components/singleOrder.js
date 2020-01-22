//import react to access JSX, be able to create react functional component
import React from 'react'
import {connect} from 'react-redux'
import {NavLink, withRouter} from 'react-router-dom'
import {setOrder, fetchOrder, updateOrder} from '../store/order'
import {
  Container,
  Grid,
  Image,
  GridColumn,
  Button,
  Dropdown
} from 'semantic-ui-react'
import {me} from '../store'

//export functional component which maps through props.products
class SingleOrder extends React.Component {
  async componentDidMount() {
    await this.props.fetchOrder(this.props.match.params.orderId)
    await this.props.loadInitialData()
  }

  componentWillUnmount() {
    this.props.setOrder({})
  }

  render() {
    let cartStatusOptions = [
      'cart',
      'purchased',
      'shipped',
      'delivered',
      'canceled'
    ]
    let dropDown
    if (!this.props.order.id) {
      return (
        <Container>
          <br />
          <br />
          <div>No Order Yet!</div>
        </Container>
      )
    } else {
      let button
      if (this.props.user.userStatus === 'admin') {
        button = (
          <Button
            onClick={async () => {
              let orderStatus = document.getElementById('dropDownMenu')
                .innerText
              await this.props.updateOrder(orderStatus, this.props.order.id)
            }}
          >
            Change Order
          </Button>
        )
        dropDown = (
          <Dropdown
            fluid
            selection
            options={cartStatusOptions.map(anOption => {
              return {key: anOption, text: anOption, value: anOption}
            })}
            placeholder={this.props.order.status}
            id="dropDownMenu"
          />
        )
      } else {
        button = <div />
        dropDown = <div />
      }
      return (
        <div className="order">
          <Container>
            <br />
            <br />
            <Grid columns={2} divided>
              <GridColumn width={5}>
                <div className="order-info">
                  <h3 className="order-info-text">
                    Details for Order Number: {this.props.order.id}
                  </h3>
                </div>
                <div className="order-details">
                  <div className="order-details_items">
                    <h4>Status: {this.props.order.status}</h4>
                    <h4>Total: {this.props.order.cartTotal}</h4>
                  </div>
                </div>
              </GridColumn>
              <GridColumn width={6}>
                <h4>Items: </h4>
                <Container>
                  <Grid columns={2}>
                    <GridColumn width={10}>
                      {this.props.order.products.map(product => (
                        <div className="order-product" key={product.id}>
                          <Grid.Row>
                            <br />
                            <span>
                              <h4>{product.productName}</h4>
                              <div>Quantity: {product.orderItems.quantity}</div>
                              <div>
                                Price: {product.orderItems.purchasePrice}
                              </div>
                            </span>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                          </Grid.Row>
                        </div>
                      ))}
                    </GridColumn>
                    <GridColumn width={6}>
                      {this.props.order.products.map(product => (
                        <div className="order-product" key={product.id}>
                          <Grid.Row>
                            <Image src={product.imageUrl} size="small" />
                            <br />
                            <br />
                            <br />
                          </Grid.Row>
                        </div>
                      ))}
                    </GridColumn>
                  </Grid>
                </Container>
              </GridColumn>
            </Grid>
            {button} {dropDown}
          </Container>
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
    loadInitialData() {
      dispatch(me())
    },
    setOrder: orderObj => dispatch(setOrder(orderObj)),
    fetchOrder: orderId => dispatch(fetchOrder(orderId)),
    updateOrder: (newStatus, orderId) =>
      dispatch(updateOrder(newStatus, orderId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleOrder)
