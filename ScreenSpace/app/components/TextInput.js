import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Assets from './Assets';
const TextInputComponent = ({label, valor, placeHolder, handleTextChange ,keyboardType, maxLength, secureText, IconSVG }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const handleChangeText = (inputText) => {
    setText(inputText);
    handleTextChange(inputText); //para pasar como props de hijo a padre
  };
  
  
  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputSubContainer}>
        {IconSVG && <IconSVG style={styles.iconStyle} />}
        <TextInput
          style={styles.input}
          placeholder={placeHolder}
          placeholderTextColor={Assets.COLORS.Subtitle}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={valor} 
          keyboardType={keyboardType}
          maxLength={maxLength} 
          secureTextEntry={secureText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginTop: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 0.6,
  },
  inputContainerFocused: {
    width: '100%',
    marginTop: '5%',
    borderRadius: 12,
    backgroundColor: Assets.COLORS.Tertiary,
    opacity: 1,
  },
  label: {
    color: Assets.COLORS.WhiteColor,
    fontSize: 18,
    marginLeft: '10%',
    marginTop: '2%',
    fontStyle: 'italic',
  },
  inputSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',  // Asegúrate de que los elementos estén alineados en el centro
    marginHorizontal: '10%',
  },
  iconStyle: {
    marginRight: 10,  // Añadir un margen a la derecha del icono para un mejor espaciado
  },
  input: {
    marginTop: '2%',
    width: '100%',
    height: '80%',
    borderRadius: 10,
    fontSize: 16,
    color: Assets.COLORS.WhiteColor,
    marginBottom: '3%',
  },
});

export default TextInputComponent;
