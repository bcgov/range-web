import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {
  ELEMENT_ID,
  IMAGE_SRC,
  CONTENT_MARGIN_TOP,
  CONTENT_MARGIN_BOTTOM,
  STICKY_HEADER_HEIGHT
} from '../../constants/variables'
import * as strings from '../../constants/strings'

class ContentsContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.shape({}).isRequired
  }

  renderChild = (child, index) => {
    const { props: ChildProps } = child
    const { elementId, ...rest } = ChildProps
    const Child = {
      ...child,
      props: rest
    }
    /*
      setup a reference point for each content
      that's little bit above of the content due to the sticky header
    */
    return (
      <div key={index} className="rup__content">
        <div id={elementId} className="rup__content__ref" />
        {Child}
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)

    // manually click on the active tab once DOMs are rendered
    const { location } = this.props
    const { hash: currHash } = location
    const tabs = document.querySelectorAll('.rup__contents__tab')
    tabs.forEach(tab => {
      if (currHash === tab.hash) {
        tab.click()
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    /* change the active tab on scroll */
    const { pageYOffset } = window
    const references = document.querySelectorAll('.rup__content__ref')

    // find the id of the current content that's being displayed in the screen
    let displayedContentId
    references.forEach(ref => {
      const { offsetTop: ost, offsetHeight } = ref.parentElement

      // reevalulate offsetTop due to the position of the reference <a> tag
      const offset = 3
      const offsetTop =
        ost - (STICKY_HEADER_HEIGHT + CONTENT_MARGIN_TOP + offset)
      const offsetBottom =
        offsetTop + offsetHeight + CONTENT_MARGIN_BOTTOM + offset
      if (pageYOffset >= offsetTop && pageYOffset <= offsetBottom) {
        displayedContentId = ref.id
      }
    })

    const tabs = document.querySelectorAll('.rup__contents__tab')
    tabs.forEach(tab => {
      // clean up the previous active class in all tabs
      tab.classList.remove('rup__contents__tab--active')

      // set active to the tab that's related to the current content
      if (displayedContentId && `#${displayedContentId}` === tab.hash) {
        tab.classList.add('rup__contents__tab--active')
      }
    })
  }

  render() {
    const { children } = this.props

    return (
      <div className="rup__contents__container">
        <div className="rup__contents">{children.map(this.renderChild)}</div>
      </div>
    )
  }
}

export default withRouter(ContentsContainer)
