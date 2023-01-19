//created by Dibyendu
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
const styles = StyleSheet.create({
  images: { height: 15, width: 15, resizeMode: "contain" },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  body: {
    flex: 9,
  },
  icon: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    left: 290,
    zIndex: 1,
  },
  numberBox: {
    position: "absolute",
    bottom: 75,
    width: 30,
    height: 30,
    borderRadius: 15,
    left: 330,
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center",
  },
  number: { fontSize: 14, color: "#000" },
  dateRangePickerWrapper: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 3,
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  dateRangePickerDateContainer: {
    borderWidth: 1,
    borderRadius: 3,
    paddingVertical: 5,
    marginTop: 5,
    borderColor: "#e5e5e5",
    paddingHorizontal: 15,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 0.6,
    borderRadius: 2,
    borderColor: colors.primary,
    marginRight: 5,
  },
  name: {
    fontSize: 14,
    color: colors.white,
  },
});
export default styles;
