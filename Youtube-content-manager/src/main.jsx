import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store, { persistor } from './stores/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import 'react-toastify/dist/ReactToastify.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <ToastContainer position="top-right" autoClose={1000} />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
