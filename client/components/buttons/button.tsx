import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Button({title, onPress}: {title: string, onPress: () => void}) {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => onPress}>
      <Text style={styles.buttonTxt}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#2980b9',
        padding: 12,
        borderRadius: 5,
        marginTop: 30
    },

    buttonTxt: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 20,
        color: '#fff',
        textAlign: 'center'
    }
})