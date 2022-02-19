import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TransactionScreen from './screens/BookTransactionScreen';
import SearchScreen from './screens/SearchScreen';

import { Rajdhani_600SemiBold } from '@expo-google-fonts/rajdhani'
import * as Font from 'expo-font'
import BottomTabNavigator from './components/BottomTabNavigator'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      fontLoaded: false
    }
  }
  async loadFonts() {
    await Font.loadAsync({
      Rajdhani_600SemiBold: Rajdhani_600SemiBold
    })
    this.setState({
      fontLoaded: true
    })
  }
  componentDidMount() {
    this.loadFonts();
  }
  render() {
    const { fontLoaded } = this.state;
    if (fontLoaded) {
      return (
        <BottomTabNavigator />
      )
    }
    return null
  }
}

