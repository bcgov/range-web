import React, { useState } from 'react'
import { Input, Icon } from 'semantic-ui-react'
import { ELEMENT_ID } from '../../constants/variables'

const SearchBar = ({ onSearch, loading, placeholder, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()

        onSearch(inputValue)
      }}>
      <div className="agrm__search">
        <Input
          fluid
          icon
          loading={loading}
          iconPosition="left"
          placeholder={placeholder}>
          <Icon name="search" />
          <input
            id={ELEMENT_ID.SEARCH_TERM}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
        </Input>
      </div>
    </form>
  )
}

export default SearchBar
