import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from '@expo-google-fonts/nunito'
import { useFonts, Raleway_700Bold, Raleway_600SemiBold } from '@expo-google-fonts/raleway'
import { LinearGradient } from 'expo-linear-gradient'
import { responsiveWidth } from 'react-native-responsive-dimensions'
import { router } from 'expo-router'

export default function ForgotPassword() {

  let [fontsLoadeed, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold,
    Raleway_700Bold,
    Raleway_600SemiBold,
  })

  if (!fontsLoadeed && !fontError) {
    return null
  }

  //#FFA07A

  return (
    
    <LinearGradient colors={['#ecf0f1', '#fff']} style={styles.container}>

      <View>
        <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 24, color: 'black', marginBottom: 20 }}>Reset Email Password</Text>
        <Text style={{ fontFamily: 'Nunito_400Regular', fontSize: 16, color: '#808080', marginBottom: 10 }}>Enter your email address and we'll send you a link to reset your password.</Text>
      </View>

      <View>
        <TextInput style={styles.input} placeholder='example@gmail.com' />
      </View>

      <TouchableOpacity style={styles.link}>
        <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#fff' }}>Send Reset Link</Text>
      </TouchableOpacity>

      <View style={styles.back}>
        <Text style={{ fontFamily: 'Nunito_400Regular', fontSize: 16, color: 'black', marginBottom: 10 }}>Back To</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontFamily: 'Nunito_400Regular', fontSize: 18, color: '#e67e22', marginTop: -10, fontWeight: 700 }}> Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    height: 50,
    width: responsiveWidth(90),
    borderColor: '#e67e22',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: 'white'
  },

  link: {
    backgroundColor: '#e67e22',
    height: 50,
    width: responsiveWidth(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 10
  },

  back: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  }
})