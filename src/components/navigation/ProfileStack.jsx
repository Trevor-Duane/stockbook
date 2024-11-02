import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../../screens/ProfileScreen';
import UpdatePasswordScreen from '../../screens/UpdatePasswordScreen';

function ProfileStack() {
const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Profiles" component={ProfileScreen} />
    <Stack.Screen name="Updates" component={UpdatePasswordScreen} />
  </Stack.Navigator>
  )
}

export default ProfileStack