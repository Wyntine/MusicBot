// @ts-check

const { default: SoundCloudPlugin } = require("@distube/soundcloud");
const { default: SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnFinish: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({ emitEventsAfterFetching: true }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

module.exports = {
  client,
  distube,
};
