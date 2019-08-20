import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Input, TextArea, Dropdown } from 'semantic-ui-react'
import { CollapsibleBox } from '../../common'
import {
  ALLOWABLE_AUMS,
  PRIVATE_LAND_DEDUCTION,
  GRACE_DAYS,
  PASTURE_NOTES
} from '../../../constants/strings'
import { allowNumberOnly } from '../../../utils'
import PlantCommunities from '../plantCommunities'
import { openInputModal } from '../../../actions'
import { IMAGE_SRC } from '../../../constants/variables'

class EditablePastureBox extends Component {
  static propTypes = {
    pasture: PropTypes.shape({}).isRequired,
    pastureIndex: PropTypes.number.isRequired,
    activePastureIndex: PropTypes.number.isRequired,
    onPastureClicked: PropTypes.func.isRequired,
    onNumberFieldChange: PropTypes.func.isRequired,
    onTextFieldChange: PropTypes.func.isRequired,
    onCopy: PropTypes.func.isRequired,
    openInputModal: PropTypes.func.isRequired
  }

  handleOnCopy = () => {
    this.props.openInputModal({
      id: 'pasture_copy',
      title: strings.PASTURE_NAME,
      value: {},
      onSubmit: value => this.props.onCopy(value)
    })
  }

  onVerticalEllipsisClicked = (e, { value }) => {
    if (value === 'copy') return this.handleOnCopy()
  }

  render() {
    const {
      pasture,
      pastureIndex,
      activePastureIndex,
      onPastureClicked,
      onNumberFieldChange,
      onTextFieldChange
    } = this.props

    const { id, name, allowableAum, pldPercent, graceDays, notes } = pasture

    const pld = pldPercent && Math.floor(pldPercent * 100)
    const dropdownOptions = [{ key: 'copy', value: 'copy', text: 'Copy' }]

    return (
      <CollapsibleBox
        key={id}
        contentIndex={pastureIndex}
        activeContentIndex={activePastureIndex}
        onContentClicked={onPastureClicked}
        header={
          <div className="rup__pasture">
            <div className="rup__pasture__title">
              <img src={IMAGE_SRC.PASTURE_ICON} alt="pasture icon" />
              Pasture:
              {activePastureIndex === pastureIndex ? (
                <Input className={'text-field__text'}>
                  <input
                    type="text"
                    value={name}
                    onClick={e => e.stopPropagation()}
                    onChange={e => onTextFieldChange('name', e.target.value)}
                  />
                </Input>
              ) : (
                ` ${name}`
              )}
            </div>

            <Dropdown
              className="rup__pasture__actions"
              trigger={<i className="ellipsis vertical icon" />}
              options={dropdownOptions}
              icon={null}
              pointing="right"
              onClick={e => e.stopPropagation()}
              onChange={this.onVerticalEllipsisClicked}
              selectOnBlur={false}
            />
          </div>
        }
        collapsibleContent={
          <Fragment>
            <div className="rup__row">
              <div className="rup__cell-4">
                <div className={'text-field__label'}>{ALLOWABLE_AUMS}</div>
                <Input className={'text-field__text'}>
                  <input
                    type="text"
                    onKeyPress={allowNumberOnly}
                    value={allowableAum}
                    onChange={e =>
                      onNumberFieldChange('allowableAum', e.target.value)
                    }
                  />
                </Input>
              </div>
              <div className="rup__cell-4">
                <div className={'text-field__label'}>
                  {PRIVATE_LAND_DEDUCTION}
                </div>
                <Input className={'text-field__text'}>
                  <input
                    type="text"
                    onKeyPress={allowNumberOnly}
                    value={pld}
                    onChange={e =>
                      onNumberFieldChange('pldPercent', e.target.value / 100)
                    }
                  />
                </Input>
              </div>
              <div className="rup__cell-4">
                <div className={'text-field__label'}>{GRACE_DAYS}</div>
                <Input className={'text-field__text'}>
                  <input
                    type="text"
                    onKeyPress={allowNumberOnly}
                    value={graceDays}
                    onChange={e =>
                      onNumberFieldChange('graceDays', e.target.value)
                    }
                  />
                </Input>
              </div>
            </div>
            <div className={'text-field__label'}>{PASTURE_NOTES}</div>
            <Input fluid className={'text-field__text'}>
              <TextArea
                value={notes}
                onChange={e => onTextFieldChange('notes', e.target.value)}
              />
            </Input>
            <PlantCommunities pasture={pasture} />
          </Fragment>
        }
      />
    )
  }
}
export default connect(
  null,
  {
    openInputModal
  }
)(EditablePastureBox)
