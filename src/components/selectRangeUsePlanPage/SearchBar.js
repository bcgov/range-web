import React, { useState } from 'react'
import { Input, Icon } from 'semantic-ui-react'
import { ELEMENT_ID } from '../../constants/variables'

const SearchBar = ({ onSearch, loading, placeholder, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue)

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()

        onSearch(inputValue)
      }}>
      <div className="agrm__search">
        <Input
          style={{ width: '100%' }}
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
