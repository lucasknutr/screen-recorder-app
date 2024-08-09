import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

type Recording = {
  id: string;
  uri: string;
  filename: string;
};

const RecordingListScreen = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadRecordings = async () => {
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: 'video',
        first: 100, // Adjust this number based on how many you want to fetch
      });

      const recordingsData = assets.map(asset => ({
        id: asset.id,
        uri: asset.uri,
        filename: asset.filename,
      }));
      setRecordings(recordingsData);
    };

    loadRecordings();
  }, []);

  const openVideo = (uri: string) => {
    navigation.navigate('VideoPlayerScreen', { videoPath: uri });
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => openVideo(item.uri)}>
      <Text style={styles.videoName}>{item.filename}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recordings</Text>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
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
    padding: 16,
  },
  videoName: {
    fontSize: 16,
  },
});

export default RecordingListScreen;
