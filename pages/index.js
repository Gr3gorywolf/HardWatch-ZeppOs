import "@zapp-framework/watch";
import {
  Alignment,
  Arrangement,
  Column,
  ColumnConfig,
  Config,
  remember,
  sideEffect,
  TextConfig,
} from "@zapp-framework/core";
import { ActivityIndicator, ActivityIndicatorConfig, Button, ButtonConfig, ButtonStyle, Divider, DividerConfig, Text } from "@zapp-framework/ui";
import { COLORS } from "../utils/config/colors";
import { rememberScrollPosition, ScrollableScreen } from "@zapp-framework/watch";
import { getGlobal } from "../shared/global";
import { removeDecimal } from "../shared/data";
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
        if(data.result === "ERROR"){
          logger.error("Http error",data);
          reject("Error fetching data");
          return;
        }
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
        handleFetchData()
        intervalKey=  setInterval(() => {
        if(!hasError.value){
          handleFetchData()
        }
      }, 5000)
      fetcherEnabled = true;
    } 
  }, [])
  const renderDevice = (device) => {
    const handleNavigate = ()=>{
      hmApp.gotoPage({ url: 'pages/device-data', param: JSON.stringify({id:device.id}) })
    }
    Column(ColumnConfig(device.name + "spacer").height(20));
    Column(ColumnConfig(device.name + "container")
      .padding(15)
      .fillWidth()
      .height(100)
      .cornerRadius(5)
      .onPointerUp(handleNavigate)
      .background(COLORS.grey.darken5), () => {
        Text(TextConfig(device.name +"device-name-text").textColor(COLORS.grey.lighten5).fillWidth().textSize(20), `${device.name} - ${device.platform}`)
        Divider(DividerConfig("divider").fillWidth().offset(0, 8).color(COLORS.grey.darken3))
        Text(TextConfig(device.name+"usage").textColor(COLORS.grey.lighten5).offset(0, 15).textSize(16), `CPU: ${removeDecimal(device.cpuUsage)}%  |  GPU: ${removeDecimal(device.gpuUsage)}%  |  RAM: ${removeDecimal(device.ramUsage)}%  |  HDD: ${removeDecimal(device.diskUsage)}%`)

      });
  }
  Column(
    ColumnConfig("col")
      .fillSize()
      .padding(10, 65, 10, 40)
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