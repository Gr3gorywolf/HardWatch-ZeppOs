import { MessageBuilder } from "../shared/message";

const messageBuilder = new MessageBuilder();

async function fetchAllDevices(ctx) {
  try {
    const  getRandomUsage = () => {
      return Math.floor(Math.random() * 101);
    }
    const generateUsageData = (count = 5) => {
      return Array.from({ length: count }, (_, i) => ({
        name: `Device-${i + 1}`,
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
    });
  },

  onRun() {
    console.log("Serive is running");
  },

  onDestroy() { },
});
