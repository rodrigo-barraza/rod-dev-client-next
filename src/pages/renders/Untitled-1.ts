// _app.js
import { AlertProvider } from './AlertContext';

function App({ Component, pageProps }) {
  return (
    <AlertProvider>
      <Component {...pageProps} />
    </AlertProvider>
  );
}

export default App;

// pages/index.js
import Alert from '../components/Alert';
import DeepNestedComponent from '../components/DeepNestedComponent';

const Index = () => {
  return (
    <div>
      <Alert />
      <h1>Welcome to our site</h1>
      <DeepNestedComponent />
    </div>
  );
};

export default Index;
// components/Alert.js
import { useAlert } from '../AlertContext';

const Alert = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) {
    return null;
  }

  return (
    <div className={`alert alert-${alert.type}`} onClick={hideAlert}>
      {alert.message}
    </div>
  );
};

export default Alert;

// components/DeepNestedComponent.js
import { useAlert } from '../AlertContext';

const DeepNestedComponent = () => {
  const { showAlert } = useAlert();

  const handleClick = () => {
    showAlert('Hello from a deep nested component!', 'success');
  };

  return (
    <div>
      <button onClick={handleClick}>Show Alert</button>
    </div>
  );
};

export default DeepNestedComponent;

// AlertContext.js
import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};