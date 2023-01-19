import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import Header from "../../component/Header";
import OverlayLoader from "../../component/OverlayLoader";
import { Colors } from "../../config";
import {
  addAffectedParts,
  updateAffectedParts,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import styles from "./Styles";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";
import { translations } from "../Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class ManageAffectedParts extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? null,
      name: props.route.params?.item?.name ?? "",
      showLoader: false,
    };
  }

  componentDidMount = () => {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;
  };

  gotoBack = () => this.props.navigation.goBack();

  onSave = () => {
    if (this.state.name == "") {
      Alert.alert(i18n.t("validation_error"), i18n.t("please_enter_a_name"));
      return;
    }

    if (this.state.id == null) {
      this.setState(
        {
          showLoader: true,
        },
        () => {
          addAffectedParts({
            cid: this.context.userDetails.cid,
            name: getCapitalizeTextWithoutExtraSpaces(this.state.name),
          })
            .then((response) => {
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((err) => {
              console.log(err, "err");
              this.setState({ showLoader: false });
              Alert.alert(
                i18n.t("server_error"),
                i18n.t("please_try_again_later")
              );
            });
        }
      );
    } else {
      this.setState(
        {
          showLoader: true,
        },
        () => {
          updateAffectedParts({
            id: this.state.id,
            name: getCapitalizeTextWithoutExtraSpaces(this.state.name),
          })
            .then((response) => {
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((err) => {
              console.log(err, "err");
              this.setState({ showLoader: false });
              Alert.alert(
                i18n.t("server_error"),
                i18n.t("please_try_again_later")
              );
            });
        }
      );
    }
  };

  getTitle = () => {
    return this.state.id == null
      ? i18n.t("add_affected_part")
      : i18n.t("update_affected_part");
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={this.getTitle()}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={[globalStyles.container, styles.formPaddingHorizontal]}>
        <ScrollView ref={this.formScrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>{i18n.t("name")}</Text>
              <TextInput
                value={this.state.name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(name) => this.setState({ name })}
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.onSave}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                {i18n.t("save")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>
                {i18n.t("exit")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         padding : 8
//     },
//     chooseCatContainer: {
//         flexDirection: "row",
//         marginVertical: 10,
//         paddingHorizontal: 10,
//         alignItems: "center",
//         justifyContent: "space-between",
//     },
//     imageContainer: {
//         borderColor: "#ccc",
//         borderWidth: 1,
//         padding: 3,
//         backgroundColor: "#fff",
//         borderRadius: 3,
//     },
//     image: {
//         height: 50,
//         width: 50,
//     },
//     defaultImgIcon: {
//         fontSize: 50,
//         color: "#adadad",
//     },
//     name: {
//         color: Colors.labelColor,
//         // lineHeight: 40,
//         fontSize:Colors.lableSize,
//         paddingLeft: 4,
//         height: 'auto',
//         paddingVertical: 10
//     },
//     buttonsContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-evenly",
//         marginVertical: 30,
//     },
//     inputText: {
//         backgroundColor: "#fff",
//         height: 'auto',
//         flexWrap:'wrap',
//         fontSize: Colors.textSize,
//         color: Colors.textColor,
//         textAlign: "left",
//         padding: 5,
//         width:'60%'
//     },
//     inputTextArea: {
//         height: 150,
//         borderWidth: 1,
//         borderColor: "#ccc",
//         backgroundColor: "#f9f6f6",
//         textAlignVertical: "top",
//         padding: 10,
//     },
//     inputContainer: {
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
//     },
//     pb0: {
//         paddingBottom: 0,
//     },
//     mb0: {
//         marginBottom: 0,
//     },
//     buttonText: {
//         fontSize:Colors.lableSize,
//         fontWeight: "bold",
//     },
//     saveBtnText: {
//         color: Colors.primary,
//         fontSize:Colors.lableSize,
//     },
//     exitBtnText: {
//         color: Colors.activeTab,
//         fontSize:Colors.lableSize,
//     },
//     item: {
//         height: 35,
//         backgroundColor: "#00b386",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     itemtitle: {
//         color: "#fff",
//         textAlign: "center",
//         fontSize:Colors.lableSize,
//     },
//     errorText: {
//         textAlign: "right",
//         color: Colors.tomato,
//         fontWeight: "bold",
//         fontStyle: "italic",
//     },
// });
