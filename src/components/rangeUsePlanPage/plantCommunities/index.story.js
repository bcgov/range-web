import React from 'react'
import PlantCommunities from '.'
import { Form } from 'formik-semantic-ui'

export default {
  title: 'PoopCommunities|PlantCommunities',
  component: PlantCommunities
  /*	  decorators: [storyFn => 
    <Form
      initialValues={{
        plantCommunities: [
			{

			} 
				]
      }}
      render={({ values }) => (
		storyFn(values)
      )}
    />]
	*/
}

export const simple = values => (
  <PlantCommunities
    plantCommunties={values.plantCommunities}
    namespace="plantCommunities"
  />
)
