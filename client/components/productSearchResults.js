import React from 'react'

class UnconnectedSearchResults extends React.Component {
  constructor() {
    super()
  }

  render() {
    return <div className="wrapper" />
  }
}

/* {this.state.filteredProducts.map(product => (
            <div key={product.id} className="product">
              <NavLink to={`/products/${product.id}`} activeClassName="active">
                <div>
                  <h2>{product.productName}</h2>
                </div>
              </NavLink>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              <img src={product.imageUrl} height="200px" width="250px" />
              <button
                type="button"
                onClick={async () => {
                  await addToCart(props.cart.id, product.id, 1)
                  await props.fetchCart()
                }}
              >
                Add to Cart
              </button>
            </div>
          ))} */
