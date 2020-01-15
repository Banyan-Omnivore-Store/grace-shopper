/* eslint-disable no-unused-expressions */
import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleProduct} from '../store/product'

class UnconnectedSingleProduct extends React.Component {
  constructor() {
    super()
    this.addToCartButtonClickHandler = this.addToCartButtonClickHandler.bind(
      this
    )
    this.quantityChangeHandler = this.quantityChangeHandler.bind(this)
    this.state = {value: 1}
  }

  componentDidMount() {
    const productId = this.props.match.params.productId
    this.props.fetchSingleProduct(productId)
  }

  addToCartButtonClickHandler(productId, quantity) {
    console.log(productId, Number(quantity))
  }

  quantityChangeHandler(event) {
    this.setState({value: event.target.value})
  }

  arrMaker(number) {
    let numArr = []
    for (let i = 1; i < number + 1 && i < 11; i++) {
      numArr.push(i)
    }
    return numArr
  }

  avgRating(productRevArr) {
    if (productRevArr) {
      let sum = 0
      for (let i = 0; i < productRevArr.length; i++) {
        sum += productRevArr[i].rating
      }
      return sum / productRevArr.length
    }
  }

  numStarConverter(num) {
    if (num === 1) {
      return '*'
    } else if (num === 2) {
      return '**'
    } else if (num === 3) {
      return '***'
    } else if (num === 4) {
      return '****'
    } else if (num === 5) {
      return '*****'
    }
  }

  render() {
    let inventoryArr = this.arrMaker(this.props.singleProduct.inventory)
    let avgRating = this.avgRating(this.props.singleProduct.reviews)
    return this.props.singleProduct ? (
      <div id="product">
        <img src={this.props.singleProduct.imageUrl} />
        <h3>{this.props.singleProduct.productName}</h3>
        <h4>Average Rating: {this.numStarConverter(avgRating)} </h4>
        <h4>${this.props.singleProduct.price}</h4>
        <p>Description: {this.props.singleProduct.description}</p>
        <div>{this.props.singleProduct.inventory} in stock</div>

        <div>
          <select onChange={event => this.quantityChangeHandler(event)}>
            {inventoryArr.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              this.addToCartButtonClickHandler(
                this.props.singleProduct.id,
                this.state.value
              )
            }
          >
            Add to Cart
          </button>
        </div>
        <div id="reviews">
          {this.props.singleProduct.reviews ? (
            <div>
              <div id="pre-existing_reviews">
                {this.props.singleProduct.reviews.map(review => (
                  <div key={review.id}>
                    <div>Rated: {this.numStarConverter(review.rating)}</div>
                    <div>Comment: {review.comment}</div>
                    <p>
                      On: {review.createdAt.slice(5, 7)}/{review.createdAt.slice(
                        8,
                        10
                      )}/{review.createdAt.slice(0, 4)}
                    </p>
                  </div>
                ))}
              </div>
              <h4>Add a review...</h4>
            </div>
          ) : (
            <div>
              <h4>This product has no reviews yet! Be the first to review!</h4>
            </div>
          )}
          <div id="add_review">
            <input type="text" />
            <select name="start">
              <option value="1">*</option>
              <option value="2">**</option>
              <option value="3">***</option>
              <option value="4">****</option>
              <option value="5">*****</option>
            </select>
            <button type="submit">Add Your Review</button>
            {/* this button should add a rating to the database */}
            {/* this button should take you to a "thank you for your comments" page */}
          </div>
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
