import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import StockStack from "./StockStack";
import ProfileStack from "./ProfileStack";
import BudgetStack from "./BudgetStack";
import InventoryStack from "./InventoryStack";

function RootNavigation() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator 
        screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: '#663399', 
            tabBarInactiveTintColor: 'gray', 
            tabBarIconStyle: {},
            tabBarLabelStyle: {
                fontWeight: "bold",
                fontSize: 12
            },
            tabBarStyle: {
                height: 60,
                borderTopWidth: 1, 
                borderTopColor: '#ccc', 
                paddingBottom: 5,
                paddingTop: 5, 
            },
        }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialIcons 
                name="shelves" 
                size={24} 
                color={focused ? '#663399' : 'gray'}
            />
          ),
        }}
        name="Store"
        component={StockStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <FontAwesome5 
                name="clipboard-list" 
                size={24} 
                color={focused ? '#663399' : 'gray'}
            />
          ),
        }}
        name="Budgets"
        component={BudgetStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <MaterialIcons 
            name="inventory" 
            size={24} 
            color={focused ? '#663399' : 'gray'} 
        />
          ),
        }}
        name="Inventory"
        component={InventoryStack}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <FontAwesome5 
            name="user-alt" 
            size={24} 
            color={focused ? '#663399' : 'gray'} 
        />
          ),
        }}
        name="Profile"
        component={ProfileStack}
      />
      
    </Tab.Navigator>
  );
}

export default RootNavigation;
