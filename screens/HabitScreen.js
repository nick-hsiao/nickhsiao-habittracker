import React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Button, CheckBox, Input, ButtonGroup, Slider, ButtonToolbar } from 'react-native-elements';
import { Container } from "native-base";
import * as firebase from 'firebase';

/**
 * 
 * initial state, initializes all variables for completing habits
 */
const INITIAL_STATE = {
  habitName: "",
  goalPeriod: 0,
  timesPerPeriod: 1,
  sunP: 0,
  monP: 0,
  tueP: 0,
  wedP: 0,
  thuP: 0,
  friP: 0,
  satP: 0,
  saved: 'false',
  count: 0,
  reminders: false,
  error: null,
};

/**
 * create a new habit screen class, allows user to create a new habit and add it to the database
 * 
 * @author nickhsiao, richardpham
 */
export default class HabitScreen extends React.Component {
  /**
   * default constructor, initialize variables and state
   * 
   */
  constructor() {
    super()
    this.state = {

      dayIndex: 0,
      ...INITIAL_STATE,
      isModalVisible: false,
      checked: false,

    }
    this.updateIndex = this.updateIndex.bind(this)

  }

  user = firebase.auth().currentUser;
  uid = this.user.uid;

  /**
   * used to update index of goal period variable
   * 
   * @param {*} goalPeriod the goal period defined as 0,1 or 2 to indicated day,week or month
   */
  updateIndex(goalPeriod) {
    this.setState({ goalPeriod })
  }

  /**
   * navigation options, title
   * 
   */
  static navigationOptions = {
    title: '',
  };

  /**
   * called when user clicks reminder button, sets reminder state
   * 
   */
  _toggleCheck = () => {
    this.setState({ checked: !this.state.checked });
    this.setState({ reminders: !this.state.reminders });
  }

  /**
   * set the habit's name
   * 
   * @param text name parsed from input component
   */
  _handleName = (text) => {
    this.setState({ habitName: text })
  }

  /**
   * set the state of the trackers
   * 
   */
  _onSunPress = () => {
    this.setState({ sunP: this.state.sunP === 0 ? 1 : 0 });
  }
  _onMonPress = () =>
    this.setState({ monP: this.state.monP === 0 ? 1 : 0 });

  _onTuePress = () =>
    this.setState({ tueP: this.state.tueP === 0 ? 1 : 0 });

  _onWedPress = () =>
    this.setState({ wedP: this.state.wedP === 0 ? 1 : 0 });

  _onThuPress = () =>
    this.setState({ thuP: this.state.thuP === 0 ? 1 : 0 });

  _onFriPress = () =>
    this.setState({ friP: this.state.friP === 0 ? 1 : 0 });

  _onSatPress = () =>
    this.setState({ satP: this.state.satP === 0 ? 1 : 0 });

  /**
   * called when user saves habits, takes all the variables and pushes to database creating new habit object under current user's id
   * 
   * @param habitName habit name
   * @param sunP sunday tracker
   * @param monP monday tracker
   * @param tueP tuesday tracker
   * @param wedP wednesday tracker
   * @param thuP thursday tracker
   * @param friP friday tracker
   * @param satP saturday tracker
   * @param timesPerPeriod times per goal period
   * @param reminders boolean for reminders
   * @param goalPeriod goal period
   * @param count initialized to 0
   * 
   */
  writeHabitData = (habitName, sunP, monP, tueP, wedP, thuP, friP, satP, timesPerPeriod, reminders, goalPeriod, count) => {

    var key = firebase.database().ref().push().key;


    firebase.database().ref(`UsersList/${this.uid}/z_habits/${key}`).set({
      habitName,
      sunP,
      monP,
      tueP,
      wedP,
      thuP,
      friP,
      satP,
      timesPerPeriod,
      reminders,
      goalPeriod,
      count,
      habitid: key

    }).then((data) => {
      //reset
      this.setState({ habitName: '' });
      this.setState({ timesPerPeriod: 1 });
      this.setState({ sunP: 0 });
      this.setState({ monP: 0 });
      this.setState({ tueP: 0 });
      this.setState({ wedP: 0 });
      this.setState({ thuP: 0 });
      this.setState({ friP: 0 });
      this.setState({ satP: 0 });
      this.setState({ timesPerPeriod: 1 });
      this.setState({ reminders: false });
      this.setState({ checked: false });
      this.setState({ goalPeriod: 0 });
    }).catch((error) => {
      //error callback
      console.log('error ', error)
    })
    this.props.navigation.navigate('Home');

  }

