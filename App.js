/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {ScrollView, StyleSheet, Text, View, Button} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE, Marker} from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';

const App: ()=> Node = () => {
  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [preLocation, setPreLocation] = useState<ILocation | undefined>(undefined);
  const [toggle, setToggle] = useState(false);
  const [distance, setDistance] = useState(0);
  const [_watchId, setWatchId] = useState(undefined);

  // 위도 경도 받아오기 START
  function start() {
    const _watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        /*axios.post('http://192.168.0.51:5005/', {
          latitude: latitude,
          longitude: longitude,
        });*/
        if(toggle && location){
          getDistance();
        }
      },
      error => {
        console.log(error);
      },
      {
        //여기를 조절하면 정확도 높일 수 있음
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
    setWatchId(_watchId);
  }

  // 위도 경도 받아오기 STOP
  function stop() {
    Geolocation.clearWatch(_watchId);
    setLocation(undefined);
  }

  // 거리재기 START
  function distanceStart() {
    setToggle(true);
    setPreLocation(location);
  }

  function getDistance(){
    let lat1 = preLocation.latitude;
    let lng1 = preLocation.longitude;
    let lat2 = location.latitude;
    let lng2 = location.longitude;

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1); // deg2rad below 
    var dLon = deg2rad(lng2-lng1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); var d = R * c; // Distance in km 
    /* if(d > 10){
      setPreLocation(location);
    }*/
    setDistance(d);
  }

  // 거리재기 STOP
  function distanceStop() {
    setToggle(false);
  }
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View>
        {location ? (
          <>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text>이동거리: {distance}</Text>
          </>
        ) : (
          <Text>시작버튼을 눌러주세요.</Text>
        )}
      </View>
      <View>
        <Button title="시작" onPress={() => start()} />
        <Button title="멈춤" onPress={() => stop()} />
      </View>
      <View>
        <Button title="운송 시작" onPress={() => distanceStart()} />
        <Button title="운송 중지" onPress={() => distanceStop()} />
      </View>
      <View style={{height:500}}>
        {location && (
          <MapView
            style={{flex:1,}}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <MapViewDirections
              origin={{latitude: 35.2296677, longitude: 129.089243}}
              destination={{latitude: 35.157800, longitude: 129.0591432}}
              apikey={'AIzaSyBSZMNwCj5APs4qNUtb1QxieoK-bYT0_OY'} // insert your API Key here
              strokeWidth={4}
              strokeColor="#ff5599"
            />
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          </MapView>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default App;
