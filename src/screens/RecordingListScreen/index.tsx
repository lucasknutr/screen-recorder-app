import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO verificar se está faltando algum campo de metadado
type Recording = {
  id: string;
  uri: string;
  filename: string;
  creationTime: number;
  thumbnailUri: string | null;
};

const RecordingListScreen = () => {
  const navigation = useNavigation();

  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        // Álbum padrão onde estão sendo salvos os vídeos, verificar depois
        const albumName = 'DCIM';
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
          console.error(`Álbum "${albumName}" não encontrado`);
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
    // Navegar para componente de player de vídeo
    // TODO tipar corretamente
    navigation.navigate('VideoPlayerScreen', { videoUri: uri });
  } catch (err) {
    console.error('Erro ao tentar abrir video:', err);
  }
};
const toggleFavorite = async (id: string) => {
  const newFavorites = favorites.includes(id)
    ? favorites.filter(fav => fav !== id)
    : [...favorites, id];

  setFavorites(newFavorites);
  await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
};

const deleteRecording = async (id: string) => {
  try {
    await MediaLibrary.deleteAssetsAsync([id]);
    setRecordings(recordings.filter(recording => recording.id !== id));
  } catch (err) {
    console.error('Erro ao tentar deletar video:', err);
  }
};

const filteredRecordings = showFavoritesOnly
  ? recordings.filter(recording => favorites.includes(recording.id))
  : recordings;

const renderItem = ({ item }: { item: Recording }) => (
  <View style={styles.itemContainer}>
    <TouchableOpacity onPress={() => openVideo(item.uri)}>
      {item.thumbnailUri && (
        <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnail} />
      )}
      <Text style={styles.videoName}>{item.filename}</Text>
      <Text style={styles.creationTime}>{new Date(item.creationTime).toLocaleString()}</Text>
    </TouchableOpacity>
    <View style={styles.buttonContainer}>
      <Button
        title={favorites.includes(item.id) ? 'Desfavoritar' : 'Favoritar'}
        onPress={() => toggleFavorite(item.id)}
      />
      <Button
        title="Deletar"
        onPress={() => deleteRecording(item.id)}
        color="red"
      />
    </View>
  </View>
);

return (
  <View style={styles.container}>
    <Text style={styles.header}>Minhas Gravações</Text>
    <FlatList
      data={filteredRecordings}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
    <Button
      title={showFavoritesOnly ? "Mostrar Tudo" : "Favoritos"}
      onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
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
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
});

export default RecordingListScreen;