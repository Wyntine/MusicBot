// @ts-check

const { setSlow } = require("../components/commandData");
const { Command } = require("../components/files");

module.exports = new Command({
  data: (builder) => builder.setName("slowed").setDescription("🎵 | Slow Music!"),
  async run(interaction) {
    return setSlow(interaction);
  },
});
