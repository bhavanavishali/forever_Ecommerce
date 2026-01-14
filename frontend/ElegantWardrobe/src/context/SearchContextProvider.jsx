import React from 'react'
import { createContext,useState } from 'react'

export const SearchContext = createContext()

const SearchContextProvider = ({children}) => {
    const [search, setSearch] = useState('') 
    
    const value = {
        search,
        setSearch
    }
    
  return (
    <SearchContext.Provider value={value}>
        {children}
    </SearchContext.Provider>
  )
}

export default SearchContextProvider