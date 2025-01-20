import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BudgetScreen from '../../screens/BudgetScreen';
import BudgetDetails from '../../screens/BudgetDetails';
import BudgetCreation from '../../screens/BudgetCreation';

function BudgetStack() {
    // Define the Stack Navigator for each tab
const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="Budget" component={BudgetScreen} />
    <Stack.Screen name="BudgetDetails" component={BudgetDetails} />
    <Stack.Screen name="BudgetCreation" component={BudgetCreation} />
  </Stack.Navigator>
  )
}

export default BudgetStack