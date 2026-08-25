import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import AIChatWidget from './components/AIChatWidget';
import { useArtStore } from './store/useArtStore';

function App() {
  const restoreSession = useArtStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <>
      <AppRoutes />
      <AIChatWidget />
    </>
  );
}

export default App;
