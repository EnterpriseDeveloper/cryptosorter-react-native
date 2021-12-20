import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { pushFirebase } from '../../services/getApi';
import { Header, Left, Right, Body, Title, Container, Spinner, } from 'native-base';
import PureIco from './PureIco';
import { getApiFirebase } from '../../services/getApi';
import { connect } from 'react-redux';
import LoginUser from '../LoginUser/LoginUser';




import Icon from 'react-native-vector-icons/FontAwesome';

class IcoUpcoming extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            visible: false,
            likeIco: []
        }
    }

    componentDidMount() {
        this.getApiData()
    }

    getApiData = () => {
        fetch("http://chasing-coins.com/api/v1/icos/upcoming")
        .then((res) => res.json())
        .then((icoApi) => {
            let icoData = icoApi.map((x) => {
                let o = Object.assign({}, x);
                o.liked = false;
                return o
            })
            if (this.props.userAuth !== null) {
                this.getLikeIco(icoData)
            } else {
                this.setState({
                    apiIcoUpcoming: icoData,
                    isLoading: false
                })
            }

        })
    }

    componentWillUpdate(nextProps, prevState) {
        if(this.state.likeIco !== prevState.likeIco){
            this.getApiData();
        }
        if (this.props.userAuth !== nextProps.userAuth) {
            this.getApiData();
        }
    }

    getLikeIco = (icoData) => {
        getApiFirebase("icoLikes/" + this.props.userAuth._user.uid).then((dataDB) => {
            var ico = []
            dataDB.forEach((item) => {
                ico.push(item._value);
            })
            ico.forEach((item) => {
                icoData.forEach((x) => {
                    if (x.name == item.name) {
                        return x.liked = true;
                    }
                })
            })
            this.setState({
                likeIco: ico,
                apiIcoUpcoming: icoData,
                isLoading: false,
                refresh: !this.state.refresh
            });
        })
    }

    closeModal = (data) => {
        this.setState({ visible: data })
    }

    icoAction = (item) => {
        if (this.props.userAuth !== null) {
            let search = this.state.likeIco.find(x => x.name === item.name);
            if (search === undefined) {
                pushFirebase("icoLikes/" + this.props.userAuth._user.uid, item).then((data) => {
                    if (data === null) {
                        this.getLikeIco(this.state.apiIcoUpcoming);
                    }
                })
            }
        } else {
            this.setState({ visible: true });
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
        return (
            <Container>
                <Header androidStatusBarColor="#D8D8D8" style={{backgroundColor: "#D8D8D8"}}>
                    <Left>
                        <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={25} name="bars" onPress={() => this.props.navigation.openDrawer()} />
                    </Left>
                    <Body >
                        <Title style={{color: "#000000"}}>UPCOMING</Title>
                    </Body>
                    <Right />
                </Header>
                <FlatList
                    data={this.state.apiIcoUpcoming}
                    extraData={this.state.refresh}
                    renderItem={({ item }, index) =>
                        <PureIco
                            icoAction={(item) => this.icoAction(item)}
                            item={item}
                            icon="heart"
                            styles={styles} />
                    }
                    keyExtractor={({ name }, index) => name}
                />

                <LoginUser
                    closeModal={this.closeModal}
                    modalVisible={this.state.visible} />

            </Container>
        )
    }
}

var styles = StyleSheet.create({

    boxing: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 30,
    }
})

const mapStateToProps = state => {
    return {
        userAuth: state.basic.userAuth,
    }
}

export default connect(mapStateToProps)(IcoUpcoming);