import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes.jsx';

function App() {
  return (

      <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
        <Toaster position="top-right" />
        <AppRoutes />
      </div>
  );
}

export default App;