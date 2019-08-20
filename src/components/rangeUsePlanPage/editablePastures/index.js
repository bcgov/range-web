import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Button } from 'semantic-ui-react'
import EditablePastureBox from './EditablePastureBox'

class EditablePastures extends Component {
  static propTypes = {
    plan: PropTypes.shape({ id: PropTypes.number }).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    pastureAdded: PropTypes.func.isRequired,
    pastureUpdated: PropTypes.func.isRequired
  }

  state = {
    activePastureIndex: 0
  }

  onAddPastureClick = () => {
    this.props.pastureAdded(this.props.plan.id)
    this.setState({ activePastureIndex: 0 })
  }

  onNumberFieldChange = (pasture, field, value) => {
    this.props.pastureUpdated({
      pasture: {
        ...pasture,
        [field]: Number(value)
      }
    })
  }

  onTextFieldChange = (pasture, field, value) => {
    this.props.pastureUpdated({
      pasture: {
        ...pasture,
        [field]: value
      }
    })
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
      <EditablePastureBox
        key={pasture.id}
        pasture={pasture}
        pastureIndex={pastureIndex}
        activePastureIndex={this.state.activePastureIndex}
        onPastureClicked={this.onPastureClicked}
        onNumberFieldChange={(field, value) =>
          this.onNumberFieldChange(pasture, field, value)
        }
        onTextFieldChange={(field, value) =>
          this.onTextFieldChange(pasture, field, value)
        }
      />
    )
  }

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
    const pastureIds = Object.keys(pasturesMap)
    const pastures = pastureIds
      .map(id => {
        const isNumber = Number(id)
        if (plan.pastures.includes(Number(id)) || !isNumber)
          return pasturesMap[id]
        return null
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Sort unsubmitted pastures before pre-exisiting pastures
        if (a.id.toString().length !== b.id.toString().length)
          return b.id.toString().length - a.id.toString().length

        // Sort pastures with newer timestamp before older pastures
        if (a.id < b.id) return 1

        return -1
      })

    return (
      <div className="rup__pastures">
        <div className="rup__content-title--editable">
          Pastures
          <Button
            basic
            primary
            onClick={this.onAddPastureClick}
            className="icon labeled rup__pastures__add-button">
            <i className="add circle icon" />
            Add Pasture
          </Button>
        </div>

        <div className="rup__divider" />
        {this.renderPastures(pastures)}
      </div>
    )
  }
}

export default EditablePastures
