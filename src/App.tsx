import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from '@/store';
import {initAnalytics} from '@/services/analytics';
import CombatRoller from '@/CombatRoller';

initAnalytics();

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CombatRoller />
      </PersistGate>
    </Provider>
  );
};

export default App;
