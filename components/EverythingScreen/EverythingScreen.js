import React, { Component } from 'react';
import { View, Image, Text, ListView, FlatList, StyleSheet, TouchableHighlight, NetInfo } from 'react-native';
import { getApiFirebase, getApi, pushFirebase, removeFirebase } from '../../services/getApi';
import { Header, Left, Right, Body, Title, Container, Button, Spinner, ListItem, Content, List, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { numberFormat } from '../shared/numberFormat';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import LoginUser from '../LoginUser/LoginUser';
import Filter from '../Filter/Filter';
import Info from '../Info/Info';
import { filterData } from '../shared/filter'



class EverythingScreen extends Component {
  constructor(props) {

    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      connection: "none",
      visible: false,
      dataSource: [],
      allData: [],
      fullData: [],
      likes: [],
      dislikes: [],
      isLoading: true,
      index: 25,
      infoOpen: false,
      infoData: '',
      filterOpen: false,
      basicIndex: 25
    }
  }


  getConnection = () => {
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      this.setState({ connection: connectionInfo.type });
      this.getApi();
    });
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  handleFirstConnectivityChange = (connectionInfo) => {
    this.setState({ connection: connectionInfo.type })

  }


  componentWillMount() {
    this.getConnection()
  }


  getApi = () => {
    if (this.state.connection !== "none") {
      this.setState({ isLoading: true })
      getApi("https://min-api.cryptocompare.com/data/all/coinlist").then((data) => {
        this.setState({ image: data.Data });
      }).then(() => {
        getApiFirebase("currency/list/items").then((data) => {
          console.log(data);
          let currency = data._value.slice(0, this.state.basicIndex)
          this.setState({
            isLoading: false,
            dataSource: currency,
            allData: data._value,
            fullData: data._value
          });
        }).then(() => {
          if (this.props.userAuth !== null) {
            //likes
            this.getLikes()
            // dislikes
            this.getDislikes()
          }
        })
      })
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  getLikes = () => {
    let likes = [];
    getApiFirebase('likes/' + this.props.userAuth._user.uid).then((data) => {
      data.forEach((child) => {
        likes.push({
          name: child.val(),
          key: child.key
        });
      });
      this.setState({ pureData: likes })
    }).then(() => {
      let o = [];
      likes.forEach((x) => {
        o.push(x.name)
      })
      this.setState({ likes: likes })
    });
  }

  getDislikes = () => {
    let dislikes = [];
    getApiFirebase('dislikes/' + this.props.userAuth._user.uid).then((data) => {
      data.forEach((element) => {
        dislikes.push({
          name: element.val(),
          key: element.key
        })
      });
      this.setState({ pureData: dislikes })
    }).then(() => {
      let o = [];
      dislikes.forEach((x) => {
        o.push(x.name);
      })
      let dislikeCurrency = this.state.allData.filter((i) => {
        return o.indexOf(i.id) === -1;
      })
      this.setState({
        dislikes: dislikes,
        dataSource: dislikeCurrency.slice(0, this.state.basicIndex),
        allData: dislikeCurrency
      })
    })
  }

  getImage(symbol) {
    if (this.state.image[symbol] === undefined) {
      return "https://www.google.com.vn/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiixfvx17reAhVVAHIKHc16CSgQjRx6BAgBEAU&url=https%3A%2F%2Fminecraft.novaskin.me%2Fsearch%3Fq%3Dqieli%252064x64&psig=AOvVaw1_LH7d3VispYDdpY_kqO5G&ust=1541419130266295"
    } else {
      return "https://www.cryptocompare.com" + this.state.image[symbol].ImageUrl
    }
  }

  priceColor = (item) => {
    if (item >= 0) {
      return "#6DBF47"
    } else {
      return "#FC6062"
    }
  }

  getChart(symbol) {
    return { uri: 'https://cryptohistory.org/charts/sparkline/' + symbol + '-usd/24h/svg' }
  }

  sortingFormula = () => {
    if (this.state.sort === "indexDown") {
      let sort = this.state.allData.sort((a, b) => parseFloat(a.formulaValue) - parseFloat(b.formulaValue));
      let x = sort.slice(0, this.state.basicIndex);
      this.setState({
        sort: "indexUp",
        dataSource: x,
        allData: sort
      })
    } else {
      let sort = this.state.allData.sort((a, b) => parseFloat(b.formulaValue) - parseFloat(a.formulaValue));
      let x = sort.slice(0, this.state.basicIndex);
      this.setState({
        sort: "indexDown",
        dataSource: x,
        allData: sort
      })
    }
  }

  sortingPrice = () => {
    if (this.state.sort === "priceDown") {
      let sort = this.state.allData.sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd));
      let x = sort.slice(0, this.state.basicIndex);
      this.setState({
        sort: "priceUp",
        dataSource: x,
        allData: sort
      })
    } else {
      let sort = this.state.allData.sort((a, b) => parseFloat(b.price_usd) - parseFloat(a.price_usd));
      let x = sort.slice(0, this.state.basicIndex);
      this.setState({
        sort: "priceDown",
        dataSource: x,
        allData: sort
      })
    }
  }

  sortName = () => {
    if (this.state.sort == "nameUp") {
      let sort = this.state.allData.sort((a, b) => ('' + b.symbol).localeCompare(a.symbol))
      let x = sort.slice(0, this.state.basicIndex);
      this.setState({
        sort: "nameDown",
        dataSource: x,
        allData: sort
      })
    } else {
      let sort = this.state.allData.sort((a, b) => ('' + a.symbol).localeCompare(b.symbol))
      let x = sort.slice(0, this.state.basicIndex);
      this.setState({
        sort: "nameUp",
        dataSource: x,
        allData: sort
      })
    }
  }

  getAdditionalData = (e) => {
    let index = this.state.index + this.state.basicIndex
    let data = this.state.allData.slice(this.state.index, index)
    console.log(index);
    this.setState(update(this.state, {
      dataSource: { $push: data },
      index: { $set: index }
    }))
  }

  setLike = (item, secId, rowId, rowMap) => {
    if (this.props.userAuth === null) {
      this.setState({ visible: true });
    } else {
      pushFirebase("likes/" + this.props.userAuth._user.uid, item.id).then((data) => {
        if (data === null) {
          this.getLikes();
          rowMap[`${secId}${rowId}`].props.closeRow();
        }
      })
    }
  }

  setDislike = (item, secId, rowId, rowMap) => {
    if (this.props.userAuth === null) {
      this.setState({ visible: true });
    } else {
      pushFirebase("dislikes/" + this.props.userAuth._user.uid, item.id).then((data) => {
        if (data === null) {
          let dislike = this.state.dataSource.filter((x) => {
            return x.id !== item.id;
          });
          this.setState({
            dataSource: dislike,
          })
          rowMap[`${secId}${rowId}`].props.closeRow();
        }
      })
    }

  }

  closeModal = (data) => {
    this.setState({ visible: data })
  }

  openInfo = (data, secId, rowId, rowMap) =>{
    this.setState({
      infoData: data,
      infoOpen: true
    })
    rowMap[`${secId}${rowId}`].props.closeRow();
  }

  closeInfo = (data) => {
    this.setState({ infoOpen: data})
  }

  closeFilter = (data) => {
    this.setState({ filterOpen: data})
  }

  setFilter = (filter) =>{
    let data = filterData(this.state.fullData, filter);
    let x = data.slice(0, this.state.basicIndex);
    this.setState({
      allData: data,
      dataSource: x,
      sort: ''
    })
      
  }

  likedDetection = (data, secId, rowId, rowMap) => {
    let find = this.state.likes.find((x) => x.name === data.id);
    if (find === undefined) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button onPress={() => this.setLike(data, secId, rowId, rowMap)}
            style={styles.likeButton} >
            <Icon size={20} active name="thumbs-up" />
          </Button>
          <Button onPress={() => this.setDislike(data, secId, rowId, rowMap)}
            style={styles.dislikeButton} >
            <Icon size={20} active name="thumbs-down" />
          </Button>
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button onPress={() => this.deleteLike(data, secId, rowId, rowMap)}
            style={styles.dislikeButton} >
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Icon size={14} active name="thumbs-down" />
              <Text>Remove Like</Text>
            </View>
          </Button>
        </View>
      )
    }
  }

  deleteLike = (data, secId, rowId, rowMap) => {
    let d = this.state.likes.find((x) => x.name === data.id)
    removeFirebase("likes/" + this.props.userAuth._user.uid, d.key).then((x) => {
      if (x === null) {
        this.getLikes();
        rowMap[`${secId}${rowId}`].props.closeRow();
      }
    })
  }

  likeThumb = (data) => {
    let find = this.state.likes.find((x) => x.name === data.id);
    if (find !== undefined) {
      return <Icon style={{ marginLeft: 7, color: "#34B11E" }} name="thumbs-up" />
    }
  }




  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.boxing}>
          <Spinner color="#FD9240" />
        </View>
      )
    }
    if (this.state.connection === 'none') {
      return (
        <View style={styles.boxing}>
          <Text>Don't have internet connection </Text>
          <Text onPress={() => this.getConnection()}>Reload</Text>
        </View>
      )

    }
    if (this.state.connection !== 'none') {
      return (
        <View style={{ flex: 1 }}>
          <Header androidStatusBarColor="#D8D8D8" style={{backgroundColor: "#D8D8D8"}}>
            <Left>
              <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={25} name="bars" onPress={() => this.props.navigation.openDrawer()} />
            </Left>
            <Body>
              <Title style={{color: "#000000"}}>EVERYTHING</Title>
            </Body>
            <Right>
              <Icon style={{ paddingRight: 5, paddingTop: 5 }} size={25} name="filter" onPress={()=>this.setState({filterOpen: true})}/>
            </Right>  
          </Header>
          <View style={styles.basicRowHeader} >
              <Text style={styles.name} onPress={() => this.sortName()}>
              Name   <Icon
                name={this.state.sort === "nameDown" ? "sort-down" : (this.state.sort === "nameUp" ? "sort-up" : "sort")}
                size={12} />
             </Text>
            <Text style={styles.name} onPress={() => this.sortingFormula()}>
              Index   <Icon
                name={this.state.sort === "indexDown" ? "sort-down" : (this.state.sort === "indexUp" ? "sort-up" : "sort")}
                style={{ margin: 15 }}
                size={12} /> </Text>
            <Text style={styles.name} onPress={() => this.sortingPrice()}>
              Price   <Icon
                name={this.state.sort === "priceDown" ? "sort-down" : (this.state.sort === "priceUp" ? "sort-up" : "sort")}
                style={{ margin: 15 }}
                size={12} /></Text>
            <Text style={styles.name}>Charts</Text>
          </View>
          <View style={{flex: 1}}> 
            {this.state.allData.length !==0 && <List
              style={{flex: 1}}
              leftOpenValue={120}
              rightOpenValue={-75}
              onEndReached={this.getAdditionalData}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.1}
              dataSource={this.ds.cloneWithRows(this.state.dataSource)}
              renderRow={(item, i) =>
                <ListItem key={i} style={styles.basicRow}>
                  <View style={styles.firsRow}>
                    <View style={{ flexDirection: 'column' }}>
                      <Image style={styles.image}
                        source={{ uri: this.getImage(item.symbol) }} />
                      {this.likeThumb(item)}
                    </View>
                    <View style={{ marginTop: 5 }}>
                      <Text style={styles.symbol}>{item.symbol}</Text>
                      <Text style={{ color: this.priceColor(item.percent_change_24h) }}>{item.percent_change_24h}</Text>
                    </View>

                  </View>
                  <Text style={styles.formula}>{item.formulaValue.toFixed(2)}</Text>
                  <Text style={styles.price}>{numberFormat(item.price_usd)}</Text>
                  <View style={{ flex: 1, alignSelf: 'stretch' }}>
                    <Image
                      style={styles.chartImage}
                      source={{ uri: 'https://cryptohistory.org/charts/sparkline/' + item.symbol + '-usd/24h/png' }}
                    />
                  </View>
                </ListItem>}
              renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.likedDetection(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full style={{backgroundColor: "#F0F0F0"}} onPress={_ => this.openInfo(data, secId, rowId, rowMap)}>
                <Icon active size={27} color="#000000" name="info-circle" />
              </Button>}
            />}
            {this.state.allData.length === 0 && <View style={styles.errorBox}>
                            <Text style={styles.textError}>Sorry but nothing found! Try entering a different value in the filter.</Text>
                        </View>}
          </View>

          <LoginUser
            closeModal={this.closeModal}
            modalVisible={this.state.visible} />

           <Info 
            closeInfo={this.closeInfo}
            infoOpen={this.state.infoOpen}
            infoData={this.state.infoData} />
            <Filter
              setFilter={this.setFilter}
              closeFilter={this.closeFilter}
              filterOpen={this.state.filterOpen} />
        </View>
      )
    }
  }
}

