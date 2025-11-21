import { View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './src/context/ThemeContext';
import { LoadingProvider } from './src/context/LoadingContext';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './src/navigation/MainNavigation';
import { store, persistor } from './src/redux/store';
import LoadingOverlay from './src/components/common/LoadingOverlay';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1DBF72" />
          </View>
        }
        persistor={persistor}
      >
        <ThemeProvider>
          <LoadingProvider>
            <NavigationContainer>
              <MainNavigation />
            </NavigationContainer>
            <LoadingOverlay />
          </LoadingProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
