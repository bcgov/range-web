import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { HOME } from '../constants/routes'
import { IMAGE_SRC } from '../constants/variables'
import { PAGE_NOT_FOUND_TITLE, APP_NAME } from '../constants/strings'

/* eslint-disable jsx-a11y/anchor-is-valid */
class PageNotFound extends Component {
  state = {
    redirectToHome: false
  }

  UNSAFE_componentWillMount() {
    document.title = PAGE_NOT_FOUND_TITLE
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ redirectToHome: true })
    }, 10000)
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to={HOME} />
    }

    return (
      <section className="page-not-found">
        <div className="page-not-found__container">
          <img
            className="page-not-found__image"
            src={IMAGE_SRC.COW_PIC}
            alt="cow-img"
          />
          <div className="page-not-found__title">Page Not Found</div>
          <div className="page-not-found__content">
            <p>This is not the web page you are looking for.</p>
            <p>
              You will be redirected to the {APP_NAME} home page within 10
              seconds.
            </p>
          </div>
          <div className="page-not-found__link">
            <Link to={HOME}>Go to home</Link>
          </div>
        </div>
      </section>
    )
  }
}

export default PageNotFound
