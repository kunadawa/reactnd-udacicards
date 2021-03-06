import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Animated} from 'react-native';
import {AntDesign} from '@expo/vector-icons'
import {gray, white} from '../utils/colors'
import AddDeck from './AddDeck'
import {getDecks} from '../utils/api'
import {NavigationEvents} from 'react-navigation'

const ANIMATION_DURATION = 2000

export default class Decks extends React.Component {
	static navigationOptions = {
		title: 'Decks'
	}

	state = {
		decks:null,
		bounceValue: new Animated.Value(0)
	}

	// CREDIT: https://forums.expo.io/t/how-to-parse-data-from-asyncstorage-to-text/3417/8
	async componentDidMount() {
		const decks = await getDecks()
		this.setState(state => ({
				...state,
				'decks':JSON.parse(decks)
			})
		)
	}

	showDeck = (deck) => {
		const {bounceValue} = this.state
		Animated.timing(bounceValue, {
					toValue:1,
					duration:ANIMATION_DURATION,
				}).start(() => {
					this.setState(state => ({
						...state,
						bounceValue: new Animated.Value(0)
					}))
					this.props.navigation.navigate('deck', {'deck': deck})
				})
	}

	addDeck = () => {
		this.props.navigation.navigate('addDeck')
	}

	refreshDecks = () => {
		this.componentDidMount()
			.then(results => console.log(results))
			.catch((error) => {console.log(error)})
	}

	render() {
		const {decks, bounceValue} = this.state
		debugger
		return (
			<View style={{flex:1}}>
				{
					decks === null || decks === undefined
					?
					<Text style={styles.noDecks}>No decks added yet</Text>
					:
					<FlatList 
						data={Object.keys(decks).map(deckId => decks[deckId])}
						renderItem={
							({item}) => 
								<TouchableOpacity onPress={() => this.showDeck(item)}>
									<Animated.Text style={[styles.deck, {
										transform: [
											{scale: bounceValue},
											{
												rotate: bounceValue.interpolate({
													inputRange:[0,1],
													outputRange:['35deg', '0deg'],
													extrapolate:'clamp',
												})
											}
										]
									}]}>
										{`${item.title} - ${item.questions.length} card(s)`}
									</Animated.Text>
								</TouchableOpacity>
						}
						keyExtractor={(item, index) => item.title}
					/>
					
				}
				<TouchableOpacity onPress={this.addDeck} style={{marginTop:10, alignItems:'center'}} >
					<AntDesign name='plussquareo' size={60}/>
					<Text style={{fontSize:20}}>Add Deck</Text>
				</TouchableOpacity>
				<NavigationEvents onWillFocus={this.refreshDecks}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	deck:{
		fontSize:20,
		backgroundColor:gray,
		margin:10,
		padding:15,
		color:white,
	},
	noDecks: {fontSize:20, alignSelf:'center'},
})
