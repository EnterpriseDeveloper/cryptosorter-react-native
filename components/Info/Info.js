import React, { Component } from 'react';
import { View, Modal, StyleSheet, Image, WebView, Platform, ScrollView } from 'react-native';
import { Header, Item, Input, Label, Left, Right, Body, Spinner, Container, Button, Content, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { numberFormat } from '../shared/numberFormat';




class LoginUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            error: false,
            infoData: [],
            infoCompare: [],
            price: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.infoData !== this.props.infoData) {
            this.getData(nextProps.infoData)
        }
    }

    getData = (data) => {
        this.setState({
            error: false,
            isLoading: true,
            price: data
        })
        fetch("https://min-api.cryptocompare.com/data/all/coinlist")
            .then((res) => res.json())
            .then((info) => {
                let id = info.Data[data.symbol];
                console.log(id)
                if (id === undefined) {
                    this.setState({
                        error: true,
                        isLoading: false
                    })
                } else {
                    this.setState({ infoData: id })
                    fetch("https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=" + id.Id)
                        .then((res) => res.json())
                        .then((info) => {
                            this.setState({ infoCompare: info.Data })
                            this.setState({ isLoading: false })
                        })
                }

            })
    }

    closeModal = () => {
        this.props.closeInfo(false);
    }

    getImage() {
        if (this.state.infoData.ImageUrl === undefined) {
            return "https://www.google.com.vn/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiixfvx17reAhVVAHIKHc16CSgQjRx6BAgBEAU&url=https%3A%2F%2Fminecraft.novaskin.me%2Fsearch%3Fq%3Dqieli%252064x64&psig=AOvVaw1_LH7d3VispYDdpY_kqO5G&ust=1541419130266295"
        } else {
            return "https://www.cryptocompare.com" + this.state.infoData.ImageUrl
        }
    }

    priceColor = (item) => {
        if (item >= 0) {
            return "#6DBF47"
        } else {
            return "#FC6062"
        }
    }

    getHTMLPage(data){
            return (
                <WebView
                    ignoreSslError={true}
                    scalesPageToFit={(Platform.OS === 'ios') ? false : true}
                    source={{ html: data }} />
            )
    }

    render() {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.infoOpen}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}
                >
                    {this.state.isLoading === true && <View style={styles.boxing}>
                        <Spinner color="#FD9240" />
                    </View>}
                    {this.state.isLoading === false && <View style={{ flex: 1 }}>
                        <Header androidStatusBarColor="#D8D8D8" style={{ backgroundColor: "#D8D8D8" }}>
                            <Left />
                            <Body>
                                <Text style={{ color: "#000000" }}>{this.state.price.name}</Text>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={20} name="times" onPress={() => this.closeModal()} />
                                </Button>
                            </Right>
                        </Header>
                        {this.state.error === false && <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Image
                                        style={styles.logo}
                                        source={{ uri: this.getImage() }} />
                                </View>
                                <View style={{ flex: 1, marginTop: 5 }}>
                                    <Text style={{ marginTop: 5 }}>%24: </Text>
                                    <Text>Price: </Text>
                                    <Text>Index: </Text>
                                    <Text>Market Cap: </Text>
                                    <Text>Volume: </Text>
                                </View>
                                <View style={{ flex: 1, marginTop: 5 }}>
                                    <Text style={{ marginTop: 5, color: this.priceColor(this.state.price.percent_change_24h) }}>{this.state.price.percent_change_24h} </Text>
                                    <Text>{numberFormat(this.state.price.price_usd)}</Text>
                                    <Text>{this.state.price.formulaValue.toFixed(2)}</Text>
                                    <Text>$ {numberFormat(this.state.price.market_cap_usd)}</Text>
                                    <Text>{numberFormat(this.state.price['24h_volume_usd'])}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 3 }}>
                                <Text style={styles.about}>About</Text>
                                <View style={{ flex: 1 }}>
                                    {this.getHTMLPage(this.state.infoCompare.General.Description)}
                                </View>
                            </View>
                        </View>}
                        {this.state.error === true && <View style={styles.errorBox}>
                            <Text style={styles.textError}>Sorry but information not found </Text>
                            <Icon style={styles.like} color="#FF6667" size={26} name="question-circle" />
                        </View>}
                    </View>}
                </Modal>
            </View>)
    }
}

var styles = StyleSheet.create({

    boxing: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginTop: 10,
        marginBottom: 10,
        width: 100,
        height: 100
    },
    about: {
        textAlign: "center",
    },
    errorBox: {
        flex: 1,
        height: 100,
        justifyContent: 'center',

    },
    textError: {
        width: "80%",
        fontSize: 20,
        alignSelf: "center",
        textAlign: 'center'
    },
    like: {
        alignSelf: "center",
        textAlign: 'center',
    },
})

export default LoginUser