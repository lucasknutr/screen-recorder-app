import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, StyleSheet, Platform, Alert } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

type Recording = {
  id: string;
  path: string;
};

const RecordingListScreen = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const navigation = useNavigation();

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        Alert.alert('Permissions denied. Please enable them in settings.');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const initPermissions = async () => {
      const granted = await requestPermissions();
      setPermissionsGranted(granted);
      if (granted) {
        loadRecordings();
      }
    };

    initPermissions();
  }, []);

  const loadRecordings = async () => {
    try {
      const files = await RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/Recordings');
      const videoFiles = files.filter(file => file.name.endsWith('.mp4'));
      const recordingsData = videoFiles.map(file => ({
        id: file.name,
        path: file.path,
      }));
      setRecordings(recordingsData);
    } catch (err) {
      console.error(err);
    }
  };

  const openVideo = (path: string) => {
    navigation.navigate('VideoPlayerScreen', { videoPath: path });
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => openVideo(item.path)}>
      <Video
        source={{ uri: `file://${item.path}` }}
        style={styles.videoPreview}
        resizeMode="cover"
        paused={true} // Prevents the video from playing automatically
      />
      <Text style={styles.videoName}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recordings</Text>
      {permissionsGranted && (
        <FlatList
          data={recordings}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      {!permissionsGranted && (
        <Text style={styles.errorText}>Permissions denied. Please enable them in settings.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  videoPreview: {
    width: '100%',
    height: 200,
  },
  videoName: {
    padding: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RecordingListScreen;
