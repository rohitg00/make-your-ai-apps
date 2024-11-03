import { StyleSheet } from 'react-native'
import { createBox, createText, createRestyleComponent } from '@shopify/restyle'
import { Theme } from '../theme'

// Base components with Restyle
export const Box = createBox<Theme>()
export const Text = createText<Theme>()

// Custom components
export const Container = createRestyleComponent<
  React.ComponentProps<typeof Box> & { children: React.ReactNode },
  Theme
>([
  {
    property: 'layout',
    styleProperty: 'style',
    transform: ({ layout }) => layout && styles[layout]
  }
], Box)

// Common styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
}) 