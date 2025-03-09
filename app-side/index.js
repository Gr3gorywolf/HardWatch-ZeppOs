import { MessageBuilder } from "../shared/message";

const messageBuilder = new MessageBuilder();
const getRandomUsage = () => {
  return Math.floor(Math.random() * 101);
}
const getRandomOS = () => {
  return Math.random() > 0.5 ? "Windows" : "Linux";
}
async function fetchAllDevices(ctx) {
  try {
    
    const generateUsageData = (count = 5) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Device-${i + 1} - Linux`,
        cpuUsage: getRandomUsage(),
        gpuUsage: getRandomUsage(),
        ramUsage: getRandomUsage(),
        diskTotal: getRandomUsage()
      }));
    }
    const restBody = generateUsageData(12);
    ctx.response({
      data: { result: restBody },
    })

  } catch (error) {
    ctx.response({
      data: { result: "ERROR" },
    });
  }
};

async function fetchDeviceData(ctx, deviceId) {
  try {
    const restBody = {
      name: `Device-${deviceId} - Linux`,
      cpuUsages: Array.from({ length: 10 }, (_, i) => getRandomUsage()),
      gpuUsages: Array.from({ length: 10 }, (_, i) => getRandomUsage()),
      ramUsages: Array.from({ length: 10 }, (_, i) => getRandomUsage()),
      diskTotals: Array.from({ length: 10 }, (_, i) => getRandomUsage()),
      os: "Windows 10 Pro",
      cpu: "8c I7 10700k",
      gpu: "RTX 3080",
      ram: "16GB",
      disk: "1TB SSD",
      actionables: [
        {
          name: "Discord",
          action: "RESTART"
        },
        {
          name: "Browser",
          action: "SHUTDOWN"
        },
        {
          name: "Restart",
          action: "RESTART"
        },
        {
          name: "Shutdown",
          action: "SHUTDOWN"
        }
      ]
    }
    ctx.response({
      data: { result: restBody },
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
        return fetchDeviceData(ctx,jsonRpc.id);
      }
    });
  },

  onRun() {
    console.log("Serive is running");
  },

  onDestroy() { },
});
