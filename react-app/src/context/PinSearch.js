import { createContext, useState } from "react";

export const PinSearchContext = createContext()

export const PinSearchProvider = props => {
    const [searchPins, setSearchPins] = useState('')
    return (
        <PinSearchContext.Provider value={{searchPins, setSearchPins}}>
            {props.children}
        </PinSearchContext.Provider>
    )
}

export default PinSearchProvider
