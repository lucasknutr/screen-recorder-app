import React, { useState, useCallback, useEffect } from 'react';
import { View, Button, Text, TouchableOpacity, Image } from 'react-native';
import ScreenRecorder from 'react-native-screen-mic-recorder';
import * as MediaLibrary from 'expo-media-library';
import { requestAllPermissions } from '../../utils/permissions';
import Toast from 'react-native-toast-message';
import { styles } from './styles'

const MainScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Não Gravando');
  const [hasAllPermissions, setHasAllPermissions] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      const requested = await requestAllPermissions();
      if (!requested) {
        Toast.show({type: 'error', text1: 'Please grant all permissions'});
      } else {
        setHasAllPermissions(true);
      }
    }
    checkAndRequestPermissions();
  }, []);
  

  const startRecording = useCallback(async () => {
    // @ts-ignore
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
    if (!hasAllPermissions) {
      Toast.show({type: 'error', text1: 'Please grant all permissions'});
      return requestAllPermissions();
    }
    try {
      const res = await await ScreenRecorder.startRecording().catch((error) => {
        console.warn(error) // handle native error
      })
      if (res === 'started') {
        setIsRecording(true);
        setStatus("Gravando...")
        Toast.show({type: 'success', text1: 'Gravacao iniciada com sucesso!'});
      } else {
        Toast.show({type: 'error', text1: 'Falha ao gravar. Tente novamente.'});
        setStatus("Falha ao gravar")
      }
    } catch (e) {
      setIsRecording(false);
      Toast.show({type: 'error', text1: 'Falha ao gravar. Tente novamente.'});
    }
    
    }, [hasAllPermissions]);
    
    const stopRecording = useCallback(async () => {
    try {
      const res = await ScreenRecorder.stopRecording();
    
      await MediaLibrary.saveToLibraryAsync(res);

      console.log('Video saved to camera roll');

      Toast.show({type: 'success', text1: 'Gravacao encerrada com sucesso!'});

      ScreenRecorder.deleteRecording(res);

      setIsRecording(false);
      setStatus("Salvo no Rolo da Camera")
    } catch (e) {
      Toast.show({type: 'error', text1: 'Falha ao tentar parar de gravar.'});
    }
    
    }, []);

    const handleRecording = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }

  return (
    <View>
      <Image source={require('../../assets/pixelPhone.png')} style={styles.pixelPhoneImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRecording} style={isRecording? styles.recordingButton : styles.recordIdleButton} />
        <Text style={styles.statusText}>Status: {status}</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recordings')}>
          <Text style={styles.buttonText}>Minhas Gravações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainScreen;
