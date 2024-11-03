import { Dimensions, Platform, PixelRatio } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Based on iPhone 11 Pro's scale
const scale = SCREEN_WIDTH / 375

export function normalize(size: number) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
}

export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (SCREEN_HEIGHT === 780 ||
      SCREEN_WIDTH === 780 ||
      SCREEN_HEIGHT === 812 ||
      SCREEN_WIDTH === 812 ||
      SCREEN_HEIGHT === 844 ||
      SCREEN_WIDTH === 844 ||
      SCREEN_HEIGHT === 896 ||
      SCREEN_WIDTH === 896 ||
      SCREEN_HEIGHT === 926 ||
      SCREEN_WIDTH === 926)
  )
}

export function getStatusBarHeight() {
  return Platform.select({
    ios: isIphoneX() ? 44 : 20,
    android: 0,
    default: 0,
  })
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0
} 