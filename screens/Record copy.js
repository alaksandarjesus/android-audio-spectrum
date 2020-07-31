import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  PermissionsAndroid
} from 'react-native';
import RNSoundLevel from 'react-native-sound-level';

const renderData = (data, i)=>{
  return <Text>Hello World</Text>;
  return data.map((item, i) =>{
  return <Text key={i}>{item.rawValue}</Text>
  });

}

const [data, setData] = useState([]);

class Record extends React.Component {

 
  componentDidMount() {
    try {
      (async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Access Permission",
            message:
              " Are you sure to start recording using microphone ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          RNSoundLevel.start()
          RNSoundLevel.onNewFrame = (data) => {
            console.log(this.data)
            // see "Returned data" section below
            // console.log('Sound level info', this.state.data)
            // const updated = this.state.data.push(data);
            // this.setState({data:updated})
          }
        } else {
          console.log("Camera permission denied");
        }
      })();

    } catch (err) {
      console.warn(err);
    }
  }
  componentWillUnmount() {
    RNSoundLevel.stop()
  }
  render() {
    return (
      <View>
        <Button
          title="Home"
          color="#f194ff"
          onPress={() => this.props.navigation.navigate("Home")}
        />
        <Text>I am from record page</Text>
        <View>
          {renderData([])}
        </View>
      </View>
    );

  }
}

export default Record;
