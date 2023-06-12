// @ts-check

const { setSpeed } = require("../components/commandData");
const { Command } = require("../components/files");

module.exports = new Command({
  data: (builder) => builder.setName("speed").setDescription("🎵 | Speed Music!"),
  async run(interaction) {
    return setSpeed(interaction);
  },
});
