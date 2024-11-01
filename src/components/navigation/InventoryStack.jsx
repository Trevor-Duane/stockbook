import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InventoryScreen from '../../screens/InventoryScreen';

function InventoryStack() {
    // Define the Stack Navigator for each tab
const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Inventorys" component={InventoryScreen} />
  </Stack.Navigator>
  )
}

export default InventoryStack