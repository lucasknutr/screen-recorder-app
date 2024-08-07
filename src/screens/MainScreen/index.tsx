import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const StartupScreen = ({navigation}) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    // TODO implementar logicas para iniciar a gravação aqui
  };

  const stopRecording = () => {
    setIsRecording(false);
    // TODO implementar logicas para parar a gravação aqui
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {isRecording ? 'Gravando' : 'Não gravando'}
      </Text>
      <Button title="Começar Gravação" onPress={startRecording} disabled={isRecording} />
      <Button title="Parar Gravação" onPress={stopRecording} disabled={!isRecording} />
      <Button title="Ver Gravações" onPress={() => navigation.navigate('RecordingList')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    marginBottom: 20,
    fontSize: 18,
  },
});

export default StartupScreen;
