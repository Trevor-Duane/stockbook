import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../screens/ProfileScreen';

function ProfileStack() {
const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Profiles" component={ProfileScreen} />
  </Stack.Navigator>
  )
}

export default ProfileStack