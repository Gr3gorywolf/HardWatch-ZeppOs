import "@zapp-framework/watch";
import {
  Alignment,
  Arc,
  Arrangement,
  Column,
  ColumnConfig,
  Config,
  remember,
  Row,
  RowConfig,
  sideEffect,
  SimpleScreen,
  TextConfig,
} from "@zapp-framework/core";
import { MessageBuilder } from "../shared/message";
import { ActivityIndicator, ActivityIndicatorConfig, Button, ButtonConfig, Text } from "@zapp-framework/ui";
import { COLORS } from "../utils/config/colors";
import { ScrollableScreen } from "@zapp-framework/watch";
import { MessageInitializer } from "../shared/message-initializer";
const logger = DeviceRuntimeCore.HmLogger.getLogger("fetch_api");
const messageBuilder = MessageInitializer.init();
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
    if (isLoading.value) {
      setInterval(()=>{
        handleFetchData()
      },3000)
    }
  }, [])
  const renderDevice = (device) => {
    Button(ButtonConfig(device.name).background(COLORS.grey.darken4).onPress(() => { }), () => {
      Text(TextConfig("device-name-text").offset(0,5).textColor(COLORS.grey.lighten5).fillWidth().textSize(10),`${device.name}`)
      // Column(ColumnConfig(device.name + "col").width(90), () => {
      //   Text(TextConfig("device-name-text").offset(0,5).textColor(COLORS.grey.lighten5).fillWidth().textSize(10),`${device.name}`)
      //   Row(RowConfig("usage-processors-row").offset(0,5), () => {
      //     Text(TextConfig("cpu-usage").textColor(COLORS.grey.lighten5).textSize(10), `CPU: ${device.cpuUsage}%`)
      //     Text(TextConfig("gpu-usage").textColor(COLORS.grey.lighten5).textSize(10).offset(5), `GPU: ${device.gpuUsage}%`)
      //   })
      //   Row(RowConfig("usage-memories-row").offset(0,5), () => {
      //     Text(TextConfig("ram-usage").textColor(COLORS.grey.lighten5).textSize(10), `RAM: ${device.ramUsage}%`)
      //     Text(TextConfig("hdd-usage").textColor(COLORS.grey.lighten5).textSize(10).offset(5), `HDD: ${device.diskTotal}%`)
      //   })
      // })
    })
  }
  Column(
    ColumnConfig("col")
      .fillSize()
      .padding(0,65,0,40)
      // this forces OS to flush the screen so there aren't any artifacts left
      .alignment(devices.value.length > 0? Alignment.Start: Alignment.Center)
      .arrangement(devices.value.length > 0? Arrangement.Start: Arrangement.Center),
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
        Column(ColumnConfig("devices-col").arrangement(Arrangement.Center), () => {
          for (let i = 0; i < devices.value.length; i += 2) {
            Row(RowConfig(`device-row-${i}`).width(160), () => {
              renderDevice(devices.value[i]);
              if (devices.value[i + 1]) {
                renderDevice(devices.value[i + 1]);
              }
            });
          }
        });


      }


    }
  );
});