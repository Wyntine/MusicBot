// @ts-check

const { Event } = require("../components/files");
const { volumeForm } = require("../components/static");
const {
  setVolume,
  setSpeed,
  setSlow,
  setBass,
  nowPlaying,
  pause,
  skip,
  loop,
  resume,
} = require("../components/commandData");

module.exports = new Event({
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;

    if (interaction.isModalSubmit()) {
      const { customId } = interaction;

      switch (customId) {
        case "form": {
          return setVolume(interaction);
        }
        default: {
          return;
        }
      }
    }

    if (interaction.isButton()) {
      const { customId } = interaction;

      switch (customId) {
        case "volume": {
          return interaction.showModal(volumeForm);
        }
        case "fast": {
          return setSpeed(interaction);
        }
        case "slowmode": {
          return setSlow(interaction);
        }
        case "bassboost": {
          return setBass(interaction);
        }
        case "soru": {
          return nowPlaying(interaction);
        }
        case "dur": {
          return pause(interaction);
        }
        case "skip": {
          return skip(interaction);
        }
        case "loop": {
          return loop(interaction);
        }
        case "devam": {
          return resume(interaction);
        }
        default: {
          return;
        }
      }
    }
  },
});
