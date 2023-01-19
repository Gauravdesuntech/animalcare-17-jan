import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  TouchableHighlight,
  TextInput,
  Alert,
  Linking,
  Platform,
  RefreshControl
} from "react-native";
import { Container } from "native-base";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from "expo-image-picker";
import { result } from "lodash";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors } from "../../config";
import styles from "../../config/Styles";
import { Header, ListEmpty, OverlayLoader } from "../../component";
import { addAttendance, getAttendanceMonthWise, getAttendanceTiming, getWorkTypes } from "../../services/AttendenceService";
import Spinner from "../../component/tasks/Spinner";

export default class MonthReport extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      date: moment(new Date()),
      reports: [],
      workTypes: [],
      selectedMonth: Number(moment(new Date()).format("M")),
      months: [
        { id: 1, title: "January" },
        { id: 2, title: "February" },
        { id: 3, title: "March" },
        { id: 4, title: "April" },
        { id: 5, title: "May" },
        { id: 6, title: "June" },
        { id: 7, title: "July" },
        { id: 8, title: "August" },
        { id: 9, title: "September" },
        { id: 10, title: "October" },
        { id: 11, title: "November" },
        { id: 12, title: "December" }
      ]
    };
  }

  componentDidMount() {
    console.log(moment(new Date()).format("M"));
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  }

  onScreenFocus = () => {
    this.setState(
      {
        isLoading: true,
        reports: [],
      },
      () => {
        this.loadAttendanceMonthWise();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  monthChangeHandler = (value) => {
    this.setState({
      selectedMonth: value,
      isLoading: true
    }, () => {
      this.loadAttendanceMonthWise();
    });
  }


  loadAttendanceMonthWise = () => {
    getAttendanceMonthWise(this.state.selectedMonth, this.props.route.params.id, this.context.userDetails.access_token)
      .then((res) => {
        this.setState({
          reports: res,
          isLoading: false
        })
      }).catch((err) => console.log(err))
  }


  renderItem = ({ item }) => (
    <View style={styles.attendenceTable}>
      <View style={[styles.attendenceTableRow, { height: 30}]}>
        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
          {moment(item.punch_date, "YYYY-MM-DD").format("DD/MM/YY")}
        </Text>
      </View>
      <View style={[styles.attendenceTableRow, { height: 30}]}>
      {item.work_start == null ? null :
          <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
            {moment(item.work_start, "HH:mm:ss").format("LT")} 
          </Text>
        }
      </View>
      <View style={[styles.attendenceTableRow, { height: 30}]}>
      {item.work_end == null ? null :
          <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
            {!item.work_end ? "" : moment(item.work_end, "HH:mm:ss").format("LT")}
          </Text>
        }
      </View>
      <View style={[styles.attendenceTableRow, { height: 30}]}>
      {!item.total_wokring_hour ? null :
      <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
        {item.total_wokring_hour}
      </Text>
    }
      </View>
    </View>
  );


  render() {
    return (
      <>
        <Container>
          <Header title={
            // <View>
            //   <Text style={styles2.HeadDateTime}>
            //     {moment(this.state.date).format("DD / MMM / YYYY")}
            //   </Text>
            //   <Text style={styles2.HeadDateTime}>
            //     {moment(this.state.date).format('LT (ddd)')}
            //   </Text>
            // </View>
            "Month Reports"
          } />
          <OverlayLoader visible={this.state.isLoading} />
          <KeyboardAwareScrollView 
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.onScreenFocus}
            />
          }
          >
            <View style={styles2.container}>
              <View style={styles2.titleContainer}>
                <Text style={styles2.userName}>{this.props.route.params.full_name}</Text>
                <Picker
                  selectedValue={this.state.selectedMonth}
                  onValueChange={(itemValue, itemIndex) =>
                    this.monthChangeHandler(itemValue)
                  }
                  style={styles2.button}
                >
                  {this.state.months.map((item) => {
                    return (
                      <Picker.Item
                        key={item.id.toString()}
                        label={item.title}
                        value={item.id}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View style={[styles.boxBorder, { width: "100%", }]}>
                <View style={styles.attendenceTable}>
                  <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                    <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                      Date
                    </Text>
                  </View>
                  <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                    <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                      In
                    </Text>
                  </View>
                  <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                    <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                      Out
                    </Text>
                  </View>
                  <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                    <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                      Hours
                    </Text>
                  </View>
                </View>
                <FlatList
                  data={this.state.reports}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => item.id.toString()}
                  ontentContainerStyle={
                    this.state.reports.length === 0 ? styles.container : null
                  }
                  ListEmptyComponent={() => <ListEmpty />}
                  numColumns={1}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Container>
      </>
    );
  }
}

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const size = Dimensions.get('window').width / 2;

const styles2 = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    textAlign: "center",
    alignItems: "center",
    width: "100%",
    padding: 8
  },
  HeadDateTime: {
    color: 'white'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: "space-evenly"
  },
  button: {
    backgroundColor: Colors.blueBg,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    top: 20,
    marginBottom: 40,
    marginLeft: 50,
    alignItems: 'center',
    width: 150,
    color: Colors.white
  },
  itemContainer: {
    width: "47%",
    height: 80,
    borderColor: "#ddd",
    borderWidth: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#90EE90"
  },
  item: {
    flex: 1,
    margin: 3,
    backgroundColor: 'lightblue',
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputBox: {
    alignItems: 'center',
    width: "98%",
    overflow: "hidden",
    flexDirection: "row",
    padding: 5,
    borderRadius: 3,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    marginBottom: 5,
    marginTop: 5,
    height: 80
  },
  input: {
    color: Colors.textColor,
    fontSize: 15,
    paddingLeft: 4,
    alignItems: "center",
    color: "#808080"
  },
  inputComment: {
    backgroundColor: "#fff",
    fontSize: 15,
    color: Colors.textColor,
    textAlign: "left",
    width: "60%",
    padding: 5,
  },
  monthName: {
    height: 50,
    width: 80,
    backgroundColor: Colors.blueBg,
    marginLeft: 0,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: 'center'
  },
  userName: {
    color: Colors.textColor,
    marginTop: 30,
    marginRight: 40,
    // lineHeight: 40,
    fontSize: 30,
  },
  listRow: {
    borderColor: "#ddd",
    borderWidth: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "23%",
    height: 50
  }
});




{/* <View style={{
  flexDirection: 'row', width: windowwidth, flex: 1,
  alignSelf: 'stretch',
  marginTop: 10,
}}>
  <View style={[styles.attendenceTableRow, { height: 30}]}>
    <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
      {moment(item.punch_date, "YYYY-MM-DD").format("DD/MM/YY")}
    </Text>
  </View>
  <View style={[styles.attendenceTableRow, { height: 30}]}>
    {!item.total_wokring_hour ? null :
      <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
        {item.total_wokring_hour} Hours
      </Text>
    }
    {item.work_start == null ? null :
      <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
        {moment(item.work_start, "HH:mm:ss").format("HH:mm")} to {!item.work_end ? "" : moment(item.work_end, "HH:mm:ss").format("HH:mm")}
      </Text>
    }
  </View>
  <View style={[styles.attendenceTableRow, { height: 30}]}>
    {!item.total_lunch_hour ? null :
      <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
        {item.total_lunch_hour} Hours
      </Text>
    }
    {item.out_for_lunch == null ? null :
      <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
        {moment(item.out_for_lunch, "HH:mm:ss").format("HH:mm")} to {!item.back_from_lunch ? "" : moment(item.back_from_lunch, "HH:mm:ss").format("HH:mm")}
      </Text>
    }
  </View>
  <View style={[styles.attendenceTableRow, { height: 30}]}>
    {!item.total_outside_work ? null :
      <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
        {item.total_outside_work} Hours
      </Text>
    }
    {item.off_site_work_start == null ? null :
      <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
        {moment(item.off_site_work_start, "HH:mm:ss").format("HH:mm")} to {!item.back_from_off_site_work ? "" : moment(item.back_from_off_site_work, "HH:mm:ss").format("HH:mm")}
      </Text>
    }
  </View>
</View> */}