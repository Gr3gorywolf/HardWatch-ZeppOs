import "@zapp-framework/watch";
import { Application } from "@zapp-framework/core";
import "./shared/device-polyfill"; 
import { setTheme } from "@zapp-framework/ui";
import { COLORS } from "./utils/config/colors";
import { MessageSingleton } from "./shared/message-initializer";
Application({
  onInit(){
    setTheme({
      background: COLORS.black,
      onError: COLORS.red.lighten5,
      onPrimary: COLORS.green.lighten5,
      onSecondary: COLORS.green.lighten5,
      onSurface: COLORS.grey.lighten5,
      primary: COLORS.green.base,
      secondary: COLORS.green.accent2,
      surface: COLORS.grey.darken3,
      error: COLORS.red.base,
      warning: COLORS.orange.base,
      info: COLORS.blue.base,
      success: COLORS.green.base,
      text: COLORS.grey.lighten5,
      textPrimary: COLORS.grey.lighten5,
      textSecondary: COLORS.grey.lighten5,
      textHint: COLORS.grey.lighten5,
      textDisabled: COLORS.grey.lighten1,
      textIcon: COLORS.grey.lighten5,
      textLink: COLORS.blue.base,
    })
    console.log("app on create invoke"); 
   
  //   console.log("all set");
  },
  onCreate(options) { 
  },

  onDestroy(options) {
  },
});
