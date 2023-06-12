// @ts-check

const { Command } = require("../components/files");
const { setBass } = require("../components/commandData");

module.exports = new Command({
  data: (builder) => builder.setName("bass").setDescription("🎵 | Bass boost"),
  async run(interaction) {
    return setBass(interaction);
  },
});
