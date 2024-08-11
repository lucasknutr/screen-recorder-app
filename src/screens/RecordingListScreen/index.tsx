import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Linking, Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Recording = {
  id: string;
  uri: string;
  filename: string;
  creationTime: number;
  thumbnailUri: string | null;
};

const RecordingListScreen = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const albumName = 'Download';
        const album = await MediaLibrary.getAlbumAsync(albumName);

        if (album) {
          const media = await MediaLibrary.getAssetsAsync({
            album: album,
            mediaType: 'video',
            sortBy: 'creationTime',
          });

          const recordingsData = media.assets.map(asset => ({
            id: asset.id,
            uri: asset.uri,
            filename: asset.filename,
            creationTime: asset.creationTime,
            thumbnailUri: asset.uri,
          }));

          setRecordings(recordingsData);
        } else {
          console.error(`Album "${albumName}" not found`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (err) {
        console.error('Falha ao carregar favoritos', err);
      }
    };

    loadRecordings();
    loadFavorites();
  }, []);

  const openVideo = async (uri: string) => {
    try {
      if (Platform.OS === 'android') {
        // Use FileProvider to create a content URI
        const contentUri = await FileProvider.getUriForFile({
          fileUri: uri,
          authority: `com.screenrecorderapp.provider`, // Ensure this matches your AndroidManifest.xml
        });
  
        const intent = {
          action: IntentLauncher.ACTION_VIEW,
          data: contentUri,
          type: 'video/*',
          flags: IntentLauncher.FLAG_GRANT_READ_URI_PERMISSION,
        };
  
        IntentLauncher.startActivityAsync(intent);
      } else {
        // For iOS, open the video with the default player
        await Linking.openURL(uri);
      }
    } catch (err) {
      console.error('Error opening video file:', err);
    }
  };

  const toggleFavorite = async (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => openVideo(item.uri)}>
        {item.thumbnailUri && (
          <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnail} />
        )}
        <Text style={styles.videoName}>{item.filename}</Text>
        <Text style={styles.creationTime}>{new Date(item.creationTime).toLocaleString()}</Text>
      </TouchableOpacity>
      <Button
        title={favorites.includes(item.id) ? 'Unfavorite' : 'Favorite'}
        onPress={() => toggleFavorite(item.id)}
      />
    </View>
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
  thumbnail: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  videoName: {
    fontSize: 16,
  },
  creationTime: {
    fontSize: 12,
    color: '#555',
  },
});

export default RecordingListScreen;