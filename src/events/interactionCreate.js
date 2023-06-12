// @ts-check

const { Event, commands } = require("../components/files");

module.exports = new Event({
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.inCachedGuild() || !interaction.isChatInputCommand() || interaction.user.bot)
      return;

    const { commandName } = interaction;
    const command = commands.find(
      ({ data }) => data.name.toLocaleLowerCase() === commandName.toLocaleLowerCase()
    );

    if (!command) return;

    return command.run(interaction);
  },
});
