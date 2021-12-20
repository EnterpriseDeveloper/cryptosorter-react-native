import React, { Component } from 'react';
import { View, Image, Text, ListView, StyleSheet } from 'react-native';
import { Header, Left, Right, Body, Title, Container, Button, Spinner, ListItem, Content, List, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LoginUser from '../LoginUser/LoginUser';
import { connect } from 'react-redux';
import { getApiFirebase, removeFirebase, getApi } from '../../services/getApi';
import { numberFormat } from '../shared/numberFormat';
import update from 'immutability-helper';
import firebase from 'react-native-firebase';
import Info from '../Info/Info';








class LikeScreen extends Component {
    constructor(props) {
        super(props)
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            visible: false,
            load: true,
            allData: [],
            likeCurrency: [],
            pureData: [],
            sort: "",
            index: 25,
            infoOpen: false,
            infoData: ''
        }
    }

    getData = () => {
        if (this.props.userAuth !== null) {
            let allCurrency
            let likes = []
            getApi("https://min-api.cryptocompare.com/data/all/coinlist").then((data) => {
                this.setState({ image: data.Data });
            }).then(() => {
                getApiFirebase('currency/list/items').then((data) => {
                    allCurrency = data
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
                        let likeCurrency = allCurrency._value.filter((i) => {
                            return o.indexOf(i.id) != -1;
                        })
                        this.setState({
                            allData: likeCurrency,
                            likeCurrency: likeCurrency.slice(0, 25),
                            load: false
                        })
                    })
                })
            })
        } else {
            this.setState({ load: false })
        }
    }

    getImage(symbol) {
        if (this.state.image[symbol] === undefined) {
            return "https://www.google.com.vn/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiixfvx17reAhVVAHIKHc16CSgQjRx6BAgBEAU&url=https%3A%2F%2Fminecraft.novaskin.me%2Fsearch%3Fq%3Dqieli%252064x64&psig=AOvVaw1_LH7d3VispYDdpY_kqO5G&ust=1541419130266295"
        } else {
            return "https://www.cryptocompare.com" + this.state.image[symbol].ImageUrl
        }
    }

    closeModal = (data) => {
        this.setState({ visible: data })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userAuth !== this.props.userAuth) {
            this.setState({
                load: true
            })
            this.getData();
        }

    }


    componentWillMount() {
        this.getData()
        //firebase.auth().signOut()
    }


    deleteLike = (item, secId, rowId, rowMap) => {
        let d = this.state.pureData.find((x) => x.name === item.id);
        removeFirebase("likes/" + this.props.userAuth._user.uid, d.key).then((x) => {
            if (x === null) {
                rowMap[`${secId}${rowId}`].props.closeRow();
                let remove = this.state.likeCurrency.filter((x) => {
                    return x.id !== item.id;
                });
                this.setState({
                    allData: remove,
                    likeCurrency: remove,
                })
            }
        })

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
            let x = sort.slice(0, 25);
            this.setState({
                sort: "indexUp",
                likeCurrency: x,
                allData: sort
            })
        } else {
            let sort = this.state.allData.sort((a, b) => parseFloat(b.formulaValue) - parseFloat(a.formulaValue));
            let x = sort.slice(0, 25);
            this.setState({
                sort: "indexDown",
                likeCurrency: x,
                allData: sort
            })
        }
    }

    sortingPrice = () => {
        if (this.state.sort === "priceDown") {
            let sort = this.state.allData.sort((a, b) => parseFloat(a.price_usd) - parseFloat(b.price_usd));
            let x = sort.slice(0, 25);
            this.setState({
                sort: "priceUp",
                likeCurrency: x,
                allData: sort
            })
        } else {
            let sort = this.state.allData.sort((a, b) => parseFloat(b.price_usd) - parseFloat(a.price_usd));
            let x = sort.slice(0, 25);
            this.setState({
                sort: "priceDown",
                likeCurrency: x,
                allData: sort
            })
        }
    }

    sortName = () => {
        if (this.state.sort == "nameDown") {
            let sort = this.state.allData.sort((a, b) => ('' + a.symbol).localeCompare(b.symbol))
            let x = sort.slice(0, 25);
            this.setState({
                sort: "nameUp",
                likeCurrency: x,
                allData: sort
            })
        } else {
            let sort = this.state.allData.sort((a, b) => ('' + b.symbol).localeCompare(a.symbol))
            let x = sort.slice(0, 25);
            this.setState({
                sort: "nameDown",
                likeCurrency: x,
                allData: sort
            })
        }
    }

    getAdditionalData = (e) => {
        if (this.state.allData.length >= 25) {
            let index = this.state.index + 25
            this.setState(update(this.state, {
                likeCurrency: { $push: this.state.allData.slice(this.state.index, index) },
                index: { $set: index }
            }))
        }
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




    render() {
        if (this.state.load) {
            return (
                <View style={styles.boxing}>
                    <Spinner color="#FD9240" />
                </View>
            )
        }
        return (
            <View style={styles.basic}>
                <Header androidStatusBarColor="#D8D8D8" style={{backgroundColor: "#D8D8D8"}}>
                    <Left>
                        <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={25} name="bars" onPress={() => this.props.navigation.openDrawer()} />
                    </Left>
                    <Body >
                        <Title style={{color: "#000000"}}>LIKE</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <View style={styles.basic}>
                    <LoginUser
                        closeModal={this.closeModal}
                        modalVisible={this.state.visible} />

                    <Info
                        closeInfo={this.closeInfo}
                        infoOpen={this.state.infoOpen}
                        infoData={this.state.infoData} />

                    {this.props.userAuth === null && <Container style={styles.boxText}>
                        <Text style={styles.text}>Here you'll track your most beloved coins.
                        Simple go to "Everything", slide, and click on</Text>
                        <Button style={styles.like}
                            onPress={() => this.setState({ visible: true })}
                            transparent
                        ><Icon color="#34B11E" size={26} name="thumbs-up" /></Button>
                    </Container>}

                    {this.props.userAuth !== null && <View style={styles.basic}>
                        {!this.state.load && <View >
                            {this.state.likeCurrency.length !== 0 && <View>
                                <View style={styles.basicRowHeader}>
                                    <Text style={styles.name} onPress={() => this.sortName()}>
                                        Name   <Icon
                                            name={this.state.sort === "nameDown" ? "sort-down" : (this.state.sort === "nameUp" ? "sort-up" : "sort")}
                                            style={{ margin: 15 }}
                                            size={12} /></Text>
                                    <Text style={styles.name} onPress={() => this.sortingFormula()}>
                                        Index   <Icon
                                            name={this.state.sort === "indexDown" ? "sort-down" : (this.state.sort === "indexUp" ? "sort-up" : "sort")}
                                            style={{ margin: 15 }}
                                            size={12} /> </Text>
                                    <Text style={styles.name} onPress={() => this.sortingPrice()}>
                                        Price    <Icon
                                            name={this.state.sort === "priceDown" ? "sort-down" : (this.state.sort === "priceUp" ? "sort-up" : "sort")}
                                            style={{ margin: 15 }}
                                            size={12} /></Text>
                                    <Text style={styles.name}>Charts</Text>
                                </View>
                                <View>
                                    <List
                                        leftOpenValue={75}
                                        rightOpenValue={-75}
                                        onEndReached={this.getAdditionalData}
                                        keyExtractor={(item, index) => index}
                                        onEndReachedThreshold={0.1}
                                        dataSource={this.ds.cloneWithRows(this.state.likeCurrency)}
                                        renderRow={item =>
                                            <View key={item.id} style={styles.basicRow}>
                                                <View style={styles.firsRow}>
                                                    <Image style={styles.image}
                                                        source={{ uri: this.getImage(item.symbol) }} />
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
                                            </View>}
                                        renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
                                            <Button style={styles.dislikeButton} onPress={() => this.deleteLike(data, secId, rowId, rowMap)}>
                                                <Icon size={20} active name="thumbs-down" />
                                            </Button>}
                                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                                            <Button full style={{ backgroundColor: "#F0F0F0" }} onPress={_ => this.openInfo(data, secId, rowId, rowMap)}>
                                                <Icon active size={27} color="#000000" name="info-circle" />
                                            </Button>}
                                    />
                                </View>
                            </View>}


                            {this.state.likeCurrency.length === 0 && <Container style={styles.boxTextTwo}>
                                <Text style={styles.text}>Here you'll track your most beloved coins.
                                                          Simple go to "Everything", slide, and click on</Text>
                                <Icon style={styles.like} color="#34B11E" size={26} name="thumbs-up" />
                            </Container>}

                        </View>}

                    </View>}

                </View>
            </View>
        )
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
        paddingTop: 3,
        paddingBottom: 3
    },
    boxText: {
        height: 100,
        justifyContent: 'center',

    },
    boxTextTwo: {
        marginTop: "60%",

    },
    text: {
        width: "80%",
        fontSize: 20,
        alignSelf: "center",
        textAlign: 'center'
    },
    like: {
        alignSelf: "center",
        textAlign: 'center',
    },
    boxing: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dislikeButton: {
        backgroundColor: "#FF6666"
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
    }
})

const mapStateToProps = state => {
    return {
        userAuth: state.basic.userAuth,
    }
}

export default connect(mapStateToProps)(LikeScreen)

