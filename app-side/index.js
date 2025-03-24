import { MessageBuilder } from "../shared/message";

const messageBuilder = new MessageBuilder();
function getMonitorSettings() {
  return settings.settingsStorage.getItem('monitor-settings')
    ? JSON.parse(settings.settingsStorage.getItem('monitor-settings'))
    : { serverUrl: '', appKey: '' }
}

async function fetchAllDevices(ctx) {
  const settings = getMonitorSettings();
  try {

    const res = await fetch({
      url: `${settings.serverUrl}/api/devices/get-devices-stats`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'appkey': settings.appKey
      }
    })
    const resBody = typeof res.body === 'string' ? JSON.parse(res.body) : res.body
    ctx.response({
      data: { result: resBody },
    })

  } catch (error) {
    ctx.response({
      data: { result: "ERROR" },
    });
  }
};

async function fetchDeviceData(ctx, deviceId) {
  const settings = getMonitorSettings();
  try {
    const res = await fetch({
      url: `${settings.serverUrl}/api/devices/get-device-stats/${deviceId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'appkey': settings.appKey
      }
    })
    const resBody = typeof res.body === 'string' ? JSON.parse(res.body) : res.body

    ctx.response({
      data: { result: resBody },
    })
  } catch (error) {
    console.error(error);
    ctx.response({
      data: { result: JSON.stringify(error) },
    });
  }
};

async function sendDeviceAction(ctx, deviceId,action) {
  const settings = getMonitorSettings();
  try {
    const res = await fetch({
      url: `${settings.serverUrl}/api/devices/send-action/${deviceId}`,
      body: JSON.stringify({name:deviceId,action}),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'appkey': settings.appKey
      }
    })
    const resBody = typeof res.body === 'string' ? JSON.parse(res.body) : res.body

    ctx.response({
      data: { result: resBody },
    })
  } catch (error) {
    console.error(error);
    ctx.response({
      data: { result: JSON.stringify(error) },
    });
  }
};

AppSideService({
  onInit() {
    console.log("Init");
    messageBuilder.listen(() => {
      console.log("Listening");
    }); 
    messageBuilder.on("request", (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
      console.log("DATAAA");
      if (jsonRpc.method === "ALL_DEVICES") {
        return fetchAllDevices(ctx);
      }
      if (jsonRpc.method === "DEVICE") {
        return fetchDeviceData(ctx, jsonRpc.id);
      }
      if (jsonRpc.method === "DEVICE_ACTION") {
        return sendDeviceAction(ctx, jsonRpc.id,jsonRpc.action);
      }
    });
  },

  onRun() {
    console.log("Serive is running");
  },

  onDestroy() { },
});
