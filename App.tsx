import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Screens/Home';
import StockDetail from './Screens/StockDetail';
import SearchScreen from './Screens/SearchScreen';


const Stack = createStackNavigator();



function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }} >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="stock_detail" component={StockDetail} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}


export default App;
