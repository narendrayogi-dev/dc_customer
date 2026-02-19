import React from 'react';

import {Entypo} from '@react-native-vector-icons/entypo';
import {EvilIcons} from '@react-native-vector-icons/evil-icons';
import {Feather} from '@react-native-vector-icons/feather';
import {FontAwesome} from '@react-native-vector-icons/fontawesome';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import {AntDesign} from '@react-native-vector-icons/ant-design';
import {Octicons} from "@react-native-vector-icons/octicons"


const ICON_MAP = {
  entypo: Entypo,
  evil: EvilIcons,
  feather: Feather,
  fa: FontAwesome,
  fa6: FontAwesome6,
  material: MaterialIcons,
  materialIcons:MaterialDesignIcons ,
  ionicon:Ionicons, 
  antdesign:AntDesign, 
  octicon:Octicons
};

type IconFamily = keyof typeof ICON_MAP;

interface AppIconProps {
  type?: IconFamily;
  name: string;
  size?: number;
  color?: string;
  style?: any;
  containerStyle?: any;
  onPress?: () => void
}

const AppIcon: React.FC<AppIconProps> = ({
  type = 'material',
  name,
  size = 24,
  color = '#000',
  containerStyle,
  style, 
  onPress
}) => {
  const IconComponent = ICON_MAP[type] || MaterialDesignIcons;

  return <IconComponent name={name} size={size} color={color} style={[containerStyle, style]} onPress= {onPress}  />;
};

export default AppIcon;
