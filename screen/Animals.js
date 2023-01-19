import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Container, Tab, Tabs, ScrollableTab } from "native-base";
import {
  IdDetails,
  Pedigree,
  ProfileNew,
  VaccineDetails,
  VaccinationDetails,
  Measurement,
  MedicalRecord,
  IncidentReporting,
  Enclosures,
  FeedingAssignments,
  Feedings,
  SalesTransfer,
  BriefView,
} from "./AnimalDetails/index";
import Colors from "../config/colors";
import { Header } from "../component";
import AppContext from "../context/AppContext";
import Profile_Pedigree from "./AnimalDetails/Profile_Pedigree";
import globalStyles from "../config/Styles";
import styles from "./Styles";
import { translations } from "./Settings/LanguageSettigs/localizations";
import { I18n } from "i18n-js";

const i18n = new I18n(translations);

export default class AnimalsData extends React.Component {
  static contextType = AppContext;

  componentDidMount() {
    i18n.enableFallback = true;
    i18n.locale = this.context.locale;
  }

  errorMessage = () => (
    <View
      style={[
        globalStyles.flex1,
        globalStyles.alignItemsCenter,
        globalStyles.justifyContentCenter,
      ]}
    >
      <Text>{i18n.t("create_profile_first")}</Text>
    </View>
  );

  renderTabBar = (props) => {
    props.tabStyle = Object.create(props.tabStyle);
    return <ScrollableTab {...props} style={styles.scrollableTab} />;
  };

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        title={"Animal Record"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={() => {
          this.props.navigation.goBack();
        }}
      />
      <Tabs
        renderTabBar={this.renderTabBar}
        tabBarUnderlineStyle={styles.underlineStyle}
        locked
      >
        <Tab
          heading={i18n.t("brief_view")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          <BriefView {...this.props} />
          {/* <ProfileNew {...this.props} /> */}
        </Tab>
        <Tab
          heading={i18n.t("profile_and_pedigree")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          <Profile_Pedigree {...this.props} />
          {/* <ProfileNew {...this.props} /> */}
        </Tab>
        {/* <Tab
					heading="Profile"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
				>
					<Pedigree {...this.props} /> */}
        {/* <ProfileNew {...this.props} /> */}
        {/* </Tab> */}
        {/* <Tab
					heading="Pedigree"
					tabStyle={styles.inActiveTab}
					textStyle={styles.inActiveText}
					activeTabStyle={styles.activeTab}
					activeTextStyle={styles.activeText}
					disabled
				>
					{typeof this.context.selectedAnimalID !== "undefined" ? (
						<IdDetails {...this.props} />
					) : (
						this.errorMessage()
					)}
				</Tab> */}
        <Tab
          heading={i18n.t("enclosure_history")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <Enclosures {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("vaccine")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
          disabled
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <VaccineDetails {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("vaccinations")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <VaccinationDetails {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("medical")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <MedicalRecord {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("incident")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <IncidentReporting {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("measurement")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <Measurement {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("feeding_assignment")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <FeedingAssignments {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("feeding")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <Feedings {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
        <Tab
          heading={i18n.t("sales_transfer")}
          tabStyle={styles.inActiveTab}
          textStyle={styles.inActiveText}
          activeTabStyle={styles.activeTab}
          activeTextStyle={styles.activeText}
        >
          {typeof this.context.selectedAnimalID !== "undefined" ? (
            <SalesTransfer {...this.props} />
          ) : (
            this.errorMessage()
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}

// const styles = StyleSheet.create({
// 	activeTab: {
// 		backgroundColor: Colors.activeTab,
// 		height: 40,
// 		marginVertical: 5,
// 		borderRadius: 2,
// 		marginHorizontal: 5,
// 	},
// 	activeText: {
// 		color: Colors.white,
// 	},
// 	inActiveTab: {
// 		backgroundColor: Colors.inactiveTab,
// 		height: 40,
// 		marginVertical: 5,
// 		borderRadius: 2,
// 		marginHorizontal: 5,
// 	},
// 	inActiveText: {
// 		color: Colors.white,
// 	},
// 	underlineStyle: { backgroundColor: "transparent" },
// 	scrollableTab: {
// 		backgroundColor: Colors.white,
// 		// borderWidth: 0,
// 		borderColor: "#FFF",
// 	},

// });