var styles = StyleSheet.create({
  basic: {
    flex: 1,
  },
  basicRowHeader: {
    marginTop: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    paddingTop: 3,
    paddingBottom: 3
  },
  basicRow: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5
  },
  text: {
    width: "80%",
    fontSize: 20,
    alignSelf: "center",
    textAlign: 'center'
  },
  boxing: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dislikeButton: {
    height: 50,
    backgroundColor: "#FF6666"
  },
  likeButton: {
    height: 50,
    backgroundColor: "#34B11E"
  },
  image: {
    margin: 5,
    width: 15,
    height: 15,
  },
  firsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    alignSelf: 'stretch'
  },
  symbol: {
    height: "auto",
    fontSize: 16,
    fontWeight: "500"
  },
  formula: {
    flex: 1,
    alignSelf: 'stretch',
    textAlign: "center",
    paddingTop: 12
  },
  price: {
    flex: 1,
    alignSelf: 'stretch',
    textAlign: "center",
    paddingTop: 12
  },
  chartImage: {
    width: 90,
    height: 30
  },
  name: {
    flex: 1,
    alignSelf: "center",
    textAlign: 'center',
  },
  errorBox: {
    paddingTop: 100,
    justifyContent: 'center',

},
textError: {
    width: "80%",
    fontSize: 20,
    alignSelf: "center",
    textAlign: 'center'
},
filter: {
    alignSelf: "center",
    textAlign: 'center',
},
})

const mapStateToProps = state => {
  return {
    userAuth: state.basic.userAuth,
  }
}

export default connect(mapStateToProps)(EverythingScreen);

