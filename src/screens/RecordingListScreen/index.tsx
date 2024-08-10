import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

type Recording = {
  id: string;
  uri: string;
  filename: string;
  creationTime: string; // New field to store date/time
  thumbnailUri: string; // New field to store thumbnail URI
};

const RecordingListScreen = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const albumName = 'DCIM'; // Ensure this is the correct album name
        const album = await MediaLibrary.getAlbumAsync(albumName);

        if (album) {
          const media = await MediaLibrary.getAssetsAsync({
            album: album,
            mediaType: 'video',
            sortBy: 'creationTime',
          });

          const recordingsData = await Promise.all(
            media.assets.map(async (asset) => {
              const thumbnail = await MediaLibrary.getAssetInfoAsync(asset.id);
              return {
                id: asset.id,
                uri: asset.uri,
                filename: asset.filename,
                creationTime: new Date(asset.creationTime).toLocaleString(), // Format date/time
                thumbnailUri: thumbnail.uri, // Assuming thumbnail is available in the asset info
              };
            })
          );

          setRecordings(recordingsData);
        } else {
          console.error(`Album "${albumName}" not found`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadRecordings();
  }, []);

  const openVideo = (uri: string) => {
    Linking.openURL(uri);
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => openVideo(item.uri)}>
      <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <Text style={styles.videoName}>{item.filename}</Text>
        <Text style={styles.creationTime}>{item.creationTime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recordings</Text>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  videoName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creationTime: {
    fontSize: 14,
    color: '#888',
  },
});

export default RecordingListScreen;