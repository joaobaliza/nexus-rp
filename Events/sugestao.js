require('../index')

const Discord = require('discord.js')
const client = require('../index')
const cor = require("..//cor.json")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "sugestao") {
        if (!interaction.guild.channels.cache.get(await db.get(`canal_log_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, flags: 64 })
        const modal1 = new Discord.ModalBuilder()
          .setCustomId("modal1")
          .setTitle("Sugestão");
  
        const pergunta = new Discord.TextInputBuilder()
          .setCustomId("pergunta")
          .setLabel("Qual a sugestão para a facção?")
          .setPlaceholder("Escreva sua sugestão aqui!")
          .setRequired(true)
          .setStyle(Discord.TextInputStyle.Paragraph)
  
        modal1.addComponents(
          new Discord.ActionRowBuilder().addComponents(pergunta)
        )
  
        await interaction.showModal(modal1)
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "modal1") {
  
        let resposta = interaction.fields.getTextInputValue("pergunta")
  
        if (!resposta) resposta = "Não informado."
  
        let embed = new Discord.EmbedBuilder()
          .setColor(cor.amarelo)
          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setDescription(`${interaction.user} fez uma nova sugestão`)
          .addFields(
            {
              name: `Sugestão:`,
              value: `\`\`\`${resposta}\`\`\``,
              inline: false
            }
          );
  
        interaction.reply({ content: `${interaction.user} A sua sugetão foi enviada com sucesso!`, flags: 64 })
        await interaction.guild.channels.cache.get(await db.get(`canal_log_${interaction.guild.id}`)).send({ embeds: [embed] }).then(msg => (
          msg.react("✅"),
          msg.react("❌")
        ))
      }
    }
  })