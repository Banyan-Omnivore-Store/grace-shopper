import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleProduct} from '../store/product'

class UnconnectedSingleProduct extends React.Component {
  // constructor() {
  //     super();
  // };
  render() {
    console.log(this.props.singleProduct)
    return this.props.singleProduct ? (
      <div>
        <img src={this.props.singleProduct.imageUrl} />
        <h3>{this.props.singleProduct.productName}</h3>
        <h4>${this.props.singleProduct.price}</h4>
        <div>{this.props.singleProduct.inventory} in stock</div>
        <p>{this.props.singleProduct.description}</p>
      </div>
    ) : (
      <div>Loading...</div>
    )
  }
}

const mapStateToProps = state => {
  return {
    singleProduct: state.products.singleProduct
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
