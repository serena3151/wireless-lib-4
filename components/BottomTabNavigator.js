import * as React from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TransactionScreen from '../screens/BookTransactionScreen';
import SearchScreen from '../screens/SearchScreen';


export default class BottomTabNavigator extends React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}

const TabNavigator = createBottomTabNavigator({
  TransactionScreen : TransactionScreen,
  SearchScreen : SearchScreen
},
{
  defaultNavigationOptions : ({navigation}) =>({
    tabBarIcon :() =>{
      const routeName = navigation.state.routeName
      
      if(routeName === 'SearchScreen'){
        return(<Image source = {require('../assets/SearchIcon.png')} style = {{width : 40 , height : 40}}/>)
      }
      else if(routeName === 'TransactionScreen'){
        return(<Image source = {require('../assets/Book.png')} style = {{width : 80 , height : 40}}/>)
      }
    }
  })
  
}
)

const AppContainer = createAppContainer(TabNavigator)