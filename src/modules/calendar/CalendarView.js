/* eslint-disable class-methods-use-this */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import publicIP from 'react-native-public-ip';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import Ids from '../../../constants';
import getImagesFromText, {
  getImagesFromTextSecond,
  getImagesFromTextLast,
} from '../../api/gpt';
import downloadImage from '../../api/file';

// import { colors, fonts } from '../../styles';

export default function GenerateScreen() {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const isFocused = useIsFocused();

  const openModal = url => {
    setIsModalVisible(true);
    setImage(url);
  };
  const closeModal = () => setIsModalVisible(false);
  const adUnitId = Ids.BANNER; // 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
  const adUnitIdInt = Ids.INTERSTITIAL; // 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

  const rewarded = RewardedAd.createForAdRequest(Ids.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing', 'images', 'ai', 'health', 'therapy'],
  });

  const interstitial = InterstitialAd.createForAdRequest(adUnitIdInt, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing', 'images', 'ai', 'health', 'therapy'],
  });

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('loaded inter');
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [isFocused]);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('loaded reward');
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [isFocused]);

  const generateImages = async () => {
    setLoading(true);
    const ip = await publicIP();
    const imagesRes = await getImagesFromText(text, ip);
    setImages(img => [...img, ...imagesRes]);
    setLoading(false);
    (async function() {
      interstitial.show();
    })();
    const nextImg = await getImagesFromTextSecond(text, ip);
    setImages(img => [...img, ...nextImg]);
    const lastImg = await getImagesFromTextLast(text, ip);
    setImages(img => [...img, ...lastImg]);
    (async function() {
      rewarded.show();
    })();
  };

  const renderItem = ({ item, id }) => (
    <ScrollView key={id} style={{ margin: 5 }}>
      <Modal visible={isModalVisible} onRequestClose={closeModal}>
        <View>
          <TouchableOpacity onPress={closeModal}>
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => openModal(item)}
        onLongPress={() => downloadImage(item, text)}
      >
        <Image
          source={{
            uri: item,
          }}
          style={styles.image}
        />
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={{ minHeight: '100%' }}>
      <Text style={styles.mainText}>Generate Wallpaper Images</Text>
      <View style={styles.input}>
        <TextInput
          mode="outlined"
          label="Text"
          placeholder="Write a very descriptive text to generate wallpapers..."
          value={text}
          style={styles.inputBar}
          onChangeText={val => setText(val)}
          selectionColor="blue"
          multiline
        />
        <TouchableOpacity onPress={() => generateImages()}>
          <Text>
            <Icon name="magnifying-glass" size={30} color="blue" />
          </Text>
        </TouchableOpacity>
      </View>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      {images.length > 0 && !loading && (
        <View style={styles.img}>
          <Text style={styles.message}>
            Click on any image to enlarge and long press to download
          </Text>

          <FlatList
            data={images}
            renderItem={item => renderItem(item)}
            numColumns={1}
            keyExtractor={(item, k) => k}
            style={{
              paddingHorizontal: 5,
              marginTop: 15,
              width: '100%',
            }}
          />

          <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}
      {loading && (
        <View style={{ marginTop: 150 }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    marginTop: 15,
    overflow: 'scroll',
    marginBottom: 300,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  loading: {
    marginTop: 150,
  },
  inputBar: {
    width: 300,
    height: 45,
    margin: 5,
    borderRadius: 5,
    borderBottomColor: 'blue',
    borderBottomWidth: 1,
    paddingBottom: 0,
  },
  mainText: {
    padding: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    display: 'flex',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    width: '100%',
    minHeight: '100%',
  },
  imagesRow: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    padding: 5,
  },
  image: {
    width: '100%',
    height: 400,
  },
});
