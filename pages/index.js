import "@zapp-framework/watch";
import {
  Alignment,
  Arc,
  Arrangement,
  Column,
  ColumnConfig,
  Config,
  Custom,
  remember,
  Row,
  RowConfig,
  sideEffect,
  SimpleScreen,
  TextConfig,
} from "@zapp-framework/core";
import { MessageBuilder } from "../shared/message";
import { ActivityIndicator, ActivityIndicatorConfig, Button, ButtonConfig, ButtonStyle, Divider, DividerConfig, Text } from "@zapp-framework/ui";
import { COLORS } from "../utils/config/colors";
import { rememberScrollPosition, ScrollableScreen } from "@zapp-framework/watch";
import { MessageInitializer } from "../shared/message-initializer";
import { getGlobal } from "../shared/global";
const logger = DeviceRuntimeCore.HmLogger.getLogger("fetch_api");
hmUI.updateStatusBarTitle("My Devices")
const messageBuilder = getGlobal().messageBuilder;
function fetchData() {
  return new Promise((resolve, reject) => {
    messageBuilder
      .request({
        method: "ALL_DEVICES",
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
let fetcherEnabled = false;
// finally render the GUI
ScrollableScreen(Config("screen"), () => {
  const isLoading = remember(true);
  const hasError = remember(false);
  const devices = remember([]);
  const handleFetchData = () => {
    fetchData().then((data) => {
      logger.log("Data fetched", data);
      devices.value = data.result;
    }).catch((error) => {
      logger.error(error);
      hasError.value = true;
    }).finally(() => {
      isLoading.value = false;
    });
  };

  sideEffect(() => {
    let intervalKey = null
    if (isLoading.value && !fetcherEnabled) {
        intervalKey=  setInterval(() => {
        if(!hasError.value){
          handleFetchData()
        }
      }, 5000)
      fetcherEnabled = true;
    } 
  }, [])
  const renderDevice = (device) => {
    Column(ColumnConfig(device.name + "spacer").height(5));
    Column(ColumnConfig(device.name + "container")
      .padding(15)
      .fillWidth()
      .height(100)
      .cornerRadius(5)
      .onPointerUp(()=>{
        hmApp.gotoPage({ url: 'pages/device-data', param: device.id })
      })
      .background(COLORS.grey.darken4), () => {
        Text(TextConfig("device-name-text").textColor(COLORS.grey.lighten5).fillWidth().textSize(20), `${device.name}`)
        Divider(DividerConfig("divider").fillWidth().offset(0, 8).color(COLORS.grey.darken3))
        Text(TextConfig("cpu-usage").textColor(COLORS.grey.lighten5).offset(0, 15).textSize(16), `CPU: ${device.cpuUsage}%  |  GPU: ${device.gpuUsage}%  |  RAM: ${device.ramUsage}%  |  HDD: ${device.diskTotal}%`)

      });
  }
  Column(
    ColumnConfig("col")
      .fillSize()
      .padding(0, 65, 0, 40)
      // this forces OS to flush the screen so there aren't any artifacts left
      .alignment(devices.value.length > 0 ? Alignment.Start : Alignment.Center)
      .arrangement(devices.value.length > 0 ? Arrangement.Start : Arrangement.Center),
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
          Text(TextConfig("retry").textColor(COLORS.grey.lighten5), "Retry")
        })
        return;
      }
      if (devices.value.length === 0) {
        Text(TextConfig("error").textColor(COLORS.grey.lighten5), "No devices to show")
      } else {
        for (let device of devices.value) {
          renderDevice(device);
        }
      }


    }
  );
});