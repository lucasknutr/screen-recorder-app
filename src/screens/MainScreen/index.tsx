import React, { useState, useCallback, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import RecordScreen from 'react-native-record-screen';
import ScreenRecorder from 'react-native-screen-mic-recorder';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import { requestAllPermissions } from '../../utils/permissions';
import Toast from 'react-native-toast-message';

const MainScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Not Recording');
  const [hasAllPermissions, setHasAllPermissions] = useState(false);

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
      const res = await ScreenRecorder.stopRecording().catch((error) => {
        console.warn(error)
      })
    
      const result = await CameraRoll.save(res, {
        album: 'ScreenRecorder',
        type: 'video',
      });

      console.log('Video saved to camera roll', result);

      Toast.show({type: 'success', text1: 'Gravacao encerrada com sucesso!'});

      ScreenRecorder.deleteRecording(res);

      setIsRecording(false);
      setStatus("Salvo no Rolo da Camera")
    } catch (e) {
      Toast.show({type: 'error', text1: 'Falha ao tentar parar de gravar.'});
    }
    
    }, []);

  return (
    <View>
      <Button title="Iniciar Gravação" onPress={startRecording} disabled={isRecording} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!isRecording} />
      <Text>Status: {status}</Text>
      <Button title="Go to Recordings" onPress={() => navigation.navigate('Recordings')} />
    </View>
  );
};

export default MainScreen;
