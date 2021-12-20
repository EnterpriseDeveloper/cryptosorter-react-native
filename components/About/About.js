import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Button, Linking } from 'react-native';
import { Header, Title, Item, Input, Label, Left, Right, Body, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';




class About extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header androidStatusBarColor="#D8D8D8" style={{ backgroundColor: "#D8D8D8" }}>
          <Left>
            <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={25} name="bars" onPress={() => this.props.navigation.openDrawer()} />
          </Left>
          <Body>
            <Title style={{ color: "#000000" }}>ABOUT</Title>
          </Body>
          <Right />
        </Header>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{textAlign: 'center'}}>Invest smart and track your cryptocurrency funds with ease! Check out
            <Text style={{ color: '#FD9240', paddingTop: 10 }} onPress={() => Linking.openURL("https://cryptosorter.com/")}> CryptoSorter.com</Text> in mobile/desktop browser for portfolio management/sharing and other early access features.</Text>
          <Text style={{textAlign: 'center'}}>Questions? Drop us a message to  <Text onPress={() => Linking.openURL("mailto:info@cryptosorter.com")} style={{ color: '#FD9240' }}>info@cryptosorter.com</Text> and let's talk.</Text>
        </View>
      </View>
    )
  }

}

export default About