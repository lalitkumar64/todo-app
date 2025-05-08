import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, StyleProp, StyleSheet, TextStyle, View } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'list.bullet': 'format-list-bulleted',
  'chart.bar.fill': 'bar-chart',
  'checkmark.circle':"check-circle",
  'chevron.left':"chevron-left",
  'clock':'access-time'
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <View style={[styles.iconContainer]}>
      <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)', // subtle background box
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
