const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("..//..//cor.json")
const db = new QuickDB()

module.exports = {
  name: "", // Coloque o nome do comando
  description: "", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "",
      description: "",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "",
      description: "",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    }
  ],

  run: async (client, interaction) => {


  }
}