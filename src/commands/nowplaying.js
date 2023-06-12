// @ts-check

const { Command } = require("../components/files");
const { nowPlaying } = require("../components/commandData");

module.exports = new Command({
  data: (builder) =>
    builder
      .setName("nowplaying")
      .setDescription("🎵 | You get information about the song playing."),
  async run(interaction) {
    return nowPlaying(interaction);
  },
});
