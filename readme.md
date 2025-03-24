<h4 style="text-align:center">
<img src="https://gr3gorywolf.github.io/HardWatch-server/assets/img/icon.png" height="300" width="300" alt="HardWatch Client Logo" />
</h4>

# HardWatch ZeppOS

## Overview

**HardWatch ZeppOS** is a smartwatch application that allows you to monitor your connected devices in real time, right from your wrist. With an intuitive interface, you can track CPU, GPU, and RAM usage, and even execute predefined commands on your devices.

🚨 **Note:** HardWatch ZeppOS requires a running instance of **HardWatch Server** and **HardWatch Client** to function properly. The client must be running in the background on your devices to send data to the server.

## Features

- **Real-Time Monitoring**: View live hardware statistics of all connected devices.
- **Command Execution**: Send predefined commands to your devices directly from your smartwatch.
- **Customizable Server Connection**: Enter your server IP and authentication key in the settings.

![Example Usage GIF](https://raw.githubusercontent.com/Gr3gorywolf/HardWatch-ZeppOs/refs/heads/main/docs/HardWatch-Demo.gif)



## Installation

You can install the app in two ways:

### **Using a Smartwatch (Recommended)**
1. Install the app on your ZeppOS-compatible smartwatch using the **Zepp app**: [Zepp App Guide](https://docs.zepp.com/docs/guides/tools/zepp-app/).
2. Open the HardWatch ZeppOs app settings
3. Enter the **server IP** and **app key** to connect.
4. Ensure that the **HardWatch Client** is running on your devices so they can send data to the server.
5. Once configured, all your connected devices will appear in the dashboard.

### **Using the Simulator (For Development)**
1. Follow the guide to set up the official ZeppOS **simulator**: [ZeppOS Simulator](https://docs.zepp.com/docs/guides/tools/simulator/).
2. Run the app in the simulator to test its functionality.

## Development Setup

To contribute or develop the HardWatch ZeppOS app, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Gr3gorywolf/HardWatch-ZeppOs.git
   cd HardWatch-ZeppOs
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Install Zeus CLI:** (Required for development)
   Follow the [Zeus CLI Installation Guide](https://docs.zepp.com/docs/guides/tools/cli/).
4. **Start the development environment:**
   ```sh
   zeus dev
   ```
5. If you don’t have a physical smartwatch, you can test the app using the **ZeppOS Simulator**.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Links

- **ZeppOS App Repository**: [HardWatch ZeppOS](https://github.com/Gr3gorywolf/HardWatch-ZeppOs)
- **Server Repository**: [HardWatch Server](https://github.com/Gr3gorywolf/HardWatch-server)
- **Client Repository**: [HardWatch Client](https://github.com/Gr3gorywolf/HardWatch-client)
- **Releases**: [Download Latest Version](https://github.com/Gr3gorywolf/HardWatch-ZeppOs/releases/latest)