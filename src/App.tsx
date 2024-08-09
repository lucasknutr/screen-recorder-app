import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import Toast from 'react-native-toast-message';
import RecordingListScreen from './screens/RecordingListScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';  // Don't forget to import this screen

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Startup">
          <Stack.Screen name="Startup" component={MainScreen} />
          <Stack.Screen name="Recordings" component={RecordingListScreen} />
          <Stack.Screen name="VideoPlayerScreen" component={VideoPlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;
