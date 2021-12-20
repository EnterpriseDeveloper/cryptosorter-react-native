import React, { Component } from 'react';
import { View, Image, Modal, StyleSheet } from 'react-native';
import { Header, Title, Item, Input, Label, Left, Right, Body, Text, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';




class Filter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minIndex: '',
            maxIndex: '',
            minPrice: '',
            maxPrice: ''
        }
    }

    closeModal = () => {
        this.props.closeFilter(false);
    }

    onSave = () =>{
        this.props.setFilter(this.state);
        this.closeModal()
    }

    render() {
        return (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.filterOpen}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}
                >
                <Header androidStatusBarColor="#D8D8D8" style={{backgroundColor: "#D8D8D8"}}>                       
                 <Left />
                        <Body>
                            <Title style={{color: "#000000"}}>FILTER</Title>
                        </Body>
                        <Right>
                            <Icon style={{ paddingLeft: 10, paddingTop: 5 }} size={20} name="times" onPress={() => this.closeModal()} />
                        </Right>
                    </Header>
                    <View style={{flex: 1}}>
                        <View style={styles.inputBox}>
                            <Item inlineLabel >
                                <Label>Min Index</Label>
                                <Input
                                    keyboardType='numeric'
                                    value={this.state.minIndex}
                                    onChangeText={(value) => { this.setState({ minIndex: value }) }} />
                            </Item>
                            <Item inlineLabel >
                                <Label>Max Index</Label>
                                <Input
                                    keyboardType='numeric'
                                    value={this.state.maxIndex}
                                    onChangeText={(value) => { this.setState({ maxIndex: value }) }} />
                            </Item>
                            <Item inlineLabel >
                                <Label>Min Price</Label>
                                <Input
                                    keyboardType='numeric'
                                    value={this.state.minPrice}
                                    onChangeText={(value) => { this.setState({ minPrice: value }) }} />
                            </Item>
                            <Item inlineLabel >
                                <Label>Max Price</Label>
                                <Input
                                    keyboardType='numeric'
                                    value={this.state.maxPrice}
                                    onChangeText={(value) => { this.setState({ maxPrice: value }) }} />
                            </Item>
                        </View>
                        <Button onPress={()=>this.onSave()} style={styles.button} full success>
                            <Text>SAVE</Text>
                        </Button>
                    </View>
                </Modal>
        )
    }
}

var styles = StyleSheet.create({
    button: {
        marginTop: 20,
    },
    inputBox:{
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    }
})

export default Filter