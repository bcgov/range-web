import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  style: PropTypes.shape({}),
  noDefaultHeight: PropTypes.bool
}

const defaultProps = {
  style: {},
  noDefaultHeight: false
}

const Banner = ({ header, content, style, noDefaultHeight }) => (
  <div className="banner" style={style}>
    <div
      className={classnames('banner__container', {
        'banner__container--no-default-height': noDefaultHeight
      })}>
      <div>
        <h1 className="banner__header">{header}</h1>
        <div className="banner__content">{content}</div>
      </div>
    </div>
  </div>
)

Banner.propTypes = propTypes
Banner.defaultProps = defaultProps
export default Banner
