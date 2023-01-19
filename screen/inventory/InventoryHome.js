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
	MaterialIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../component";
//import styles from './Style'
import globalStyle from  '../../config/Styles';
import AppContext from "../../context/AppContext";
import { translations } from "../Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class InventoryHome extends React.Component {

	static contextType = AppContext;

	constructor(props) {
		super(props);
		this.state = {
			menus: [
				{
					id: 1,
					name: i18n.t("stock_list"),
					onclick: () => this.props.navigation.navigate("StocksType"),
					icon: <MaterialCommunityIcons name="stocking" size={35} color={Colors.textColor} />
				},
				{
					id: 2,
					name: i18n.t("material_request"),
					onclick: () => this.props.navigation.navigate("Consumption"),
					icon: <FontAwesome name="recycle" size={35} color={Colors.textColor} />
				},
				{
					id: 3,
					name: i18n.t("adhoc_request"),
					onclick: () => this.props.navigation.navigate("addUp"),
					icon: <FontAwesome name="recycle" size={35} color={Colors.textColor} />
				},
				{
					id: 4,
					name: i18n.t("low_inventory_list"),
					onclick: () => this.props.navigation.navigate("LowInventoryList"),
					icon: <MaterialCommunityIcons name="package-down" size={35} color={Colors.textColor} />
				},
				{
					id: 5,
					name:  i18n.t("purchase_request"),
					onclick: () => this.props.navigation.navigate("PurchaseOrders"),
					icon: <MaterialIcons name="poll" size={35} color={Colors.textColor} />
				},
				{
					id: 6,
					name: i18n.t("master"),
					onclick: () => this.props.navigation.navigate("InventoryMasterHome"),
					icon: <FontAwesome name="th-large" size={35} color={Colors.textColor} />
				},
				{
					id: 7,
					name: i18n.t("material_in"),
					onclick: () => this.props.navigation.navigate("Purchase"),
					icon: <Ionicons name="receipt" size={35} color={Colors.textColor} />
				},
				{
					id: 8,
					name: i18n.t("transfer_stock"),
					onclick: () => this.props.navigation.navigate("StockTransfer"),
					icon: <MaterialCommunityIcons name="transfer" size={35} color={Colors.textColor} />
				}
			]
		}
	}


	componentDidMount = () => {
		i18n.enableFallback = true;
		i18n.locale = this.context.locale;
	  };

	renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={item.onclick}
				style={[styles.btn, styles.pl12, globalStyle.bbw0,{
					borderBottomColor: "#eee",
				}]}
			>
				<View style={styles.imgContainer}>
					{item.icon}
				</View>
				<Text style={styles.title}>{item.name}</Text>
			</TouchableOpacity>
		)
	}

	render = () => (
		<Container>
			<Header title={i18n.t("inventory_mgmt")} />
			<View style={styles.container}>
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
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingVertical: 10,
	},
	pl12: {
		paddingLeft: 12,
	},
	btn: {
		// width: Math.floor(windowWidth / 2),
		paddingVertical: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	imgContainer: {
		width: "20%",
	},

	title: {
		width: "72%",
		fontSize: 16,
		color: Colors.textColor,
		fontWeight: "bold",
	},
});
