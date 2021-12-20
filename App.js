
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  YellowBox
} from 'react-native';

import EverythingScreen from './components/EverythingScreen/EverythingScreen';
import LikeScreen from './components/LikeScreen/LikeScreen';
import DislikeScreen from './components/DislikeScreen/DislikeScreen';
import IcoActive from './components/IcoScreen/IcoActive';
import IcoUpcoming from './components/IcoScreen/IcoUpcoming';
import IcoSaved from './components/IcoScreen/IcoSaved';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

import { DrawerNavigator, DrawerItems, createBottomTabNavigator } from 'react-navigation'
import { Container, Header, Body, Content, Root, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import About from './components/About/About';

YellowBox.ignoreWarnings(['Task orphaned']);
YellowBox.ignoreWarnings(["Warning: Can't call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method."]);





//const instructions = Platform.select({
//  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//  android:
//    'Double tap R on your keyboard to reload,\n' +
//    'Shake or press menu button for dev menu',
//});


class App extends Component {

  constructor() {
    super();
    this.unsubscriber = null;
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.props.changeUserStatus(user)
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    return (
      <Root>
        <Menu />
      </Root>
    );
  }
}

const LogoAndName = (props) => (

  <Container>
    <Header style={{ height: 230, backgroundColor: "white" }}>
      <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={styles.logo}
          source={require('./assets/logo.png')} />
        <Text style={styles.nameLogo}>CryptoSorter</Text>
      </Body>
    </Header>
    <Content >
      <DrawerItems {...props} />
    </Content>
  </Container>
)


const BottomMenu = createBottomTabNavigator({
  Active: {
    screen: IcoActive,
    navigationOptions: ({ navigation }) => ({
      title: "ACTIVE"
    })
  },
  Upcoming: {
    screen: IcoUpcoming,
    navigationOptions: ({ navigation }) => ({
      title: "UPCOMING"
    })
  },
  Saved: {
    screen: IcoSaved,
    navigationOptions: ({ navigation }) => ({
      title: "SAVED"
    })
  },
}, {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Active') {
          iconName = 'check';
        } else if (routeName === 'Upcoming') {
          iconName = 'calendar';
        } else if (routeName === 'Saved') {
          iconName = 'save';
        }

        return <Icon name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  })


const Menu = DrawerNavigator({
  EVERYTHING: {
    screen: EverythingScreen,
    navigationOptions: ({ navigation }) => ({
      title: "EVERYTHING",
      drawerIcon: () => <Icon color="#FD9240" size={24} name="bitcoin" />
    })
  },
  LIKE: {
    screen: LikeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "LIKE",
      drawerIcon: () => <Icon color="#FD9240" size={24} name="thumbs-up" />
    })
  },
  DISLIKE: {
    screen: DislikeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "DISLIKE",
      drawerIcon: () => <Icon color="#FD9240" size={24} name="thumbs-down" />
    })
  },
  ICO: {
    screen: BottomMenu,
    navigationOptions: ({ navigation }) => ({
      title: "ICO",
      drawerIcon: () => <Icon color="#FD9240" size={24} name="star" />
    })
  },
  About: {
    screen: About,
    navigationOptions: ({ navigation }) => ({
      title: "ABOUT",
      drawerIcon: () => <Icon color="#FD9240" size={24} name="question-circle" />
    })
  },
}, {
    initialRouteName: "EVERYTHING",
    contentComponent: LogoAndName,
    contentOptions: {
      activeTintColor: '#FD9240',
    }
  })




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 150,
    width: 150,
  },
  nameLogo: {
    paddingTop: 15,
    paddingBottom: 10,
    fontSize: 26,
    fontWeight: "500"
  }
});

const mapStateToProps = state => {
  return {
    userAuth: state.basic.userAuth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeUserStatus: (event) => dispatch({
      type: "USER_AUTH",
      userAuth: event
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
