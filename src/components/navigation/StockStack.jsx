import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import HomeDetails from '../../screens/HomeDetails';
import SalesScreen from '../../screens/SalesScreen';
import StoreFilter from '../../screens/StoreFilter';

function StockStack() {
    // Define the Stack Navigator for each tab
const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
    <Stack.Screen name="Stock" component={HomeScreen} />
      <Stack.Screen name="Details" component={SalesScreen}/>
      <Stack.Screen name="Filter" component={StoreFilter}/>
  </Stack.Navigator>
  )
}

export default StockStack