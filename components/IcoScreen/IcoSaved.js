import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { Header, Left, Right, Body, Title, Container, Button, Content, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { getApiFirebase, removeFirebase } from '../../services/getApi';
import LoginUser from '../LoginUser/LoginUser';
import PureIco from './PureIco';



class IcoSaved extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: true,
            likeIco: [],
            reflesh: false
        }
    }


    componentDidMount() {
        this.getApiData()
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.userAuth !== this.props.userAuth) {
            this.setState({isLoading: true})
            this.getApiData();
        }

        if (this.state.likeIco !== prevState.likeIco) {
            this.getApiData();
        }

    }


    getApiData = () => {
        if (this.props.userAuth !== null) {
            getApiFirebase("icoLikes/" + this.props.userAuth._user.uid).then((data) => {
                let ico = []
                data.forEach((child) => {
                    ico.push({
                        description: child.val().description,
                        end_time: child.val().end_time,
                        image: child.val().image,
                        name: child.val().name,
                        start_time: child.val().start_time,
                        url: child.val().url,
                        website: child.val().website,
                        _key: child.key,
                    });
                });
                this.setState({
                    isLoading: false,
                    likeIco: ico,
                    reflesh: !this.state.reflesh
                });
            })
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    closeModal = (data) => {
        this.setState({ visible: data })
    }

    icoAction = (data) => {
        var key = this.state.likeIco.find(x => x.name === data.name);
        removeFirebase("icoLikes/" + this.props.userAuth._user.uid, key._key).then((x) => {
            if (x === null) {
                this.getApiData()
                this.setState({ reflesh: !this.state.reflesh })
            }
        });
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
            <View style={styles.basic}>
                <Header androidStatusBarColor="#D8D8D8" style={{backgroundColor: "#D8D8D8"}}>
                    <Left>
                        <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={25} name="bars" onPress={() => this.props.navigation.openDrawer()} />
                    </Left>
                    <Body >
                        <Title style={{color: "#000000"}}>SAVED</Title>
                    </Body>
                    <Right />
                </Header>
                <Container style={styles.basic} >
                    <LoginUser
                        closeModal={this.closeModal}
                        modalVisible={this.state.visible} />
                    {this.props.userAuth === null && <Container style={styles.boxText}>
                        <Text style={styles.text}>Here you will see your favorite ICOs. For save it here click on
                        </Text>
                        <Button style={styles.heart}
                            onPress={() => this.setState({ visible: true })}
                            transparent
                        ><Icon color="#000000" size={26} name="heart" /></Button>
                    </Container>}

                    {this.props.userAuth !== null && <Container style={styles.basic}>
                        {!this.state.isLoading && <Container style={styles.basic}>

                            {this.state.likeIco.length === 0 && <Container style={styles.boxText}>
                                <Text style={styles.text}>Here you will see your favorite ICOs. For save it here click on</Text>
                                <Icon style={styles.heart} color="#000000" size={26} name="heart" />
                            </Container>}

                            {this.state.likeIco.length !== 0 && <Content>
                                <FlatList
                                    data={this.state.likeIco}
                                    extraData={this.state.reflesh}
                                    renderItem={({ item }, index) =>
                                        <PureIco
                                            icoAction={(item) => this.icoAction(item)}
                                            icon="thumbs-down"
                                            item={item}
                                            styles={styles} />}
                                    keyExtractor={({ name }, index) => name}
                                /></Content>}
                        </Container>}
                    </Container>}
                </Container>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    boxing: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    basic: {
        flex: 1,
    },
    boxText: {
        height: 100,
        justifyContent: 'center',
    },
    text: {
        width: "80%",
        fontSize: 20,
        alignSelf: "center",
        textAlign: 'center'
    },
    heart: {
        alignSelf: "center",
        textAlign: 'center',
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

export default connect(mapStateToProps)(IcoSaved);