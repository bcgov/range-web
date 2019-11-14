import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { getAgreementSearchParams } from '../../reducers/rootReducer'
import { stringifyQuery } from '../../utils'
import { HOME } from '../../constants/routes'

const propTypes = {
  agreementSearchParams: PropTypes.shape({}),
  className: PropTypes.string
}

const defaultProps = {
  className: '',
  agreementSearchParams: null
}

class BackBtn extends Component {
  state = {
    redirectPath: null
  }

  onBtnClick = e => {
    e.preventDefault()
    const { agreementSearchParams } = this.props

    this.setState({
      redirectPath: agreementSearchParams
        ? `${HOME}?${stringifyQuery(agreementSearchParams)}`
        : HOME
    })
  }

  render() {
    const { className } = this.props
    const { redirectPath } = this.state

    if (redirectPath) {
      return <Redirect push to={redirectPath} />
    }

    return (
      <div
        className={className}
        onClick={this.onBtnClick}
        role="button"
        tabIndex="0">
        <Icon name="arrow circle left" size="large" />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  agreementSearchParams: getAgreementSearchParams(state)
})

BackBtn.propTypes = propTypes
BackBtn.defaultProps = defaultProps
export default connect(
  mapStateToProps,
  null
)(BackBtn)
