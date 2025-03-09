import "@zapp-framework/watch";
import {
  Alignment,
  Arc,
  ArcConfig,
  Arrangement,
  Column,
  ColumnConfig,
  Config,
  ConfigBuilder,
  Custom,
  remember,
  Row,
  RowConfig,
  sideEffect,
  SimpleScreen,
  Stack,
  StackConfig,
  TextConfig,
} from "@zapp-framework/core";
import { ActivityIndicator, ActivityIndicatorConfig, Button, ButtonConfig, ButtonStyle, Divider, DividerConfig, Text } from "@zapp-framework/ui";
import { COLORS } from "../utils/config/colors";
import { ScrollableScreen } from "@zapp-framework/watch";
import { percentToDegrees } from "../shared/data";
import { getGlobal } from "../shared/global";
const logger = DeviceRuntimeCore.HmLogger.getLogger("fetch_api");
const messageBuilder = getGlobal().messageBuilder;
hmApp.setScreenKeep(true)
hmUI.setStatusBarVisible(false)
function fetchData(id) {
  return new Promise((resolve, reject) => {
    messageBuilder
      .request({
        method: "DEVICE",
        id
      })
      .then((data) => {
        logger.log("Data fetched", data);
        resolve(data);
      }).catch((error) => {
        logger.error("Error fetching data", error);
        reject(error);
      });
  });
}

// finally render the GUI
ScrollableScreen(Config("usage-history"), (params) => {
    logger.log("da-params");
  logger.log(params);
//   const [id,type] =params? params.split("-"):[];
  const isLoading = remember(false);
  const hasError = remember(false);
  const device = remember(null);
  const handleFetchData = () => {
    fetchData(id).then((data) => {
      logger.log("Data fetched", data);
      device.value = data.result;
      hmUI.setStatusBarVisible(true)
      hmUI.updateStatusBarTitle(device.value.name)
    }).catch((error) => {
      logger.error(error);
      hasError.value = true;
    }).finally(() => {
      isLoading.value = false;
    });
  };

//   sideEffect(() => {
//     if (isLoading.value) {
//       setInterval(() => {
//         if(!hasError.value){
//           handleFetchData()
//         }
//       }, 2000)
//     }
//   }, [])

  Column(
    ColumnConfig("col")
      .fillSize()
      .padding(0, 65, 0, 65)
      // this forces OS to flush the screen so there aren't any artifacts left
      .alignment(Alignment.Center)
      .arrangement(Arrangement.Center),
    () => {
      if (isLoading.value) {
        ActivityIndicator(ActivityIndicatorConfig("loader").size(140).lineWidth(18))
        return;
      }
      if (hasError.value) {
        Text(TextConfig("error").textColor(COLORS.red.base).offset(0, -20), "Error fetching data")
        Button(ButtonConfig("retry").onPress(() => {
          isLoading.value = true;
          handleFetchData();
        }), () => {
          Text(TextConfig("retry-text").textColor(COLORS.grey.lighten5), "Retry")
        })
        return;
      }
      hmUI.createWidget(hmUI.widget.HISTOGRAM, {
        x: 0,
        y: 0,
        h: 400,
        w: 400,
        item_width: 20,
        item_space: 10,
        item_radius: 10,
        item_start_y: 50,
        item_max_height: 230,
        item_color: COLORS.green.base,
        data_array: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
        data_count: 10,
        data_min_value: 10,
        data_max_value: 100,
        xline: {
          pading: 20,
          space: 20,
          start: 0,
          end: 300,
          color: COLORS.black,
          width: 1,
          count: 15
        },
        yline: {
          pading: 10,
          space: 10,
          start: 0,
          end: 300,
          color: COLORS.black,
          width: 1,
          count: 30
        },
        xText: {
          x: 12,
          y: 270,
          w: 20,
          h: 50,
          space: 10,
          align: hmUI.align.LEFT,
          color: COLORS.grey.lighten5,
          count: 10,
          data_array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        },
        yText: {
          x: 0,
          y: 20,
          w: 50,
          h: 50,
          space: 10,
          align: hmUI.align.LEFT,
          color: COLORS.grey.lighten5,
          count: 10,
          data_array: ['10%', '20%', '30%', '40%', '50%', '60%', '70%',"80%","90%","100%"].reverse()
        }
      })
    }
  );
});