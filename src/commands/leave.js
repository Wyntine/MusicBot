// @ts-check

const { Command, db } = require("../components/files");
const { distube } = require("../components/client");

module.exports = new Command({
  data: (builder) => builder.setName("leave").setDescription("🎵 | Finish Music!"),
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const queue = distube.getQueue(interaction);

    if (!queue) return interaction.followUp(`There is no song on the list yet.`);

    distube.voices.leave(interaction);
    db.delete(`music_${interaction.guild.id}`);
    return await interaction.followUp("I'm leaving the voice channels.");
  },
});
