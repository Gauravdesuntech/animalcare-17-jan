import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Container } from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../component";
import globalStyles from "../../config/Styles";
import { translations } from "../Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class MedicalMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [
        {
          id: 1,
          name: "Diagnosis Name",
          onclick: () => this.props.navigation.navigate("DiagnosisList"),
          icon: (
            <FontAwesome name="sitemap" size={35} color={Colors.textColor} />
          ),
        },
        {
          id: 2,
          name: "Affected Parts",
          onclick: () => this.props.navigation.navigate("AffectedPartList"),
          icon: (
            <FontAwesome name="sitemap" size={35} color={Colors.textColor} />
          ),
        },
        {
          id: 3,
          name: "Routes",
          onclick: () => this.props.navigation.navigate("RoutesList"),
          icon: (
            <FontAwesome name="sitemap" size={35} color={Colors.textColor} />
          ),
        },
      ],
    };
  }

  componentDidMount = () => {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;
  };

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  gotoDesignations = () => this.props.navigation.navigate("Designations");

  gotoRecipes = () => this.props.navigation.navigate("Departments");

  gotoParties = () => this.props.navigation.navigate("Parties");

  gotoPurchase = () => this.props.navigation.navigate("Purchase");

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={item.onclick}
        style={[globalStyles.icon_btn, globalStyles.pl12]}
      >
        <View style={globalStyles.imgContainer}>{item.icon}</View>
        <Text style={[globalStyles.title, globalStyles.fontWeightNormal]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        rightIconName={"add"}
        title={this.props.route.params.title}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
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

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#fff",
// 		padding: 10,
// 	},
// 	card: {
// 		width: "100%",
// 		height: 80,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		paddingHorizontal: 8,
// 		paddingVertical: 8,
// 		borderRadius: 3,
// 		backgroundColor: Colors.white,
// 		marginVertical: 10,
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 5,
// 	},
// 	cardIconBox: {
// 		width: "20%",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		borderRightWidth: 1,
// 		borderColor: Colors.textColor,
// 	},
// 	cardTitleBox: {
// 		width: "80%",
// 		paddingLeft: 20,
// 	},
// 	cardTitle: {
// 		fontSize: 25,
// 		color: Colors.textColor,
// 	},pl12: {
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
