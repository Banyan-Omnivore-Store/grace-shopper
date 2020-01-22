import React from 'react'
import {Container, Grid, Image, GridColumn} from 'semantic-ui-react'

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
        <Container>
          <br />
          <br />
          <br />
          <div className="checkout-complete-info">
            <h2 className="checkout-complete-info_text">
              Thank you for your order!
            </h2>
            <h3 className="checkout-complete-info_text">Your order: </h3>
            <br />
          </div>
          <Grid columns={2} divided>
            <GridColumn>
              <h3 className="checkout-complete-item_field">
                {`Total: $${order.cartTotal}`}
              </h3>
              <h3 className="checkout-complete-items_count">{`${
                order.products.length
              } item(s) total`}</h3>
            </GridColumn>
            <GridColumn>
              <div className="checkout-complete-items">
                {order.products.map(product => (
                  <div key={product.id} className="checkout-complete-item">
                    <Grid.Row>
                      <br />
                      <span>
                        <h4 className="checkout-complete-item_field">
                          {product.productName}
                        </h4>
                        <div className="checkout-complete-item_field">
                          Unit Price: ${product.orderItems.purchasePrice}
                        </div>
                        <div className="checkout-complete-item_field">
                          Quantity: {product.orderItems.quantity}
                        </div>
                      </span>
                    </Grid.Row>
                    <br />
                  </div>
                ))}
              </div>
            </GridColumn>
            {/* <GridColumn >
              {order.products.map(product => (
                <div className="checkout-complete-item" key={product.id}>
                  <Grid.Row>
                    <Image
                      src={product.imageUrl}
                      size="small"
                      className="checkout-complete-item_field"
                    />
                    <br />
                  </Grid.Row>
                </div>
              ))}
            </GridColumn> */}
          </Grid>
        </Container>
      </div>
    )
  }
}

export default CheckoutComplete
