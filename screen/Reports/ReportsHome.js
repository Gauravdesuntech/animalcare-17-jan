import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Container } from "native-base";
import {
  Ionicons,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../component";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import { translations } from "../Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class ReportsHome extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      menus: [
        {
          id: 1,
          name:i18n.t("death_report"),
          onclick: () => this.props.navigation.navigate("DeathReport"),
          icon: (
            <MaterialCommunityIcons
              name="stocking"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 2,
          name: i18n.t("transfer_report"),
          onclick: () => this.props.navigation.navigate("TransferReport"),
          icon: (
            <FontAwesome name="recycle" size={35} color={Colors.textColor} />
          ),
        },
        {
          id: 3,
          name: i18n.t("task_report"),
          onclick: () => this.props.navigation.navigate("TaskReport"),
          icon: (
            <FontAwesome5 name="tasks" size={35} color={Colors.textColor} />
          ),
        },
        {
          id: 4,
          name: i18n.t("incident_report"),
          onclick: () => this.props.navigation.navigate("IncidentReport"),
          icon: (
            <MaterialIcons
              name="event-note"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 5,
          name: i18n.t("medical_report"),
          onclick: () => this.props.navigation.navigate("MedicalReport"),
          icon: (
            <FontAwesome5
              name="book-medical"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 6,
          name:i18n.t("observations_report"),
          onclick: () => this.props.navigation.navigate("ObservationsReport"),
          icon: (
            <MaterialCommunityIcons
              name="table-eye"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
        {
          id: 7,
          name:i18n.t("daily_report"),
          onclick: () => this.props.navigation.navigate("DailyReport"),
          icon: (
            <FontAwesome5
              name="dailymotion"
              size={35}
              color={Colors.textColor}
            />
          ),
        },
      ],
    };
  }
  componentDidMount = () => {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={item.onclick}
        style={[globalStyles.icon_btn, globalStyles.pl12]}
      >
        <View style={globalStyles.imgContainer}>{item.icon}</View>
        <Text style={globalStyles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render = () => (
    <Container>
      <Header title={i18n.t("reports_mgmt")} />
      <View style={globalStyles.container}>
        <FlatList
          data={this.state.menus}
          keyExtractor={(item) => item.id.toString()}
          renderItem={this.renderItem}
        />
      </View>
    </Container>
  );
}

const windowWidth = Dimensions.get("screen").width;
// const globalStyles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		paddingVertical: 10,
// 	},
// 	pl12: {
// 		paddingLeft: 12,
// 	},
// 	btn: {
// 		// width: Math.floor(windowWidth / 2),
// 		paddingVertical: 20,
// 		flexDirection: "row",
// 		alignItems: "center",
// 	},
// 	imgContainer: {
// 		width: "20%",
// 	},

// 	title: {
// 		width: "72%",
// 		fontSize: 16,
// 		color: Colors.textColor,
// 		fontWeight: "bold",
// 	},
// });
