import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { pingCommand } from "./commands/ping.js";
dotenv.config();
const commands = [pingCommand.data.toJSON()];
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
console.log("Commands deployed.");
