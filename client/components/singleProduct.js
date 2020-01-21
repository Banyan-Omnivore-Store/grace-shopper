/* eslint-disable no-unused-expressions */
import React from 'react'
import {connect} from 'react-redux'
import {fetchSingleProduct, createNewReviewThunk} from '../store/product'
import {addToCart, fetchCart} from '../store/cart'
import {Container, Grid, Image, GridColumn} from 'semantic-ui-react'

class UnconnectedSingleProduct extends React.Component {
  constructor() {
    super()
    this.addToCartButtonClickHandler = this.addToCartButtonClickHandler.bind(
      this
    )
    this.quantityChangeHandler = this.quantityChangeHandler.bind(this)
    this.state = {
      value: 1,
      reviewRating: 1,
      reviewText: ''
    }
  }

  componentDidMount() {
    const productId = this.props.match.params.productId
    this.props.fetchSingleProduct(productId)
  }

  async addToCartButtonClickHandler(cartId, productId, quantity) {
    await addToCart(cartId, productId, quantity)
  }

  quantityChangeHandler(event) {
    this.setState({value: event.target.value})
  }

  addReviewButtonClickHandler(userId, productId, rating, reviewText) {
    const newReviewObject = {
      rating,
      comment: reviewText,
      userId: userId.id,
      productId
    }
    try {
      event.preventDefault()
      this.props.createReview(newReviewObject)
    } catch (err) {
      console.log(err)
    }
  }

  reviewRatingChangeHandler(event) {
    let rating = Number(event.target.value)
    this.setState({reviewRating: rating})
  }

  reviewTextChangeHandler(event) {
    let text = event.target.value
    this.setState({reviewText: text})
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
    num = Math.round(num)
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
        <br />
        <br />
        <br />
        <Container>
          <Grid columns={2} divided>
            <Grid.Row>
              <GridColumn>
                <Image src={this.props.singleProduct.imageUrl} />
              </GridColumn>
              <GridColumn>
                <Container textAlign="right">
                  <h2>{this.props.singleProduct.productName}</h2>
                  <h4>Average Rating: {this.numStarConverter(avgRating)} </h4>
                  <h4>${this.props.singleProduct.price}</h4>
                  <p>Description: {this.props.singleProduct.description}</p>
                  <div>{this.props.singleProduct.inventory} in stock</div>
                  <br />
                  <div>
                    <select
                      onChange={event => this.quantityChangeHandler(event)}
                    >
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
                          this.props.cart.id,
                          this.props.singleProduct.id,
                          this.state.value
                        )
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                </Container>
                <Container textAlign="right">
                  <div id="reviews">
                    <br />
                    <h3>Reviews...</h3>
                    {this.props.singleProduct.reviews ? (
                      <div>
                        <div id="pre-existing_reviews">
                          {this.props.singleProduct.reviews.map(review => (
                            <div key={review.id}>
                              <div>
                                Rated: {this.numStarConverter(review.rating)}
                              </div>
                              <div>Comment: {review.comment}</div>
                              <div>Comment by: {review.user.firstName}</div>
                              <p>
                                On: {review.createdAt.slice(5, 7)}/{review.createdAt.slice(
                                  8,
                                  10
                                )}/{review.createdAt.slice(0, 4)}
                              </p>
                              <br />
                            </div>
                          ))}
                        </div>
                        <h4>Add a review...</h4>
                      </div>
                    ) : (
                      <div>
                        <h4>
                          This product has no reviews yet! Be the first to
                          review!
                        </h4>
                      </div>
                    )}
                    <div id="add_review">
                      <input
                        type="text"
                        onChange={event => this.reviewTextChangeHandler(event)}
                        value={this.state.reviewText}
                      />
                      <br />
                      <select
                        onChange={event =>
                          this.reviewRatingChangeHandler(event)
                        }
                        value={this.state.reviewRating}
                      >
                        <option value="1">*</option>
                        <option value="2">**</option>
                        <option value="3">***</option>
                        <option value="4">****</option>
                        <option value="5">*****</option>
                      </select>
                      <br />
                      <button
                        type="submit"
                        onClick={async () => {
                          if (this.props.user.firstName) {
                            this.addReviewButtonClickHandler(
                              this.props.user,
                              this.props.singleProduct.id,
                              this.state.reviewRating,
                              this.state.reviewText
                            )
                            await this.props.fetchSingleProduct(
                              this.props.match.params.productId
                            )
                            this.setState({reviewRating: 1})
                            this.setState({reviewText: ''})
                          } else {
                            alert('Please log in to post a review!')
                          }
                        }}
                      >
                        Add Your Review
                      </button>
                    </div>
                  </div>
                </Container>
              </GridColumn>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    ) : (
      <div>Loading...</div>
    )
  }
}

const mapStateToProps = state => {
  return {
    singleProduct: state.product.singleProduct,
    user: state.user,
    cart: state.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchSingleProduct: productId => dispatch(fetchSingleProduct(productId)),
    createReview: (userId, productId, rating, reviewText) =>
      dispatch(createNewReviewThunk(userId, productId, rating, reviewText)),
    fetchCart: () => dispatch(fetchCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  UnconnectedSingleProduct
)
