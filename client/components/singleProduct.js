import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleProduct} from '../store/product'

class UnconnectedSingleProduct extends React.Component {
  constructor() {
    super()
    this.addToCartButtonClickHandler = this.addToCartButtonClickHandler.bind(
      this
    )

    this.state = {value: 1}
  }

  componentDidMount() {
    const productId = this.props.match.params.productId
    this.props.fetchSingleProduct(productId)
  }

  addToCartButtonClickHandler(productId, quantity) {
    console.log(productId, quantity)
  }

  arrMaker(number) {
    let numArr = []
    for (let i = 1; i < number + 1; i++) {
      numArr.push(i)
    }
    return numArr
  }

  render() {
    let inventoryArr = this.arrMaker(this.props.singleProduct.inventory)
    return this.props.singleProduct ? (
      <div>
        <img src={this.props.singleProduct.imageUrl} />
        <h3>{this.props.singleProduct.productName}</h3>
        <h4>${this.props.singleProduct.price}</h4>
        <div>{this.props.singleProduct.inventory} in stock</div>
        <p>{this.props.singleProduct.description}</p>

        <div>
          <select>
            {inventoryArr.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              this.addToCartButtonClickHandler(this.props.singleProduct.id, 1)
            }
          >
            Add to Cart
          </button>
        </div>
      </div>
    ) : (
      <div>Loading...</div>
    )
  }
}

const mapStateToProps = state => {
  return {
    singleProduct: state.product.singleProduct
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSingleProduct: productId => dispatch(fetchSingleProduct(productId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  UnconnectedSingleProduct
)
