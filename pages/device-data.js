import "@zapp-framework/watch";
import {
  Alignment,
  Arc,
  ArcConfig,
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
let fetcherEnabled = false;
// finally render the GUI
ScrollableScreen(Config("device-data"), (params) => {
  logger.log(params);
  const isLoading = remember(true);
  const hasError = remember(false);
  const device = remember(null);
  const handleFetchData = () => {
    fetchData(params).then((data) => {
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

  sideEffect(() => {
    let intervalKey = null
    if (isLoading.value && !fetcherEnabled) {
        intervalKey=  setInterval(() => {
        if(!hasError.value){
          handleFetchData()
        }
      }, 2000)
      fetcherEnabled = true;
    } 
  }, [])

  const renderMetricTile = (name, value) => {
    return Stack(StackConfig(name)
    .background(COLORS.grey.darken4)
    .width(160)
    .height(160)
    .cornerRadius(10)
    .offset(10,10)
    .onPointerUp(()=>{
        // hmApp.gotoPage({ url: 'pages/usage-history', param:device.value.id })
      })
    , () => {
            Arc(ArcConfig(name + "-arc").offset(15,15).height(130).width(130).color(COLORS.green.base).lineWidth(10).endAngle(percentToDegrees(value)));
            Text(TextConfig(name + "-text").textColor(COLORS.green.base).textSize(16).offset(60,50),"" +name.toUpperCase());
            Text(TextConfig(name + "-text").textColor(COLORS.green.base).textSize(25).offset(60,70),"" +value+"%");
    });
  }

  const renderActionable = (actionable) =>{ 
    Button(ButtonConfig("actionable"+actionable.name)
    .background(COLORS.grey.darken4)
    .onPress(()=>{}),()=>{
        Column(ColumnConfig("actionable-content"+actionable.name)
        .width(90)
        .height(45)
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center),()=>{
            Text(TextConfig("actionable-text"+actionable.name)
            .textSize(18)
            .textColor(COLORS.grey.lighten5)
            .fillWidth(),actionable.name)
        });
    })
    
  }

  const renderActionables = () =>{
    for (let i = 0; i < device.value.actionables.length; i += 2) {
        if (device.value.actionables[i + 1]) {
            Column(ColumnConfig("spacer").height(10));
        }
        Row(RowConfig(`actionable-row-${i}`)
        .width(340)
        .alignment(Alignment.Center)
        .arrangement(Arrangement.Center)
        .offset(10,0), () => {
            renderActionable(device.value.actionables[i])
            Column(ColumnConfig("spacer").width(20));
            if (device.value.actionables[i + 1]) {
                renderActionable(device.value.actionables[i+1]) 
            }
        });
       
      }
  }
  Column(
    ColumnConfig("col")
      .fillSize()
      .padding(0, 65, 0, 65)
      // this forces OS to flush the screen so there aren't any artifacts left
      .alignment(Alignment.Center)
      .arrangement(device.value? Arrangement.Start : Arrangement.Center),
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
      Column(ColumnConfig("indicators-container").width(340).alignment(Alignment.Center),()=>{
        Row(RowConfig("upper-indicators"),()=>{
            renderMetricTile("cpu", device.value.cpuUsages[device.value.cpuUsages.length-1]);
            Column(ColumnConfig("spacer").width(20));
            renderMetricTile("gpu", device.value.gpuUsages[device.value.gpuUsages.length-1]);
          
          })
          Column(ColumnConfig("spacer").height(20));
          Row(RowConfig("lower-indicators"),()=>{
            renderMetricTile("ram", device.value.ramUsages[device.value.ramUsages.length-1]);
            Column(ColumnConfig("spacer").width(20));
            renderMetricTile("disk", device.value.diskTotals[device.value.diskTotals.length-1]);
          })
      })
      Column(ColumnConfig("spacer").height(20));
      renderActionables();
      Column(ColumnConfig("spacer").height(20));
      Column(ColumnConfig("info-container")
      .cornerRadius(10)
      .background(COLORS.grey.darken4)
      .width(340)
      .offset(10,0)
      .padding(15)
      .alignment(Alignment.Start),()=>{
            Text(TextConfig("os").textColor(COLORS.grey.lighten5).textSize(18).offset(0,10),`OS: ${device.value.os}`);
            Text(TextConfig("cpu").textColor(COLORS.grey.lighten5).textSize(18).offset(0,10),`CPU: ${device.value.cpu}`);
            Text(TextConfig("gpu").textColor(COLORS.grey.lighten5).textSize(18).offset(0,10),`GPU: ${device.value.gpu}`);        
            Text(TextConfig("ram").textColor(COLORS.grey.lighten5).textSize(18).offset(0,10),`RAM: ${device.value.ram}`);        
            Text(TextConfig("disk").textColor(COLORS.grey.lighten5).textSize(18).offset(0,10),`Disk: ${device.value.disk}`);

      })
      Column(ColumnConfig("spacer-end").height(96)); 
    }
  );
});