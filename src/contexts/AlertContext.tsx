import { createContext, useContext, useState } from 'react'

export const AlertContext = createContext({
    message: '',
    setMessage: () => {},
})

export const useAlertContext = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [message, setMessage] = useState('')

    return (
      <>
        <AlertContext.Provider value={{ message, setMessage }}>
          { message && <div className="alert">{message}</div> }
          {children}
        </AlertContext.Provider>
      </>
    );
}