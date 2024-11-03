import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

export class PlatformServices {
  async setupPushNotifications() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      
      if (enabled) {
        const token = await messaging().getToken()
        return token
      }
    } else {
      const token = await messaging().getToken()
      return token
    }
  }

  async trackEvent(name: string, params?: Record<string, any>) {
    await analytics().logEvent(name, params)
  }

  async logError(error: Error) {
    await crashlytics().recordError(error)
  }

  async setupAnalytics() {
    await analytics().setAnalyticsCollectionEnabled(true)
  }
} 