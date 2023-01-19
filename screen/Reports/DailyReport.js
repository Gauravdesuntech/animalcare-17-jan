import React from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import moment from "moment";
import { Container } from "native-base";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Loader } from "../../component";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import { generate_report } from "../../services/ReportsServices";
import { SingleDatePicker } from "./SingleDatePicker";
import { translations } from "../Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class DailyReport extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loading: false,
      selectedDate: moment(new Date()).subtract(1, "days").format("YYYY-MM-DD"),
      reportData: [],
      preComposedMessage: "",
    };

    this.searchInput = React.createRef();
  }

  componentDidMount = () => {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;
  };

  getData = () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        generate_report("app", this.state.selectedDate)
          .then((response) => {
            // Composing the message to share to whatsapp
            let message = `
            Generated Reports URL ( ${moment(this.state.selectedDate).format(
              "DD-MM-YYYY"
            )} )
---------------------------------------------------------------
            `;
            response?.forEach((item) => (message += `\n\n${item.url}`));

            this.setState({
              reportData: response,
              preComposedMessage: message,
              isLoading: false,
            });
          })
          .catch((err) => console.log(err));
      }
    );
  };

  render = () => (
    <Container>
      <Header title={i18n.t("daily_reports")} />

      <View style={globalStyles.listContainer}>
        <SingleDatePicker
          defaultDate={this.state.selectedDate}
          getSelectedDate={(selectedDate) => {
            this.setState({ selectedDate });
          }}
        />

        <View
          style={[
            globalStyles.width100,
            globalStyles.justifyContentCenter,
            globalStyles.alignItemsCenter,
            globalStyles.pv5,
          ]}
        >
          <TouchableOpacity
            style={globalStyles.incidentbtnCover}
            onPress={this.getData}
          >
            <Text style={globalStyles.incidentbtns}>{i18n.t("submit")}</Text>
          </TouchableOpacity>
        </View>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            {this.state.reportData.length ? (
              <View style={globalStyles.sectionHeader}>
                <View
                  style={[
                    // globalStyles.sectionHeaderRight,
                    globalStyles.width100,
                    globalStyles.flexDirectionRow,
                    globalStyles.justifyContentBetween,
                    globalStyles.alignItemsCenter,
                    globalStyles.p5,
                  ]}
                >
                  <Text
                    style={[
                      globalStyles.fontSize16,
                      globalStyles.fontWeightBold,
                      { color: Colors.white },
                    ]}
                  >
                    Reports {"("}
                    {moment(this.state.selectedDate).format("DD-MM-YYYY")}
                    {")"}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      Linking.openURL(
                        "whatsapp://send?text=" + this.state.preComposedMessage
                      );
                    }}
                    style={globalStyles.p5}
                  >
                    <AntDesign name="export" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {this.state.reportData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[globalStyles.CardBox, globalStyles.mh5]}
                onPress={() => {
                  Linking.openURL(item.url);
                }}
              >
                <Text style={[globalStyles.labelName, globalStyles.p5]}>
                  {item.report_name}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </Container>
  );
}

// const globalStyles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 	},
// 	tabContainer: {
// 		width: "100%",
// 		height: tabHeight,
// 		flexDirection: "row",
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#d1d1d1",
// 		borderTopWidth: 1,
// 		borderTopColor: Colors.primary,
// 		elevation: 1,
// 	},
// 	tab: {
// 		flex: 1,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		height: tabHeight,
// 	},
// 	underlineStyle: {
// 		backgroundColor: Colors.primary,
// 		height: 3,
// 	},
// 	activeTab: {
// 		height: tabHeight - 1,
// 		borderBottomWidth: 2,
// 		borderBottomColor: Colors.primary,
// 	},
// 	activeText: {
// 		fontSize: 14,
// 		fontWeight: "bold",
// 		color: Colors.primary,
// 	},
// 	inActiveText: {
// 		fontSize: 14,
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 	},
// 	listContainer: {
// 		flex: 1,
// 		padding: 8,
// 		height: windowHeight - tabHeight,
// 	},
// 	CardBox: {
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 3,
// 	},
// 	labelName: {
// 		fontSize: 16,
// 		paddingLeft: 4,

// 		color: Colors.textColor,
// 		opacity: 0.9,
// 		textAlign: "left",
// 		fontWeight: "500",
// 		flex: 1,
// 		width: "100%",
// 	},
// 	mc: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		marginLeft: 5,
// 		fontSize: 16,
// 		fontWeight: "500",
// 	},
// 	pendingStatus: {
// 		textAlign: "right",
// 		color: Colors.warning,
// 		fontStyle: "italic",
// 	},
// 	approveStatus: {
// 		textAlign: "right",
// 		color: Colors.success,
// 		fontStyle: "italic",
// 	},
// 	rejectStatus: {
// 		textAlign: "right",
// 		color: Colors.danger,
// 		fontStyle: "italic",
// 	},
// 	searchModalOverlay: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 	},
// 	seacrhModalContainer: {
// 		flex: 1,
// 		backgroundColor: Colors.white,
// 		width: windowWidth,
// 		height: windowHeight,
// 		elevation: 5,
// 	},
// 	searchModalHeader: {
// 		height: 55,
// 		width: "100%",
// 		elevation: 5,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "flex-start",
// 		backgroundColor: Colors.primary,
// 	},
// 	searchBackBtn: {
// 		width: "10%",
// 		height: 55,
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchContainer: {
// 		width: "90%",
// 		flexDirection: "row",
// 		alignItems: "flex-start",
// 		justifyContent: "center",
// 	},
// 	searchFieldBox: {
// 		width: "100%",
// 		height: 40,
// 		paddingHorizontal: 10,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 		backgroundColor: "rgba(0,0,0, 0.1)",
// 		borderRadius: 50,
// 	},
// 	searchField: {
// 		width: "90%",
// 		padding: 5,
// 		color: Colors.white,
// 		fontSize: 15,
// 	},
// 	searchModalBody: {
// 		flex: 1,
// 		height: windowHeight - 55,
// 	},
// 	leftPart: {
// 		width: "75%",
// 		justifyContent: "center",
// 	},
// 	rightPart: {
// 		width: "25%",
// 		flexDirection: "row",
// 		justifyContent: "flex-end",
// 		alignItems: "center",
// 	},
// 	name: {
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 		lineHeight: 24,
// 	},
// 	subText: {
// 		color: Colors.textColor,
// 		opacity: 0.8,
// 		fontSize: 14,
// 		lineHeight: 22,
// 	},
// 	row: {
// 		flexDirection: "row",
// 		borderBottomColor: "#eee",
// 		borderBottomWidth: 1,
// 		paddingHorizontal: 5,
// 		paddingVertical: 15,
// 	}
// });
