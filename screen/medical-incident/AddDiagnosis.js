import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Container } from "native-base";
import Header from "../../component/Header";
import OverlayLoader from "../../component/OverlayLoader";
import { Colors } from "../../config";
import { addDiagnosisName } from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import globalStyles from "../../config/Styles";
import styles from "./Styles";
import { translations } from "../Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddDiagnosis extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route.params?.item?.id ?? 0,
      diagnosis_name: props.route.params?.item?.diagnosis ?? "",
      diagnosis_description: props.route.params?.item?.description ?? "",
      showLoader: false,
      hasIncidentTypeNameValidationError: false,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;
  };

  gotoBack = () => this.props.navigation.goBack();

  scrollToScrollViewTop = () =>
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  addDiagnosis = () => {
    let { diagnosis_name, diagnosis_description } = this.state;
    this.setState(
      {
        hasIncidentTypeNameValidationError: false,
      },
      () => {
        if (diagnosis_name.trim().length === 0) {
          this.setState({ hasIncidentTypeNameValidationError: true });
          this.scrollToScrollViewTop();
          return false;
        } else {
          this.setState({ showLoader: true });
          let obj = {
            id: this.state.id,
            cid: this.context.userDetails.cid,
            diagnosis: getCapitalizeTextWithoutExtraSpaces(diagnosis_name),
            description: diagnosis_description,
          };

          addDiagnosisName(obj)
            .then((response) => {
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((error) => console.log(error));
        }
      }
    );
  };

  render = () => (
    <Container>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        leftIconName={"arrow-back"}
        title={i18n.t("add_diagnosis_name")}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={[globalStyles.container, styles.formPaddingHorizontal]}>
        <ScrollView ref={this.formScrollViewRef}>
          <View style={globalStyles.boxBorder}>
            <View style={[globalStyles.fieldBox]}>
              <Text style={globalStyles.labelName}>
                {i18n.t("diagnosis_name")}
              </Text>
              <TextInput
                value={this.state.diagnosis_name}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(diagnosis_name) =>
                  this.setState({ diagnosis_name })
                }
                autoCompleteType="off"
                autoCapitalize="words"
              />
              {this.state.hasIncidentTypeNameValidationError ? (
                <Text style={globalStyles.errorText}>
                  {i18n.t("diagnosis_name")}
                </Text>
              ) : null}
            </View>

            <View style={[globalStyles.fieldBox, globalStyles.bbw0]}>
              <Text style={globalStyles.labelName}>
                {i18n.t("description")}
              </Text>
              <TextInput
                multiline={true}
                // numberOfLines={10}
                value={this.state.diagnosis_description}
                style={[globalStyles.textfield, globalStyles.width60]}
                onChangeText={(diagnosis_description) =>
                  this.setState({ diagnosis_description })
                }
                autoCompleteType="off"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.addDiagnosis}>
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
// 		// lineHeight: 40,
// 		fontSize: Colors.lableSize,
// 		paddingLeft: 4,
// 		height: "auto",
// 		paddingVertical: 10,
//     },
//     buttonsContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-evenly",
//         marginVertical: 30,
//     },
//     inputText: {
//         backgroundColor: "#fff",
// 		height: "auto",
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
//     },
//     inputTextArea: {
//         backgroundColor: "#fff",
// 		height: "auto",
// 		fontSize: Colors.textSize,
// 		color: Colors.textColor,
// 		textAlign: "left",
// 		padding: 5,
//     },
//     inputContainer: {
//         alignItems: "center",
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderBottomWidth: 1,
// 		backgroundColor: "#fff",
// 		height: "auto",
// 		justifyContent: "space-between",
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
//         fontSize: 18,
//     },
//     errorText: {
//         textAlign: "right",
//         color: Colors.tomato,
//         fontWeight: "bold",
//         fontStyle: "italic",
//     },
// });
