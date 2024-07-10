import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'
import { useFonts, Raleway_700Bold } from '@expo-google-fonts/raleway'
import { LinearGradient } from 'expo-linear-gradient'
import AppIntroSlider from 'react-native-app-intro-slider'
import { onboardingSwiperData } from '../../constants/constants'
import { router } from 'expo-router'
import { commonStyles } from '../../styles/common/common.styles'

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
  
  const renderItem = ({item}: {item: onboardingSwiperDataType}) => (

    <LinearGradient colors={['#ffffff', '#f6f7f9']} style={{flex: 1, paddingHorizontal: 16}}>

      <View style={{marginTop: 80}}>

        <Image source={item.image} style={styles.slideImage} />

        <Text style={{fontFamily: 'Nunito_700Bold', fontSize: 24, color: '#2980b9', textAlign: 'center'}}>{item.title}</Text>

        <View style={{marginTop: 15}}>
          
        </View>

      </View>

    </LinearGradient>
  )

  return (
    <AppIntroSlider
     renderItem={renderItem}
     data={onboardingSwiperData}
     onDone={() => {
      router.push('/login')
     }}
      onSkip={() => {
        router.push('/login')
      }}
      renderNextButton={() => (
        <View style={[commonStyles.buttonContainer, {paddingBottom: 20}]}>
          <Text style={commonStyles.buttonTxt}>Next</Text>
        </View>
      )}
      renderDoneButton={() => (
        <View style={commonStyles.buttonContainer}>
          <Text style={commonStyles.buttonTxt}>Done</Text>
        </View>
      )}
      showSkipButton={false}
      dotStyle={commonStyles.dotStyle}
      activeDotStyle={commonStyles.activedotStyle}
      bottomButton={true}
    />
  )
}



const styles = StyleSheet.create({
  slideImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 30
  }
})

