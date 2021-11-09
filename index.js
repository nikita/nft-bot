// Load .env file into process.env
require("dotenv").config();
// Import filesystem module
const fs = require("fs");
// Import discord.js module
const Discord = require("discord.js");
const { Client, Intents } = Discord;
// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Commands will be stored in the client instance
client.commands = new Discord.Collection();

const loadCommands = () => {
  // Search "commands" directory for all files ending in ".js"
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    // Load the command into memory
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection with the key
    // as the command name and the value as the exported module
    client.commands.set(command.name, command);
  }
};

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// When the client gets a message event, run this code
client.on("messageCreate", (msg) => {
  // Message does not start with our prefix or if message author is a bot dont run
  if (!msg.content.startsWith(process.env.PREFIX) || msg.author.bot) return;

  // Split the space between the command prefix and the command the user requested
  // Example: "!print hello" = "[print, hello]"
  const args = msg.content.slice(process.env.PREFIX.length).trim().split(" ");
  // Remove the first element from the array and lowercase it as command name
  const commandName = args.shift().toLowerCase();

  // If we don't have this command we don't continue
  if (!client.commands.has(commandName)) return;

  // Get the command from our client
  const command = client.commands.get(commandName);

  try {
    // Attempt to run this command with any arguments, if any.
    command.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("There was an error trying to execute that command!");
  }
});

// Load the commands
loadCommands();
// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
