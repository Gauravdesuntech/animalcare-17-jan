import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    SectionList,
    RefreshControl,
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import { getDiagnosis } from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";
import { getfeedmealslot } from "../../services/KitchenServices";
import colors from "../../config/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getAttendanceDateWise, getDepartmentReport } from "../../services/AttendenceService";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class DaysReport extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            reports: [],
            show: false,
            today: new Date(),
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
                this.loadDepartmentReport();
            }
        );
    };

    componentWillUnmount = () => {
        this.focusListener();
    };

    loadDepartmentReport = () => {
        this.setState(
            {
                isLoading: true,
            },
            () => {
                getAttendanceDateWise(moment(this.state.today).format("YYYY-MM-DD"), this.context.userDetails.access_token)
                    .then((data) => {
                        this.setState({
                            isLoading: false,
                            reports: data
                        });
                    })
                    .catch((error) => console.log(error));
            }
        );
    };


    calculateDate = (type) => {
        let today = this.state.today;
        if (type == "add") {
          this.setState(
            { today: moment(today).add(1, "days").format(), isLoading: true },
            () => {
                this.loadDepartmentReport();
            }
          );
        } else {
          this.setState(
            { today: moment(today).subtract(1, "days").format(), isLoading: true },
            () => {
                this.loadDepartmentReport();
            }
          );
        }
      };

    showDatePicker = () => {
        this.setState({ show: true });
    };

    handleConfirm = (selectDate) => {
        this.setState({
            today: selectDate,
        }, () => {
            this.loadDepartmentReport();
        });
        this.hideDatePicker();
    };

    hideDatePicker = () => {
        this.setState({ show: false });
    };


    gotoAddDepartmentReport = () => {
        this.props.navigation.navigate("AddDepartmentReport");
    };

    gotoEdit = (item) =>
        this.props.navigation.navigate("AddDepartmentReport", {
            item: item,
        });

    renderItem = ({ item }) => (
        <TouchableOpacity
            // style={{ marginTop: 30}}
            activeOpacity={1}
        >
            {item.full_name == null ? null :
                <View style={styles.attendenceTable}>
                    <View style={styles.attendenceTableRow}>
                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                            {item.full_name}
                        </Text>
                        <Text style={ { padding: 2, fontSize: 10 }}>
                            {item.dept_name}
                        </Text>
                    </View>
                    <View style={styles.attendenceTableRow}>
                        {!item.work_start ? null :
                            <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
                                {moment(item.work_start, "HH:mm:ss").format("LT")}
                            </Text>
                        }
                    </View>
                    <View style={styles.attendenceTableRow}>
                        {!item.work_end ? null :
                            <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
                                {moment(item.work_end, "HH:mm:ss").format("LT")}
                            </Text>
                        }

                    </View>
                    <View style={styles.attendenceTableRow}>
                        {!item.total_wokring_hour ? null :
                            <Text style={[styles.textfield, styles.pd0, { padding: 3, fontSize: 12 }]}>
                                {item.total_wokring_hour}h
                            </Text>
                        }

                    </View>
                </View>
            }
        </TouchableOpacity>
    );

    render = () => (
        <Container>
            <Header 
            navigation={this.props.navigation}
            title={this.state.today}
            calculate={this.calculateDate}
            showDatePicker={this.showDatePicker}
            />
            <View style={styles2.container}>
                {this.state.isLoading ? (
                    <Loader />
                ) :
                    (
                        <>
                            <View style={{ marginBottom: 40, marginLeft: -80 }}>
                                <Text style={styles2.totalPresent}>{this.state.reports.all_present_user} Present</Text>
                            </View>
                            <View style={[styles.boxBorder, { width: "100%"}]}>
                                <View style={styles2.attendenceTable}>
                                    <View style={[styles.attendenceTableRow, { height: 30, backgroundColor: Colors.lightGrey }]}>
                                        <Text style={[styles.labelName, styles.pd0, { padding: 5, fontWeight: 'bold' }]}>
                                            Name
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
                                    data={this.state.reports.data}
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                    // extraData={this.state.reports}
                                    ontentContainerStyle={
                                        this.state.reports.length === 0 ? styles.container : null
                                    }
                                    ListEmptyComponent={() => <ListEmpty />}
                                    numColumns={1}
                                />
                                </View>
                            {/* <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 10,
                                    width: 150,
                                    backgroundColor: colors.primary,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                }}
                                onPress={() => { this.showDatePicker() }}
                            >
                                <Text style={styles.btns}>{moment(this.state.date).format("Do MMM YY (ddd)")}</Text>
                            </TouchableOpacity>
                        </View> */}
                            {/* <View style={{ alignItems: 'flex-end', width: '100%' }}>
                            <TouchableOpacity
                                style={styles2.button}
                                onPress={() =>
                                    this.props.navigation.navigate("MonthReport")
                                }
                            >
                                <Text style={{ color: Colors.white }}>Month Report</Text>
                            </TouchableOpacity>
                        </View> */}
                            {/* <SectionList
                            sections={this.state.reports}
                            keyExtractor={(item, index) => index}
                            renderItem={this.renderItem}
                            contentContainerStyle={
                                this.state.reports.length === 0 ? styles.container : null
                            }
                            ListEmptyComponent={() => <ListEmpty />}
                            stickySectionHeadersEnabled
                            renderSectionHeader={({ section: { title } }) => {
                                return (
                                    <>
                                        <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                                            <View style={styles.sectionHeaderRight}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.white }}>
                                                    {title}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.attendenceTable}>
                                            <View style={styles.attendenceTableRow}>
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
                                    </>
                                );
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isLoading}
                                    onRefresh={this.loadDepartmentReport}
                                />
                            }
                        /> */}
                        </>
                    )}
            </View>
            <DateTimePickerModal
                mode={"date"}
                display={Platform.OS == 'ios' && mode == "date" ? 'inline' : Platform.OS == 'ios' && mode == "time" ? 'spinner' : 'default'}
                isVisible={this.state.show}
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
            />
        </Container>
    );
}

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
    attendenceTable: {
        flex: 1, 
        alignSelf: 'stretch',
        flexDirection: 'row',
        marginBottom: 35
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
    totalPresent: {
        color: Colors.black,
        marginTop: 30,
        marginRight: 40,
        // lineHeight: 40,
        fontSize: 30,
    },
    item: {
        flex: 1,
        margin: 3,
        backgroundColor: 'lightblue',
    },
    HeadDateTime: {
        color: 'white'
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
});
