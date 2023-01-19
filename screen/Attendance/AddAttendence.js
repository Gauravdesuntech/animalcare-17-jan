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
    RefreshControl,
    Pressable,
    SafeAreaView
} from "react-native";
import { Container } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Modal as Modal2 } from "react-native";
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors, Configs } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../config/Styles";
import { Header, InputDropdown, OverlayLoader } from "../../component";
import { addAttendance, getAttendanceDetails, getAttendanceTiming, getWorkTypes } from "../../services/AttendenceService";
import { getFileData } from "../../utils/Util";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class AddAttendence extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            reports: [],
            workTypes: [],
            show: false,
            isworkTypesMenuOpen: false,
            isScanModal: false,
            date: moment(new Date()),
            selectWorkType: '',
            selectWorkType_name: '',
            timing: '',
            comments: "",
            imageID: 0,
            Images: [],
            UploadData: [],
            attendenceDetails: [],
            user_id: props.route.params?.data ? props.route.params.data.user_id : undefined,
            full_name: props.route.params?.data ? props.route.params.data.full_name : undefined,
            user_img: props.route.params?.data ? Configs.PROFILE_URL + props.route.params.data.image : undefined,
        };
    }

    componentDidMount() {
        // console.log(this.context.userDetails.access_token);
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
                this.loadAttendanceDetails();
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
        getAttendanceTiming(moment(this.state.date).format("YYYY-MM-DD"), this.state.user_id, this.context.userDetails.access_token)
            .then((res) => {
                let timing = {
                    "back_from_lunch": null,
                    "back_from_off_site_work": null,
                    "id": "",
                    "off_site_work_start": null,
                    "out_for_lunch": null,
                    "punch_date": "",
                    "total_lunch_hour": "",
                    "total_outside_work": "",
                    "total_wokring_hour": "",
                    "user_id": "",
                    "work_end": "",
                    "work_start": "",
                }
                getWorkTypes(this.context.userDetails.access_token)
                    .then((result) => {
                        let workTypes = result;
                        let finalWorkTypes = [];
                        for (let i = 0; i < workTypes.length; i++) {
                            let item = res.work_types == null ? undefined : res.work_types.find((id) => id == workTypes[i].id || 2 == workTypes[i].id);

                            if (item == undefined) {
                                finalWorkTypes.push(workTypes[i]);
                            }
                        }
                        console.log("finalWorkTypes", finalWorkTypes);
                        this.setState({
                            timing: res.data.length > 0 ? res.data[0] : timing,
                            isLoading: false,
                            workTypes: finalWorkTypes
                        })
                    }).catch((err) => console.log(err))
            }).catch((err) => console.log(err))
    }

    loadAttendanceDetails = () => {
        getAttendanceDetails(moment(this.state.date).format("YYYY-MM-DD"), this.state.user_id, this.context.userDetails.access_token)
            .then((res) => {
                // console.log(res);
                this.setState({
                    attendenceDetails: res,
                    isLoading: false
                })
            }).catch((err) => console.log(err))
    }

    toggleworkTypesMenu = () => {
        this.setState({
            isworkTypesMenuOpen: !this.state.isworkTypesMenuOpen
        })
    }
    setworkTypesData = (item) => {
        this.setState({
            selectWorkType: item.id,
            selectWorkType_name: item.name,
            comments: item.name,
            isworkTypesMenuOpen: false
        })
    }

    openRelatedScaner = () => {
        Camera.requestCameraPermissionsAsync()
            .then((result) => {
                if (result.status === "granted") {
                    this.setState({ isScanModal: !this.state.isScanModal });
                } else {
                    Alert.alert("Please give the permission");
                }
            })
            .catch((error) => console.log(error));
    };

    closeScanModal = () => {
        this.setState({ isScanModal: !this.state.isScanModal });
    };

    handleBarCodeScanned = (data) => {
        try {
            let scanData = JSON.parse(data.data);
            let type = scanData.type ? scanData.type : scanData.qr_code_type;
            if (type == "user") {
                this.setState({
                    isScanModal: !this.state.isScanModal,
                    user_id: scanData.user_id,
                    full_name: scanData.full_name,
                    user_img: Configs.PROFILE_URL + scanData.image,
                }, () => { this.onScreenFocus() });
            } else {
                this.setState({
                    isScanModal: !this.state.isScanModal,
                });
                alert("Wrong QR code scan !!");
            }
        } catch (error) {
            console.log(error);
            this.setState({ isScanModal: !this.state.isScanModal });
            alert("Wrong QR code scan !!");
        }
    };

    openCamera = (type) => {
        if (!this.state.comments && !type) {
            this.setState({
                hasCommentsValidationError: true
            })
        } else {
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
                                selectWorkType: typeof type == "number" ? type : this.state.selectWorkType,
                                punchModalVisible: false,
                            }, () => this.saveAttendance());
                        }
                    });
                } else {
                    Alert.alert("Please allow camera permission to click images");
                }
            });
        }
    };

    saveAttendance = () => {
        this.setState({
            isLoading: true
        })
        let obj = {
            user_id: this.state.user_id,
            site_location: this.context.userDetails.site_code,
            attandence_type_id: this.state.selectWorkType,
            punch_date: moment(this.state.date).format("YYYY-MM-DD"),
            punch_time: moment(this.state.date).format("HH:mm:ss"),
            comments: this.state.selectWorkType == 1 ? "Work Start" : this.state.selectWorkType == 2 ? "Work End" : this.state.comments
        }
        addAttendance(obj, this.context.userDetails.access_token, this.state.UploadData)
            .then((res) => {
                this.setState({
                    isLoading: false,
                    selectWorkType: "",
                    selectWorkType_name: "",
                    comments: ""
                }, () => {
                    // alert(res.status);
                    this.onScreenFocus()
                })
                // this.props.navigation.goBack();
            }).catch((err) => console.log(err))
    }

    renderItem = ({ item }) => (
        <View style={styles.attendenceTable}>
            <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                    {item.attandence_type_id == 1 || item.attandence_type_id == 4 || item.attandence_type_id == 6 ? "IN" : "OUT"}
                </Text>
            </View>
            <View style={styles.attendenceTableRow}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5 }]}>
                    {moment(item.punch_time, "HH:mm:ss").format('LT')}
                </Text>
            </View>
            <View style={styles.attendenceTableRow}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5 }]}>
                    {item.site_name}
                </Text>
            </View>
            <View style={styles.attendenceTableRow}>
                <Text style={[styles.labelName, styles.pd0, { padding: 5 }]}>
                    {item.comments}
                </Text>
            </View>
        </View>
    );

    render() {
        return (
            <Container>
                <Header
                    title={"Attendance"}
                    showRelatedScanButton={true}
                    openRelatedScaner={this.openRelatedScaner}
                />
                <OverlayLoader visible={this.state.isLoading} />
                <KeyboardAwareScrollView refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={this.onScreenFocus}
                    />
                }>
                    <View style={styles2.container}>
                        <View style={{ alignItems: 'flex-end', width: '100%' }}>
                            <TouchableOpacity
                                style={styles2.button}
                                onPress={() =>
                                    this.props.navigation.navigate("MonthReport", {
                                        id: this.state.user_id,
                                        full_name: this.state.full_name
                                    })
                                }
                            >
                                <Text style={{ color: Colors.white }}>Month Report</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles2.upperView}>
                            <View style={styles2.profile}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={styles.avatarPlace} >
                                        <Image source={{ uri: this.state.user_img }} style={styles.avatar} />
                                    </View>
                                </View>
                            </View>
                            <View style={styles2.punchButtonView}>
                                <View style={styles2.punchButton}>
                                    <View style={[styles2.punchButtonCircle, { backgroundColor: "green" }]}>
                                        <TouchableOpacity style={styles2.punchButtonBorder} onPress={() => this.openCamera(1)} disabled={this.state.timing.work_start ? true : false}>
                                            <Text style={styles2.punchButtonText}>START</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.labelName}>{this.state.timing.work_start ? moment(this.state.timing.work_start, "HH:mm:ss").format('LT') : null}</Text>
                                </View>
                                <View style={styles2.punchButton}>
                                    <View style={[styles2.punchButtonCircle, { backgroundColor: "red" }]}>
                                        <TouchableOpacity style={styles2.punchButtonBorder} onPress={() => this.openCamera(2)} disabled={!this.state.timing.work_start || this.state.timing.work_end ? true : false}>
                                            <Text style={styles2.punchButtonText}>STOP</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.labelName}>{this.state.timing.work_end ? moment(this.state.timing.work_end, "HH:mm:ss").format('LT') : null}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles2.upperView}>
                            <View style={styles2.profile}>
                                <Text style={[styles.labelName, {}]}>{this.state.full_name}</Text>
                            </View>
                            <View style={[styles2.punchButtonView, { marginTop: 0 }]}>
                                <Text style={[styles.labelName, { fontSize: 22 }]}>{this.state.timing.total_wokring_hour ? this.state.timing.total_wokring_hour + " Hours" : null}</Text>
                            </View>
                        </View>
                        <View style={{ height: 50 }}></View>
                        {this.state.timing.work_start ? <>
                            <View style={{ width: '100%', alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.setState({ punchModalVisible: true })} disabled={!this.state.timing.work_start || this.state.timing.work_end ? true : false}>
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
                                            Status
                                        </Text>
                                    </View>
                                    <View style={styles.attendenceTableRow}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Time
                                        </Text>
                                    </View>
                                    <View style={styles.attendenceTableRow}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Site
                                        </Text>
                                    </View>
                                    <View style={styles.attendenceTableRow}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Comments
                                        </Text>
                                    </View>
                                </View>
                                <FlatList
                                    data={this.state.attendenceDetails}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.punch_time}
                                    extraData={this.state.attendenceDetails}
                                />
                            </View>
                        </>
                            : null}
                    </View>
                </KeyboardAwareScrollView>

                <Modal
                    isVisible={this.state.punchModalVisible}
                    coverScreen={false}
                    onBackdropPress={() =>
                        this.setState({ punchModalVisible: false })
                    }
                >
                    <View style={[styles.popupContainer]}>
                        <Text style={styles.popupText}>Punch Time : {moment(this.state.date).format("LT")}</Text>
                        <View style={{ padding: 10 }}>
                            <InputDropdown
                                label={"Choose One"}
                                value={this.state.selectWorkType_name}
                                isOpen={this.state.isworkTypesMenuOpen}
                                items={this.state.workTypes}
                                openAction={this.toggleworkTypesMenu}
                                closeAction={this.toggleworkTypesMenu}
                                setValue={this.setworkTypesData}
                                placeholder=" "
                                labelStyle={styles.labelName}
                                textFieldStyle={styles.textfield}
                                style={[
                                    styles.fieldBox,
                                    this.state.hasAssignValidationError
                                        ? styles.errorFieldBox
                                        : null,
                                ]}
                            />
                            <View style={styles.fieldBox}>
                                <Text
                                    style={[styles.labelName]}
                                >
                                    Comments :
                                </Text>
                                <TextInput
                                    multiline={true}
                                    value={this.state.comments}
                                    onChangeText={(comments) =>
                                        this.setState({
                                            comments,
                                            hasCommentsValidationError: false,
                                        })
                                    }
                                    style={[styles.textfield, { width: "60%" }]}
                                    autoCompleteType="off"
                                    autoCapitalize="words"
                                />
                            </View>
                            {this.state.hasCommentsValidationError ? (
                                <Text style={styles.errorText}>Comments can not be blank</Text>
                            ) : null}
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 40 }}>
                            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => {
                                        this.openCamera();
                                    }}
                                >
                                    <Text style={styles.textWhite}>Click Photo</Text>
                                </Pressable>
                            </View>

                            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => {
                                        this.setState({
                                            punchModalVisible: false,
                                        });
                                    }}
                                >
                                    <Text style={styles.textWhite}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/*Scan Modal*/}
                <Modal2
                    animationType="fade"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={this.state.isScanModal}
                    onRequestClose={this.closeScanModal}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
                        <View style={styles.scanModalOverlay}>
                            <View style={styles.qrCodeSacnBox}>
                                <Camera
                                    onBarCodeScanned={this.handleBarCodeScanned}
                                    barCodeScannerSettings={{
                                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                                    }}
                                    style={StyleSheet.absoluteFill}
                                />
                                {/* <BarCodeScanner
                   type={BarCodeScanner.Constants.Type.back}
                   barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                   onBarCodeScanned={handleBarCodeScanned}
                   style={StyleSheet.absoluteFill}
                 /> */}
                            </View>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={this.closeScanModal}
                            >
                                <Ionicons name="close-outline" style={styles.cancelButtonText} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal2>
            </Container>
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
        backgroundColor: Colors.blueBg,
        height: 20,
        top: 5,
        marginBottom: 10,
        paddingHorizontal: 5,
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