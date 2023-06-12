// @ts-check

const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} = require("discord.js");
const { JsonDatabase } = require("wio.db");

/** @type {Command[]} */
const commands = [];
const db = new JsonDatabase({ databasePath: "./src/db" });

/**
 * @template {keyof import("discord.js").ClientEvents} Category
 */
class Event {
  name;
  once;
  execute;

  /**
   * @param {{
   *  name: Category,
   *  once?: boolean
   *  execute: (...data: import("discord.js").ClientEvents[Category]) => import("discord.js").Awaitable<any>
   * }} options
   */
  constructor({ name, once = false, execute }) {
    this.name = name;
    this.once = once;
    this.execute = execute;
  }
}

/**
 * @typedef {SlashCommandBuilder |
 *  Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> |
 *  SlashCommandSubcommandBuilder |
 *  import("discord.js").SlashCommandOptionsOnlyBuilder |
 *  SlashCommandSubcommandGroupBuilder |
 *  import("discord.js").SlashCommandSubcommandsOnlyBuilder} BuilderOptions
 */

class Command {
  /** @type {BuilderOptions} */
  data;
  run;

  /**
   * @param {{
   *  data: (builder: SlashCommandBuilder) => BuilderOptions,
   *  run: (interaction: ChatInputCommandInteraction<"cached">) => import("discord.js").Awaitable<any>
   * }} options
   */
  constructor({ data, run }) {
    this.data = data(new SlashCommandBuilder());
    this.run = run;
  }
}

module.exports = {
  commands,
  db,
  Event,
  Command,
};
