import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'
import { useFonts, Raleway_700Bold } from '@expo-google-fonts/raleway'
import { LinearGradient } from 'expo-linear-gradient'

interface onboardingSwiperDataType {
  title: string
  description: string
  shortDescription: string
  image: string
}

export default function WelcomeIntroScreen() {

  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  const renderItem = ({item}: {item: onboardingSwiperDataType}) => {

    <LinearGradient colors={['#e67e22', '#f6f7f9']} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

    </LinearGradient>
  }

  return (
    <AppIntroSlider />
  )
}

const styles = StyleSheet.create({})