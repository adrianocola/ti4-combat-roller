# TI4 Combat Roller

Easily set up and roll [Twilight Imperium 4](https://boardgamegeek.com/boardgame/233078/twilight-imperium-fourth-edition) combat dice.

Download: [iOS](https://apps.apple.com/us/app/ti4-combat-roller/id6469873806) | [Android](https://play.google.com/store/apps/details?id=com.adrianocola.ti4combatroller)

![example](https://github.com/adrianocola/ti4-combat-roller/blob/main/example.gif?raw=true)

Details and How to Use:
- Dice are grouped by unit combat values (9, 8, 7, etc.).
- To add a die, tap the right part of a line; to remove one, tap the left part.
- Tap the dice button at the bottom of the screen to roll all dice.
- The app displays each die result, the number of hits in a set, and the total hits.
- Tap the hits number to view a table showing all hit probabilities based on the rolled dice.
- Swipe left or right to choose between 5 different color schemes.
- Each color scheme has its own set of dice, which are useful for rolling both defense and attack on the same device.

### Building the App

Requirements:
- [Node.js](https://nodejs.org/)
- [Expo](https://docs.expo.dev/get-started/set-up-your-environment/)

```shell
# Clone the repository
git clone https://github.com/adrianocola/ti4-combat-roller

# Change to the project directory and install dependencies
cd ti4-combat-roller
npm install

# Run the app in the simulator
npm run ios # or
npm run android
```

For more details check [Expo](https://expo.dev/) and [Expo EAS](https://expo.dev/eas) documentation.
