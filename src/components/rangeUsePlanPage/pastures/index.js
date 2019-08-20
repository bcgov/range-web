import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import PastureBox from './PastureBox'

class Pastures extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired
  }

  state = {
    activePastureIndex: 0
  }

  onPastureClicked = pastureIndex => () => {
    this.setState(prevState => {
      const newIndex =
        prevState.activePastureIndex === pastureIndex ? -1 : pastureIndex
      return {
        activePastureIndex: newIndex
      }
    })
  }

  renderPasture = (pasture, pastureIndex) => {
    return (
      <PastureBox
        key={pasture.id}
        pasture={pasture}
        pastureIndex={pastureIndex}
        activePastureIndex={this.state.activePastureIndex}
        onPastureClicked={this.onPastureClicked}
      />
    )
  }

  // onPastureClicked = pastureIndex => () => {
  //   const { location, redirectWithParams } = this.props;
  //   const parsedParams = parseQuery(location.search);
  //   const { pasture: currIndex } = parsedParams;
  //   const newIndex = Number(currIndex) === pastureIndex ? -1 : pastureIndex;

  //   redirectWithParams({ pasture: newIndex });
  // }

  // renderPasture = (pasture, pastureIndex) => {
  //   const parsedParams = parseQuery(this.props.location.search);
  //   const { pasture: index = 0 } = parsedParams;
  //   const activePastureIndex = Number(index);

  //   return (
  //     <PastureBox
  //       key={pasture.id}
  //       pasture={pasture}
  //       pastureIndex={pastureIndex}
  //       activePastureIndex={activePastureIndex}
  //       onPastureClicked={this.onPastureClicked}
  //     />
  //   );
  // }

  renderPastures = (pastures = []) => {
    const isEmpty = pastures.length === 0

    return isEmpty ? (
      <div className="rup__section-not-found">No pasture provided.</div>
    ) : (
      <ul
        className={classnames('collaspible-boxes', {
          'collaspible-boxes--empty': isEmpty
        })}>
        {pastures.map(this.renderPasture)}
      </ul>
    )
  }

  render() {
    const { plan, pasturesMap } = this.props
    const pastureIds = plan && plan.pastures
    const pastures =
      pastureIds &&
      pastureIds
        .map(id => pasturesMap[id])
        .sort((a, b) =>
          a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        )

    return (
      <div className="rup__pastures">
        <div className="rup__content-title">Pastures</div>
        <div className="rup__divider" />
        {this.renderPastures(pastures)}
      </div>
    )
  }
}

export default Pastures
