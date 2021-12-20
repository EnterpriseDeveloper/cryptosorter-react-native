import React, { Component } from 'react';
import { View, Modal, StyleSheet, Image } from 'react-native';
import { Header, Item, Input, Label, Left, Right, Body, Form, Container, Button, Segment, Content, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'react-native-firebase';



class LoginUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: false,
            loginTab: true,
            signUpTab: false,
            lEmail: '',
            lPassword: '',
            sEmail: '',
            sPassword: '',
            error: ''
        }
    }

    closeModal = () => {
        this.props.closeModal(false);
    }

    signUp = () => {
            firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.sEmail, this.state.sPassword).then((data) => {
                this.closeModal()
            }).catch((error) => {
                if (error) {
                this.setState({error: error.message})
                }
            })
    }

    login = () => {
            firebase.auth().signInWithEmailAndPassword(this.state.lEmail, this.state.lPassword)
                .then(() => {
                    this.closeModal()
                })
                .catch((error) => {
                    if (error) {
                        this.setState({error: error.message})
                    }
                })
    }

    loginEmailValid() {
        let data = this.state.lEmail;
        let reg = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
        if (data != '') {
            if (reg.test(data) === true) {
                return false;
            } else if (reg.test(data) === false) {
                return true;
            }
            return null;
        }else{
            return null
        }
    }

    signInEmailValid() {
        let data = this.state.sEmail;
        let reg = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
        if (data != '') {
            if (reg.test(data) === true) {
                return false;
            } else if (reg.test(data) === false) {
                return true;
            }
            return null;
        }else{
            return null
        }
    }

    loginPasswordValid() {
        const data = this.state.lPassword;
        let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
        if (data != '') {
            if (reg.test(data) === true && data.length >= 6) {
                return false
            } else if (reg.test(data) === false && data.length < 6) {
                return true
            };
            return null;
        }else{
            return null
        }
    }

    signInPasswordValid() {
        const data = this.state.sPassword;
        let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
        if (data != '') {
            if (reg.test(data) === true && data.length >= 6) {
                return false;
            } else if (reg.test(data) === false && data.length < 6) {
                return true
            };
            return null;
        }else{
            return null
        }
    }

    goToSignUp = () =>{
        this.setState({ signUpTab: false, loginTab: true, error: ''})
    }

    goToLogin = () =>{
        this.setState({ signUpTab: true, loginTab: false, error: ''})
    }

    getActiveColor(data){
        if(data === true){
            return "#000000"
        }else{
            return "#ffffff"
        }
        
    }

    render() {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <Container>
                        <Header hasSegment androidStatusBarColor="#D8D8D8" style={{backgroundColor: "#D8D8D8"}}>
                            <Left />
                            <Body>
                                <Segment style={{backgroundColor: "#D8D8D8"}}>
                                    <Button style={{color: this.getActiveColor(this.state.loginTab)}} onPress={() => { this.goToSignUp() }} first active={this.state.loginTab}><Text>Login</Text></Button>
                                    <Button style={{color: this.getActiveColor(this.state.signUpTab)}} onPress={() => { this.goToLogin() }} last active={this.state.signUpTab}><Text>Sign Up</Text></Button>
                                </Segment>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={20} name="times" onPress={() => this.closeModal()} />
                                </Button>
                            </Right>
                        </Header>
                        <Content padder>
                            {this.state.loginTab && <View>
                                <View style={styles.container}>
                                    <Image
                                        style={styles.logo}
                                        source={require('../../assets/logo.png')} />
                                    <Text style={styles.textLogo}>CryptoSorter</Text>
                                </View>
                                <Form>
                                    <Item inlineLabel error={this.loginEmailValid()} success={!this.loginEmailValid() && this.loginEmailValid() != null}>
                                        <Label>Email</Label>
                                        <Input value={this.state.lEmail}
                                            onChangeText={(text) => { this.setState({ lEmail: text }) }} />
                                        {this.loginEmailValid() && <Icon color="#FF6667" size={20} name='times-circle' />}
                                        {!this.loginEmailValid() && this.loginEmailValid() != null && <Icon color="#34B11E" size={20} name='check-circle' />}
                                    </Item>
                                    <Item inlineLabel last error={this.loginPasswordValid()} success={!this.loginPasswordValid() && this.loginPasswordValid() != null}>
                                        <Label>Password</Label>
                                        <Input value={this.state.lPassword}
                                            onChangeText={(text) => { this.setState({ lPassword: text }) }} />
                                        {this.loginPasswordValid() && <Icon color="#FF6667" size={20} name='times-circle' />}
                                        {!this.loginPasswordValid() && this.loginPasswordValid() != null && <Icon color="#34B11E" size={20} name='check-circle' />}
                                    </Item>
                                    <Text style={styles.hellpText}>*Must contain one letter or one number</Text>
                                </Form>
                                <Button disabled={!(!this.loginPasswordValid() && this.loginPasswordValid() != null && !this.loginEmailValid() && this.loginEmailValid() != null)} 
                                       onPress={() => { this.login() }} style={styles.login} block>
                                    <Text>Login</Text>
                                </Button>
                                {this.state.error.length != 0 &&<Text style={styles.error}>{this.state.error}</Text>}
                            </View>}
                            {this.state.signUpTab && <View>
                                <View style={styles.container}>
                                    <Image
                                        style={styles.logo}
                                        source={require('../../assets/logo.png')} />
                                    <Text style={styles.textLogo}>CryptoSorter</Text>
                                </View>
                                <Form>
                                    <Item inlineLabel error={this.signInEmailValid()} success={!this.signInEmailValid() && this.signInEmailValid() != null}>
                                        <Label>Email</Label>
                                        <Input value={this.state.sEmail}
                                            onChangeText={(text) => { this.setState({ sEmail: text }) }} />
                                        {this.signInEmailValid() && <Icon color="#FF6667" size={20} name='times-circle' />}
                                        {!this.signInEmailValid() && this.signInEmailValid() != null && <Icon color="#34B11E" size={20} name='check-circle' />}
                                    </Item>
                                    <Item inlineLabel last success={!this.signInPasswordValid() && this.signInPasswordValid() != null}>
                                        <Label>Password</Label>
                                        <Input value={this.state.sPassword}
                                            onChangeText={(text) => { this.setState({ sPassword: text }) }} />
                                        {this.signInPasswordValid() && <Icon color="#FF6667" size={20} name='times-circle' />}
                                        {!this.signInPasswordValid() && this.signInPasswordValid() != null && <Icon color="#34B11E" size={20} name='check-circle' />}
                                    </Item>
                                    <Text style={styles.hellpText}>*Must contain one letter or one number</Text>
                                </Form>
                                <Button disabled={!(!this.signInPasswordValid() && this.signInPasswordValid() != null && !this.signInEmailValid() && this.signInEmailValid() != null)} 
                                onPress={() => this.signUp()} style={styles.login} block>
                                    <Text>Sign Up</Text>
                                </Button>
                                {this.state.error.length != 0 &&<Text>{this.state.error}</Text>}
                            </View>}
                        </Content>
                    </Container>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        marginTop: 20
    },
    textLogo: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20
    },
    logo: {
        marginTop: 10,
        marginBottom: 10,
        width: 150,
        height: 150
    },
    hellpText:{
        fontSize: 10,
        paddingLeft: 10
    },
    error:{
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
        textAlign: 'center',
        fontSize: 12,
        color: "#FF6666",
    }
});


export default LoginUser;

