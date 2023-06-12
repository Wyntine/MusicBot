// @ts-check

const { Command } = require("../components/files");
const { distube } = require("../components/client");

module.exports = new Command({
  data: (builder) =>
    builder
      .setName("back")
      .setDescription("🎵 | Back Music!")
      .addNumberOption((option) =>
        option.setName("number").setDescription("How far back do you want to go?").setRequired(true)
      ),
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const queue = distube.getQueue(interaction);

    if (!queue) return interaction.followUp(`There is no song on the list yet.`);

    const number = interaction.options.getNumber("number", true);
    queue.seek(queue.currentTime - number);
    return interaction.followUp("Successfully reclaimed the song.");
  },
});
