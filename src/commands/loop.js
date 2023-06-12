// @ts-check

const { Command } = require("../components/files");
const { loop } = require("../components/commandData");

module.exports = new Command({
  data: (builder) => builder.setName("loop").setDescription("🎵 | You loop the song!"),
  async run(interaction) {
    return loop(interaction);
  },
});
