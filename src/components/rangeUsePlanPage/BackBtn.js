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
    agreementSearchQuery: null
  }

  onBtnClick = e => {
    e.preventDefault()
    const { agreementSearchParams } = this.props

    if (!agreementSearchParams) {
      window.history.back()
      return
    }

    this.setState({
      agreementSearchQuery: stringifyQuery(agreementSearchParams)
    })
  }

  render() {
    const { className } = this.props
    const { agreementSearchQuery } = this.state

    if (agreementSearchQuery) {
      return <Redirect push to={`${HOME}?${agreementSearchQuery}`} />
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
