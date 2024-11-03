import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { Platform } from 'react-native'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export const navigationConfig = {
  screenOptions: {
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      ...Platform.select({
        ios: {
          backgroundColor: 'transparent'
        }
      })
    }
  },
  tabBarOptions: {
    style: {
      elevation: 0,
      shadowOpacity: 0,
      borderTopWidth: 0
    }
  }
}

export { NavigationContainer, Stack, Tab } 