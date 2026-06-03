import { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initApp } from './logic/service';

import { atomLayout, compositeLayout } from './presentation/style';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initApp();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View style={[compositeLayout.columnCenterCenter, atomLayout.flex]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
    </SafeAreaProvider>
  );
}
