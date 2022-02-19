import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Alert

} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config';
import firebase from 'firebase';

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      domState: 'normal',
      hasCameraPermissions: null,
      scanned: false,

      bookId: '',
      studentId: '',
    };
  }

  getCameraPermission = async (domState) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({
      hasCameraPermissions: status === 'granted',
      scanned: false,
      domState: domState,
    });
  };

  handleBarCode = async ({ type, data }) => {
    const { domState } = this.state;
    if (domState === 'bookId') {
      this.setState({ domState: 'normal', scanned: true, bookId: data, });
    } else if (domState === 'studentId') {
      this.setState({ domState: 'normal', scanned: true, studentId: data, });
    }
  };
  initiateBookIssue = () => {
    // add a transaction 
    db.collection("Transaction").add({
      bookId: this.state.bookId,
      studentId: this.state.studentId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Issued"
    })
    //update the no. of books student has issued
    db.collection("students").doc(this.state.studentId).update({
      noOfBooksIssued: firebase.firestore.FieldValue.increment(1)
    })
    //change availability of book to false
    db.collection("books").doc(this.state.bookId).update({
      bookAvailable: false
    })
    Alert.alert("Book issued")
    this.setState({ bookId: "", studentId: "" })
  }

  initiateBookReturn = () => {
    db.collection("Transaction").add({
      bookId: this.state.bookId,
      studentId: this.state.studentId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Return"
    })
    //update the no. of books student has issued
    db.collection("students").doc(this.state.studentId).update({
      noOfBooksIssued: firebase.firestore.FieldValue.increment(-1)
    })
    //change availability of book to true 
    db.collection("books").doc(this.state.bookId).update({
      bookAvailable: true
    })
    Alert.alert("Book Returned")
    this.setState({ bookId: "", studentId: "" })
  }


  handleTransactions = () => {
    const { bookId } = this.state;
    db.collection("books")
      .doc(bookId)
      .get()
      .then(doc => {
        var book = doc.data()
        if (book.bookAvailable === true) {
          this.initiateBookIssue();
        }
        else {
          this.initiateBookReturn();
        }
      })
  }

  render() {
    const { domState, hasCameraPermissions, scanned, scannedData } = this.state;

    if (domState != 'normal') {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCode}
        />
      )
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled >
        <ImageBackground
          source={require('../assets/background2.png')}
          style={styles.bgImage}>
          <View style={styles.upperContainer}>
            <Image
              source={require('../assets/appIcon.png')}
              style={styles.appIcon}
            />
            <Image
              source={require('../assets/appName.png')}
              style={styles.appName}
            />
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}

                placeholder={'Book Id'}
                value={this.state.bookId}
                onChangeText={text => {
                  this.setState({
                    bookId: text
                  })
                }}

              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermission('bookId')}>
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.textinputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textinput}

                placeholder={'Student Id'}
                value={this.state.studentId}
                onChangeText={text => {
                  this.setState({
                    studentId: text
                  })
                }}
              />
              <TouchableOpacity
                style={styles.scanbutton}
                onPress={() => this.getCameraPermission('studentId')}>
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>

            </View>
            <TouchableOpacity style={{ backgroundColor: "red", width: 80, height: 30 }}
              onPress={() => this.handleTransactions()}>
              <Text style={{ fontFamily: "Rajdhani_600SemiBold", fontSize: 20, alignSelf: "center" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>

        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 80,
  },
  appName: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: 'center',
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: '#9DFD24',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanbuttonText: {
    fontSize: 24,
    color: '#0A0101',
    fontFamily: 'Rajdhani_600SemiBold',
  },
  textinput: {
    width: '57%',
    height: 50,
    padding: 10,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: '#5653D4',
    fontFamily: 'Rajdhani_600SemiBold',
    color: '#FFFFFF',
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#9DFD24',
    borderColor: '#FFFFFF',
  },
});
