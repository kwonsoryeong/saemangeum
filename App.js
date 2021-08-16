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

const App: ()=> Node = () => {
  const [location, setLocation] = useState<ILocation | undefined>(undefined);
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

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View>
        {location ? (
          <>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
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
        <Button title="운송 시작" />
        <Button title="운송 중지" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default App;
