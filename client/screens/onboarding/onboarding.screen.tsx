import { Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFonts, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/onboarding/onboarding';
import { router } from 'expo-router';

export default function OnBoardingScreen() {

    let [fontsLoaded, fontError] = useFonts({
        Raleway_700Bold,
        Nunito_400Regular,
        Nunito_700Bold,
    });

    if (!fontsLoaded && !fontError) {
        return null;
    }

  return (

    <LinearGradient colors={['#e67e22', '#f6f7f9']} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.firstContainer}>

            <View>

                <Image source={require('@/assets/logo.png')} style={styles.logo} />

            </View>

            <View style={styles.titleWrapper}>

                <Text style={{fontFamily: 'Raleway_700Bold', fontSize: 30, color: '#2980b9'}}>Welcome to</Text>
                <Text style={{fontFamily: 'Raleway_700Bold', fontSize: 30, color: '#2980b9'}}> TeachNet</Text>

            </View>

            <View style={styles.subTitle}>

                <Text style={{fontFamily: 'Nunito_700Bold', fontSize: 16, color: '#34495e', letterSpacing: 0.5}}>The best platform to learn and teach.</Text>

            </View>

            <TouchableOpacity style={[{marginTop: 50, backgroundColor: '#e67e22', padding: 15, borderRadius: 5}, styles.buttonWrapper]} onPress={() => router.push('/(routes)/welcome-intro')}>

                <Text style={{fontFamily: 'Nunito_700Bold', color: '#ecf0f1', fontSize: 20}}>Get Started</Text>

            </TouchableOpacity>
            
        </View>

    </LinearGradient>

  )
}

