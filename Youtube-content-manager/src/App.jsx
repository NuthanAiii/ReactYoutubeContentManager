import './App.css'
import AppRoute from './routes/appRoutes/appRoute'
import React from 'react';
import Loader from './components/loader';
function App() {
  

  const [loading, setLoading] = React.useState(false);

  // Example: pass setLoading to child components or API calls
  // You can call setLoading(true) before API call and setLoading(false) after

  return (
    <div>
      <AppRoute setLoading={setLoading} />
      <Loader visible={loading} />
    </div>
  );
}

export default App
