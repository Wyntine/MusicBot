// @ts-check

const { EmbedBuilder } = require("discord.js");
const { Command } = require("../components/files");

module.exports = new Command({
  data: (builder) => builder.setName("static").setDescription("🤖 | See your bot static!"),
  async run(interaction) {
    const client = interaction.client;
    await interaction.deferReply({ ephemeral: true });
    const fields = [
      [
        "Total Member",
        `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
      ],
      ["Total Guilds", `${client.guilds.cache.size.toLocaleString()}`],
      ["Total Channels", `${client.channels.cache.size.toLocaleString()}`],
      ["Total Ram", `${(process.memoryUsage().heapUsed / 1024 / 512).toFixed(2)} MB`],
      ["Music Guilds", `${client?.voice?.adapters?.size || 0}`],
      ["Ping", `${client.ws.ping}`],
    ].map(([name, value]) => ({ name, value, inline: true }));
    const embed = new EmbedBuilder()
      .setAuthor({ name: "Raven - Bot Static!", iconURL: client.user.displayAvatarURL() })
      .addFields(fields)
      .setColor("Orange");
    return interaction.followUp({ embeds: [embed] });
  },
});
