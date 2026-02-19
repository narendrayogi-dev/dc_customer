import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Header from '../components/Header';
import {fetchHomeDataRequest} from '../redux/action/homeActions';
import {useDispatch} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useRoute } from '@react-navigation/native';

const HowToUseApp = ({navigation}) => {
  const videoList = useRoute()?.params || [];
  const [playing, setPlaying] = useState(true);
  const [isLoding, setisLoding] = useState();
  const dispatch = useDispatch();

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  useEffect(() => {
    console.log('videoList print here data', videoList);
  }, [videoList]);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    console.log('navigation on how_to_use', navigation);
  }, []);

  const handleRefresh = () => {
    dispatch(fetchHomeDataRequest(navigation));
  };

  const getYouTubeVideoID = url => {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|.*[?&]v=))([^?&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const renderVideoItem = ({item, index}) => {
    const videoId = getYouTubeVideoID(item.url);

    if (!videoId) {
      console.log('Invalid video URL:', item.url);
      return <Text style={{color: 'red'}}>Invalid Video URL</Text>;
    }

    return (
      <View style={styles.videoContainer}>
        <YoutubePlayer
          height={200}
          width={340}
          play={playing === index}
          videoId={videoId}
          onChangeState={state => onStateChange(state, index)}
        />

        <View style={styles.buttonContainer}>
          <Pressable onPress={() => togglePlaying(index)} style={styles.button}>
            <Text style={styles.buttonText}>
              {playing === index ? 'Pause' : 'Play'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="How To Use App"
        // width={wp(60)}
        navigation={navigation}
        goBack="HomeScreen"
      />
      <FlatList
        data={videoList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderVideoItem}
        // style={{marginTop: 15}}
        ListEmptyComponent={<Text>No videos available</Text>}
        contentContainerStyle={{paddingBottom: 100, marginTop: 15, flex: 1}}
        refreshControl={
          <RefreshControl refreshing={isLoding} onRefresh={handleRefresh} />
        }
      />

      {isLoding && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            width: wp(100),
            height: hp(80),
          }}>
          {Platform.OS === 'ios' && (
            <>
              <ActivityIndicator color="#000080" size="large" />
              <Text
                style={{
                  marginTop: 10,
                  color: '#000',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Please wait...
              </Text>
            </>
          )}
          {/*  */}
        </View>
      )}
    </View>
  );
};

export default HowToUseApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
    padding: 10,
  },
  videoContainer: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    marginBottom: 40,
  },
  button: {
    height: 40,
    width: 150,
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
});
