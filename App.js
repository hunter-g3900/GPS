import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView,{Marker} from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState(null);
  const [markedLocation, setMarkedLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // Ask for location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      // Get current location
      let loc = await Location.getCurrentPositionAsync({
        accuracy:Location.Accuracy.Highest,
      });
      setLocation(loc.coords);
    })();
  }, []);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkedLocation({ latitude, longitude });
    Alert.alert('Marked Location', `Latitude: ${latitude}\nLongitude: ${longitude}`);
    console.log(`Latitude: ${latitude}\nLongitude: ${longitude}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View stylele={styles.infoContainer}>
        {location ? (
          <Text>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </View>
      {location && (
        <MapView 
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
          >
            <Marker coordinate={{
              latitude: location.latitude,
              longitude: location.longitude
            }}title="Your Location" />

            {markedLocation && (
              <Marker coordinate={markedLocation} title='Marked Loation' pinColor='blue'/>
            )}
          </MapView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  infoContainer:{
    position:'absolute',
    top:50,
    left:20,
    zIndex:1,
  },
  map:{
    flex:1,
  }

});
