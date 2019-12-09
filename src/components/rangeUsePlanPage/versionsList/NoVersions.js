import React from 'react'
import { Segment, Header, Icon, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { RANGE_USE_PLAN } from '../../../constants/routes'
import { PrimaryButton } from '../../common'

const NoVersions = ({ planId }) => {
  return (
    <Container>
      <Segment placeholder>
        <Header icon>
          <Icon name="question circle" />
          This plan does not have any past versions
        </Header>
        <PrimaryButton
          as={Link}
          to={`${RANGE_USE_PLAN}/${planId}`}
          icon
          labelPosition="left">
          <Icon name="arrow left" />
          Go back to RUP
        </PrimaryButton>
      </Segment>
    </Container>
  )
}

export default NoVersions
