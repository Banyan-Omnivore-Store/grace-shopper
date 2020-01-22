import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import history from '../history'
import {Button, Grid, Form, Segment, Header, Message} from 'semantic-ui-react'

/**
 * COMPONENT
 */
const Signup = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <Grid textAlign="center" style={{height: '70vh'}} verticalAlign="middle">
      <Grid.Column style={{maxWidth: 450}} textAlign="center">
        <Header as="h2" textAlign="center">
          Sign Up
        </Header>
        <Form size="massive" onSubmit={handleSubmit} name={name}>
          <Segment stacked textAlign="center">
            <Form.Input
              name="email"
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
            />
            <Form.Input
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              name="password"
              type="password"
            />
            <Button fluid size="large" type="submit">
              {displayName}
            </Button>
          </Segment>
        </Form>
        {error && error.response && <div> {error.response.data} </div>}
      </Grid.Column>
    </Grid>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */

const mapState = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    async handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      await dispatch(auth(email, password, formName))
    }
  }
}

export default connect(mapState, mapDispatch)(Signup)

/**
 * PROP TYPES
 */
// AuthForm.propTypes = {
//   name: PropTypes.string.isRequired,
//   displayName: PropTypes.string.isRequired,
//   handleSubmit: PropTypes.func.isRequired,
//   error: PropTypes.object
// }

// <div>
// <form onSubmit={handleSubmit} name={name}>
//   <div>
//     <label htmlFor="email">
//       <small>Email</small>
//     </label>
//     <input name="email" type="text" />
//   </div>
//   <div>
//     <label htmlFor="password">
//       <small>Password</small>
//     </label>
//     <input name="password" type="password" />
//   </div>
//   <div>
//     <button type="submit">{displayName}</button>
//   </div>
//   {error && error.response && <div> {error.response.data} </div>}
// </form>
// <a href="/auth/google">{displayName} with Google</a>
// </div>
