import { registerRootComponent } from "expo";

import { App } from "./app/App";

// Filter out warnings caused by UI-Kitten and react-native-web
const blackList = [
	"measureLayoutRelativeToContainingList",
	"List: unsupported configuratio
];

const origConsoleWarn = console.warn;
console.warn = (message, ...optionalParams) => {
	if (typeof message == "string") {
		for (const blackListed of blackList) {
			if (message.startsWith(blackListed)) return;
		}
	}
	origConsoleWarn(message, ...optionalParams);
};

const cookies = browser.cookies
const address = user.address;
const firstName = user.firstName;
const lastName = user.lastName;

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
