//import react to access JSX, be able to create react functional component
import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {
  setProducts,
  fetchProducts,
  fetchDesiredProducts
} from '../store/products'
import {fetchCategories} from '../store/categories'
import {addToCart, fetchCart} from '../store/cart'
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
class AllProducts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchText: '',
      displayProducts: [],
      selectedCategoryName: ''
    }
    this.selectCategory = this.selectCategory.bind(this)
  }

  async componentDidMount() {
    await this.props.fetchProducts()
    await this.props.fetchCategories()
    this.setState({
      displayProducts: this.props.products,
      selectedCategoryName: this.props.products
    })
  }
  searchChangeHandler(event) {
    this.setState({searchText: event.target.value})
  }

  renderAllProducts() {
    this.setState({searchText: '', selectedCategoryName: ''})
  }

  selectCategory(event) {
    this.setState({selectedCategoryName: JSON.parse(event.target.value)})
  }

  render() {
    if (this.props.products.length === 0) {
      return <div>No Products</div>
    } else if (this.props.products) {
      return (
        <Container>
          <br />
          <br />
          <div className="wrapper">
            <div className="search_capabilities">
              <h4> Search by product name: </h4>
              <Input
                type="text"
                onChange={event => this.searchChangeHandler(event)}
                value={this.state.searchText}
                focus
                placeholder="Search..."
              />
              <br />
              <Button type="submit" onClick={() => this.renderAllProducts()}>
                Return to All Products
              </Button>
              <h4>Search by category: </h4>
              {/* couldn't get semantic drop down to work, wasn't sending the category/product object you have set up */}
              {/* <Dropdown
                placeholder="Select Category"
                fluid
                value={this.state.selectedCategoryName}
                selection
                onChange={this.selectCategory}
                options={this.props.categories.map(category => {
                  return {
                    key: category.name,
                    text: category.name,
                    value: category.id
                  }
                })} */}
              {/* /> */}
              <select onChange={this.selectCategory}>
                <option value={JSON.stringify(this.props.products)}>
                  See all products
                </option>
                {this.props.categories.map(category => (
                  <option
                    key={category.id}
                    value={JSON.stringify(category.products)}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <Grid columns={4} divided>
                {this.state.displayProducts.map((product, index) => {
                  if (
                    product.productName
                      .toLowerCase()
                      .includes(this.state.searchText.toLowerCase()) &&
                    this.state.selectedCategoryName.filter(
                      categoryProd => categoryProd.id === product.id
                    ).length
                  )
                    return (
                      <Grid.Column key={index}>
                        <Card>
                          <Image
                            src={product.imageUrl}
                            height="50px"
                            wrapped
                            ui={false}
                          />
                          <Card.Content
                            as={NavLink}
                            to={`/products/${product.id}`}
                          >
                            <Card.Header>{product.productName}</Card.Header>
                            <Card.Meta>
                              <span className="category">
                                Tags:
                                {product.categories
                                  .map(catObj => catObj.name)
                                  .join(', ')}
                              </span>
                            </Card.Meta>
                            <Card.Description>
                              {product.description}
                            </Card.Description>
                          </Card.Content>
                          <Card.Content extra>
                            Price: ${product.price}
                          </Card.Content>
                          <Card.Content extra>
                            <div>
                              <a
                                onClick={async () => {
                                  await addToCart(
                                    this.props.cart.id,
                                    product.id,
                                    1
                                  )
                                  await this.props.fetchCart()
                                }}
                              >
                                <Icon name="add to cart" />
                                Add to Cart
                              </a>
                            </div>
                          </Card.Content>
                        </Card>
                      </Grid.Column>
                    )
                })}
              </Grid>
            </div>
          </div>
        </Container>
      )
    } else {
      //in the event this is rendered before the props have been fetched and passed down
      return <div>No products meet those specifications...</div>
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  products: state.products,
  cart: state.cart,
  categories: state.categories
})

const mapDispatchToProps = dispatch => {
  return {
    setProducts: products => dispatch(setProducts(products)),
    fetchProducts: () => dispatch(fetchProducts()),
    fetchCart: () => dispatch(fetchCart()),
    fetchCategories: () => dispatch(fetchCategories()),
    fetchDesiredProducts: () => dispatch(fetchDesiredProducts())
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllProducts)
)
