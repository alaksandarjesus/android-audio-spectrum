import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  Alert,
  PermissionsAndroid
} from 'react-native';
import RNSoundLevel from 'react-native-sound-level';
import moment from 'moment';
import _ from 'lodash';
import { LineChart, Grid } from 'react-native-svg-charts';

const renderData = (data, i) => {
  return data.map((item, i) => {
    // return <Text key={i}>Hello</Text>
    return  <Text key={i}>@ {item.time} recorded db is {item.rawValue} </Text>
    
  });

}


class Record extends React.Component {

  constructor() {
    super();
    this.state = ({
      data: [],
      chartData: [],
      minDb:0,
      maxDb:0
    })
  }

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
            if(_.toInteger(data.rawValue)){
              data.time = moment().format('hh:mm:ss');
              this.state.data.push(data);
              this.setState({ data: this.state.data });
              const rawValues = _.map(this.state.data, 'rawValue');
              this.setState({chartData: rawValues});
              this.setState({minDb: _.min(rawValues)});
              this.setState({maxDb: _.max(rawValues)});
            }

            
          }
        } else {
          console.log("Microphone permission denied");
        }
      })();

    } catch (err) {
      console.warn(err);
    }
  }
  
  componentWillUnmount() {
    RNSoundLevel.stop();
  }
  render() {
    return (
      <View>
        <Button
          title="Home"
          color="#f194ff"
          onPress={() => this.props.navigation.navigate("Home")}
        />
        <Text>Min DB: {this.state.minDb}</Text>
        <Text>Max DB: {this.state.maxDb}</Text>
        <LineChart
                style={{ height: 200 }}
                data={this.state.chartData}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
            >
                <Grid />
            </LineChart>
        <ScrollView>
          {renderData(this.state.data)}
        </ScrollView>
      </View>
    );

  }
}

export default Record;
