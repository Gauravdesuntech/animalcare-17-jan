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
import { Ionicons } from "@expo/vector-icons";
import styles from "../../config/Styles";
import { Header, OverlayLoader } from "../../component";
import { addAttendance, getAttendanceTiming, getWorkTypes } from "../../services/AttendenceService";

export default class ViewAttendance extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            reports: [],
            workTypes: [],
            show: false,
            date: moment(new Date()),
            selectWorkType: '',
            timing: '',
            comments: null,
            imageID: 0,
            Images: [],
            UploadData: [],
            user_id : props.route.params?.data ? props.route.params.data.user_id : undefined,
            full_name : props.route.params?.data ? props.route.params.data.full_name :undefined,
            user_img : props.route.params?.data ? Configs.PROFILE_URL + props.route.params.data.image : undefined,
        };
    }

    componentDidMount() {
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
                this.loadWorkTypes();
                this.loadAttendanceTiming();
            }
        );
    };

    componentWillUnmount = () => {
        this.focusListener();
    };

    loadWorkTypes = () => {
        getWorkTypes(this.context.userDetails.access_token)
            .then((res) => {
                this.setState({
                    workTypes: res,
                    isLoading: false
                })
            }).catch((err) => console.log(err))
    }

    loadAttendanceTiming = () => {
        getAttendanceTiming(moment(this.state.date).format("YYYY-MM-DD"), this.context.userDetails.id, this.context.userDetails.access_token)
            .then((res) => {
                let timing = {};
                if (res.length > 0) {
                    timing = {
                        1: res[0].work_start,
                        2: res[0].work_end,
                        3: res[0].out_for_lunch,
                        4: res[0].back_from_lunch,
                        5: res[0].off_site_work_start,
                        6: res[0].back_from_off_site_work,
                    }
                }
                this.setState({
                    timing: timing,
                    isLoading: false
                })
            }).catch((err) => console.log(err))
    }

    setWorkType = (item) => {
        this.setState({
            selectWorkType: item.id
        })
    }

    openCamera = (type) => {
        ImagePicker.requestCameraPermissionsAsync().then((status) => {
          if (status.granted) {
            let optins = {
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            };
    
            ImagePicker.launchCameraAsync(optins).then((result) => {
              if (!result.cancelled) {
                this.setState({
                  Images: [
                    ...this.state.Images,
                    { id: Number(this.state.imageID) + 1, uri: result.uri },
                  ],
                  imageID: Number(this.state.imageID) + 1,
                  UploadData: [...this.state.UploadData, getFileData(result)],
                  selectWorkType : type
                });
              }
            });
          } else {
            Alert.alert("Please allow camera permission to click images");
          }
        });
      };

    saveAttendance = () => {
        if (!this.state.selectWorkType) {
            alert("Please choose one");
            return;
        } else {
            this.setState({
                isLoading: true
            })
            let obj = {
                user_id: this.state.user_id,
                attandence_type_id: this.state.selectWorkType,
                punch_date: moment(this.state.date).format("YYYY-MM-DD"),
                punch_time: moment(this.state.date).format("HH:mm:ss"),
                comments: this.state.comments
            }
            addAttendance(obj, this.context.userDetails.access_token).then((res) => {
                this.setState({
                    isLoading: false
                })
                alert("Attendance Successfully done!!")
                this.props.navigation.goBack();
            }).catch((err) => console.log(err))
        }
    }

    renderItem = ({ item }) => (
        <View style={styles.attendenceTable}>
            <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                    Name
                </Text>
            </View>
            <View style={styles.attendenceTableRow}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                    Work Hours
                </Text>
            </View>
            <View style={styles.attendenceTableRow}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                    Lunch
                </Text>
            </View>
            <View style={styles.attendenceTableRow}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                    Off Site
                </Text>
            </View>
        </View>
    );

    render() {
        return (
            <>
                <Container>
                    <Header title={"Attendance"} />
                    <OverlayLoader visible={this.state.isLoading} />
                    <KeyboardAwareScrollView refreshControl={
                        <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this.onScreenFocus}
                        />
                    }>
                        <View style={styles2.container}>
                            <View>
                                <TouchableOpacity
                                    style={styles2.button}
                                    onPress={() =>
                                        this.props.navigation.navigate("DaysReport")
                                    }
                                >
                                    <Text style={{ color: Colors.white }}>Day Report</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles2.upperView}>
                                <View style={styles2.profile}>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={styles.avatarPlace} >
                                            <Image source={{ uri: this.state.user_img  }} style={styles.avatar} />
                                        </View>
                                        {/* <Text style={[styles.labelName, { textAlign: 'center' }]}>{this.context.userDetails.full_name}</Text> */}
                                    </View>
                                </View>
                                <View style={styles2.punchButtonView}>
                                    <View style={styles2.punchButton}>
                                        <View style={[styles2.punchButtonCircle, { backgroundColor: "green" }]}>
                                            <TouchableOpacity style={styles2.punchButtonBorder} onPress={()=>this.openCamera(1)} >
                                                <Text style={styles2.punchButtonText}>START</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.labelName}>{moment(this.state.date).format('LT')}</Text>
                                    </View>
                                    <View style={styles2.punchButton}>
                                        <View style={[styles2.punchButtonCircle, { backgroundColor: "red" }]}>
                                            <TouchableOpacity style={styles2.punchButtonBorder} onPress={()=>this.openCamera(2)} >
                                                <Text style={styles2.punchButtonText}>STOP</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.labelName}>{moment(this.state.date).format('LT')}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles2.upperView}>
                                <View style={styles2.profile}>
                                    <Text style={[styles.labelName, {}]}>{this.state.full_name}</Text>
                                </View>
                                <View style={[styles2.punchButtonView, { marginTop: 0 }]}>
                                    <Text style={[styles.labelName, { fontSize: 22 }]}>{8} Hours</Text>
                                </View>
                            </View>
                                    <View style={{height : 50}}></View>
                            <View style={{ width: '100%', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={this.add}>
                                    <Ionicons
                                        name="add"
                                        size={28}
                                        color={"black"}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.boxBorder, { width: "100%", }]}>
                                <View style={styles.attendenceTable}>
                                    <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Name
                                        </Text>
                                    </View>
                                    <View style={styles.attendenceTableRow}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Work Hours
                                        </Text>
                                    </View>
                                    <View style={styles.attendenceTableRow}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Lunch
                                        </Text>
                                    </View>
                                    <View style={styles.attendenceTableRow}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Off Site
                                        </Text>
                                    </View>
                                </View>
                                <FlatList
                                    data={this.state.workTypes}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                            {/* <View style={styles2.inputBox}>
                                <Text
                                    style={[styles2.input]}
                                >
                                    Comments :
                                </Text>
                                <TextInput
                                    value={this.state.comments}
                                    style={styles2.inputComment}
                                    multiline
                                    placeholderTextColor="#808080"
                                />
                            </View> */}
                            {/* <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        width: 150,
                                        backgroundColor: Colors.primary,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 3,
                                    }}
                                    onPress={() => { this.saveAttendance() }}
                                >
                                    <Text style={styles.btns}>SAVE</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </KeyboardAwareScrollView>
                    {/* <DateTimePickerModal
                        mode={this.state.mode}
                        display={Platform.OS == 'ios' && mode == "date" ? 'inline' : Platform.OS == 'ios' && mode == "time" ? 'spinner' : 'default'}
                        isVisible={isDatepickerOpen}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    /> */}
                </Container>
            </>
        );
    }
}

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("screen").width;
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
    button: {
        // backgroundColor: Colors.blueBg,
        backgroundColor: Colors.blueBg,
        height: 20,
        width: 80,
        left: windowwidth - 250,
        top: 20,
        marginBottom: 50,
        alignItems: 'center',
    },
    itemContainer: {
        width: "23%",
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: "40%",
        alignItems: 'center'
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
    punchButtonView: {
        width: "60%",
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20
    },
    punchButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    punchButtonCircle: {
        width: 80,
        height: 80,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center'
    },
    punchButtonBorder: {
        borderColor: Colors.white,
        borderWidth: 4,
        borderRadius: 100,
        height: 70,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    punchButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold'
    },
    upperView: {
        width: '100%',
        flexDirection: 'row',
        marginLeft: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },

});