  /**
   * renders the screen, defines all user interface components and listeners for this screen
   * 
   */
  render() {

    const buttons = ['Daily', 'Weekly', 'Monthly']
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const isInvalid = this.state.habitName.length < 2;



    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={StyleSheet.scrollContainer}>


          <View style={{ height: 440, backgroundColor: 'white', marginTop: 70 }}>

            <Text style={styles.titleText}> Habit Name: </Text>
            <Input style={styles.textInput}
              inputStyle={{ paddingLeft: 8 }}

              placeholder='Ex: Drink Water'
              //leftIcon={{ type: 'feather', name: 'edit',marginRight: 5}}
              onChangeText={(habitName) => this.setState({ habitName })}
            />

            <Text style={styles.titleText}> Goal Period: </Text>
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={this.state.goalPeriod}
              buttons={buttons}
              containerStyle={{ height: 30 }}
            />

            <Text style={styles.titleText}>
              Times Per {this.state.goalPeriod === 0 ? 'Day' : this.state.goalPeriod === 1 ? 'Week' : 'Month'}:
            {this.state.timesPerPeriod} </Text>
            <View style={{ marginLeft: 10, marginRight: 10, alignItems: 'stretch', justifyContent: 'center', flex: 1 }}>
              <Slider trackStyle={{
                //
              }}

                thumbStyle={{
                  backgroundColor: '#E9765B',
                  width: 17,
                  height: 17,
                }}
                minimumTrackTintColor = '#E9765B'
                thumbTouchSize={{ width: 70, height: 70 }}
                value={1}
                maximumValue={10}
                minimumValue={1}
                step={1}
                timesPerPeriod={this.state.timesPerPeriod}
                onValueChange={timesPerPeriod => this.setState({ timesPerPeriod })}

              />
            </View>

            <Text style={styles.trackText}> Track Which Days?: </Text>

            <Container style={{ flexDirection: 'row' }}>
              <TouchableOpacity value='sun'
                onPress={this._onSunPress}
                style={this.state.sunP === 0 ? styles.cButton : styles.cButtonPressed} >
                <Text style={this.state.sunP === 0 ? styles.dayText : styles.dayTextPressed} >S</Text>
              </TouchableOpacity>
              <TouchableOpacity value='mon'
                onPress={this._onMonPress}
                style={this.state.monP === 0 ? styles.cButton : styles.cButtonPressed} >
                <Text style={this.state.monP === 0 ? styles.dayText : styles.dayTextPressed} >M</Text>
              </TouchableOpacity>
              <TouchableOpacity value='tue'
                onPress={this._onTuePress}
                style={this.state.tueP === 0 ? styles.cButton : styles.cButtonPressed} >
                <Text style={this.state.tueP === 0 ? styles.dayText : styles.dayTextPressed} >T</Text>
              </TouchableOpacity>
              <TouchableOpacity value='wed'
                onPress={this._onWedPress}
                style={this.state.wedP === 0 ? styles.cButton : styles.cButtonPressed} >
                <Text style={this.state.wedP === 0 ? styles.dayText : styles.dayTextPressed} >W</Text>
              </TouchableOpacity>
              <TouchableOpacity value='thu'
                onPress={this._onThuPress}
                style={this.state.thuP === 0 ? styles.cButton : styles.cButtonPressed} >
                <Text style={this.state.thuP === 0 ? styles.dayText : styles.dayTextPressed} >H</Text>
              </TouchableOpacity>
              <TouchableOpacity value='fri'
                onPress={this._onFriPress}
                style={this.state.friP === 0 ? styles.cButton : styles.cButtonPressed} >
                <Text style={this.state.friP === 0 ? styles.dayText : styles.dayTextPressed} >F</Text>
              </TouchableOpacity>
              <TouchableOpacity value='sat'
                onPress={this._onSatPress}
                style={this.state.satP === 0 ? styles.cButton : styles.cButtonPressed} >
                <Text style={this.state.satP === 0 ? styles.dayText : styles.dayTextPressed} >A</Text>
              </TouchableOpacity>

            </Container>

            <Text style={styles.titleText}> Reminders: </Text>
            <CheckBox
              left
              fontFamily='System'
              title='REMINDERS'
              checked={this.state.checked}
              checkedColor='green'
              onPress={this._toggleCheck}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Button
                disabled={isInvalid}
                onPress={() => this.writeHabitData(this.state.habitName, this.state.sunP, this.state.monP,
                  this.state.tueP, this.state.wedP, this.state.thuP, this.state.friP,
                  this.state.satP, this.state.timesPerPeriod, this.state.reminders, this.state.goalPeriod, this.state.count)}

                style={styles.button}
                title="Save">
              </Button>
              <Button style={styles.button}
                onPress={() => this.props.navigation.navigate('Home')}
                title="Cancel">
              </Button>
            </View>

          </View>

        </ScrollView>
      </View>
    );
  }
}


/**
 * styles sheet used to for styling and positioning of components and text
 * 
 */
const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    marginLeft: 5,
    color: '#414042'
  },
  trackText: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: 18,
    paddingTop: 5,
    marginLeft: 5,
    paddingBottom: 8,
    color: '#414042'
  },
  scrollContainer: {
    flexGrow: 1
  },

  container: {
    paddingTop: 5,
    flex: 1,
    flexDirection: 'row',
    marginLeft: 5,
  },

  dayText: {
    fontSize: 17,

  },
  dayTextPressed: {
    fontSize: 17,

    color: 'white',
  },
  button: {
    borderRadius: 5,
    margin: 10,
    width: 100

  },
  cButton: {
    borderWidth: 0.5,
    borderRadius: 100,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginRight: 6,
    marginLeft: 6,

  },

  cButtonPressed: {

    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginRight: 6,
    marginLeft: 6,
    backgroundColor: '#4283CF',
    textDecorationColor: 'white'
  },
  modalContent: {
    fontSize: 30,
    fontFamily: 'System',
  },
  modalButton: {
    paddingTop: 350,
    marginLeft: 100,
    marginRight: 100
  },
  modalText: {
    fontSize: 30,
    paddingTop: 50,
    textAlign: 'center',
  },
  textInput: {
    textAlign: 'center',
    marginTop: 40,
    marginLeft: 60,
    marginRight: 60,
    fontSize: 20,
    borderWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around'
  },

});
