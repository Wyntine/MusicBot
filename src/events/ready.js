// @ts-check

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { commands, db, Event } = require("../components/files");
const { token } = require("../config");

module.exports = new Event({
  name: "ready",
  once: true,
  async execute(client) {
    const rest = new REST({ version: "10" }).setToken(token);

    console.log(`Bot logged in as ${client.user.tag}!`);
    client.user.setActivity("🎵 | Raven Music");
    client.guilds.cache.filter((guild) => {
      const data = db.fetch(`music_${guild.id}`);
      if (!data) return;
      db.delete(`music_${guild.id}`);
    });

    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands.map(({ data }) => data.toJSON()),
      });
    } catch (error) {
      console.error(error);
    }
  },
});
