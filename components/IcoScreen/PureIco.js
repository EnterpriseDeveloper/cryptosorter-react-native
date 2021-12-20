import React, { PureComponent } from 'react';
import { Image, View, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Left, Right, Body, Text, Card, CardItem, Button, } from 'native-base';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ListItem extends PureComponent  {


    render() {
        Moment.locale('en');
        return (
            <View>
                <Card style={{ flex: 0 }}>
                    <CardItem>
                        <Left>
                            <Image source={{ uri: this.props.item.image }} style={this.props.styles.image} />
                        </Left>
                        <Right>
                            <Text>Start: {Moment(this.props.item.start_time).format('L')}</Text>
                            <Text>End: {Moment(this.props.item.end_time).format('L')}</Text>
                        </Right>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text>
                                {this.props.item.description}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            <TouchableOpacity onPress={() => Linking.openURL(this.props.item.website)}>
                                <Text style={{ color: 'blue' }}>
                                    Website
                                </Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <Button onPress={() => { this.props.icoAction(this.props.item) }} style={styles.heart} transparent>
                                <Icon color={this.props.item.liked === true ? "#FD9240" : "#000000"} size={18} name={this.props.icon} />
                            </Button>
                        </Right>
                    </CardItem>
                </Card>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    heart: {
        paddingRight: 15,
    }
});