//     image: {
//         height: 100,
//         width: 100,
//         borderWidth: 1,
//         borderColor: "#D3D3D3",
//     },
//     name: {
//         marginTop: 10,
//         color: "#808080",
//         marginBottom: 10,
//         textAlign: "center",
//     },

//     inputBox: {
//         alignItems: 'center',
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderWidth: 1,
//         backgroundColor: "#fff",
//         height: 'auto',
//         justifyContent: "space-between",
//         marginBottom: 5,
//         marginTop: 5,
//     },

//     input: {
//         color: Colors.textColor,
//         lineHeight: 40,
//         fontSize: 14,
//         paddingLeft: 4,
//     },


//     inputDateTime: {
//         backgroundColor: "#fff",
//         height: 'auto',

//         fontSize: 12,
//         color: Colors.textColor,
//         textAlign: "right",
//         padding: 5,
//     },

//     inputHours: {
//         backgroundColor: "#fff",
//         height: 'auto',

//         fontSize: 12,
//         color: Colors.textColor,
//         textAlign: "right",
//         padding: 5,
//     },

//     inputBoxComment: {
//         flexDirection: "row",
//         marginRight: 15,
//         marginLeft: 15,
//     },

//     inputComment: {
//         backgroundColor: "#fff",
//         height: 'auto',

//         fontSize: 12,
//         color: Colors.textColor,
//         textAlign: "right",
//         width: "55%",
//         padding: 5,
//     },

//     avatarPlace: {
//         width: 120,
//         height: 100,
//         backgroundColor: Colors.lightGrey,
//         marginTop: 5,
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     avatar: {
//         position: "absolute",
//         width: 120,
//         height: 120,
//         borderWidth: 1,
//         borderColor: "#D3D3D3",
//     },
//     profile: {

//     }

// });
