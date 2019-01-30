import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Segment, Button, Form } from 'semantic-ui-react';
import { Loading } from '../common';
// import { getUser } from '../../reducers/rootReducer';
import { getUserFullName } from '../../utils';

class UsernameInputModal extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
  }

  onSubmitClicked = (e) => {
    e.preventDefault();
    console.log(e, 'onSubmitClicked');
  }

  render() {
    const { user } = this.props;
    const missingLastAndFirstName = !getUserFullName(user);

    return (
      <Modal
        dimmer="blurring"
        style={{ width: '400px' }}
        open
        // open={missingLastAndFirstName}
      >
        <Segment>
          <Loading active={false} />
          <div className="un-input-modal">
            <div className="un-input-modal__header">
              Welcome to MyRangeBC
            </div>
            <span
              className="un-input-modal__wave"
              role="img"
              aria-label="Wave"
            >
              👋
            </span>
            <div className="un-input-modal__msg">
              Hey Stranger, What&#39;s your name?
            </div>
            <Form>
              <Form.Input label="First Name" />
              <Form.Input label="Last Name" />
              <Button
                primary
                fluid
                onClick={this.onSubmitClicked}
              >
                Submit
              </Button>
            </Form>
          </div>
        </Segment>
      </Modal>
    );
  }
}

export default UsernameInputModal;
// const mapStateToProps = state => (
//   {
//     user: getUser(state),
//   }
// );

// export default connect(mapStateToProps, {
//   // signOut
// })(UsernameInputModal);
