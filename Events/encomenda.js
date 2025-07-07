require('../index')

const Discord = require('discord.js')
const client = require('../index')
const cor = require('../cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "encomenda") {
      if (!interaction.guild.channels.cache.get(await db.get(`canal_log_encomenda_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, flags: 64 })
      const modal3 = new Discord.ModalBuilder()
        .setCustomId("modal3")
        .setTitle("Encomenda");

      const pencomenda1 = new Discord.TextInputBuilder()
        .setCustomId("pencomenda1")
        .setLabel("Qual a quantidade e item encomendado?")
        .setMaxLength(30)
        //.setMinLength(5)
        .setPlaceholder("Informe a quantida e o item aqui!")
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short)

      const pencomenda2 = new Discord.TextInputBuilder()
        .setCustomId("pencomenda2")
        .setLabel("Cliente?")
        .setMaxLength(30)
        .setPlaceholder("Informe o cliente aqui!")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true)

      const pencomenda3 = new Discord.TextInputBuilder()
        .setCustomId("pencomenda3")
        .setLabel("Valor da encomenda?")
        .setMaxLength(30)
        .setPlaceholder("Informe o valor aqui!")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true)

      const pencomenda4 = new Discord.TextInputBuilder()
        .setCustomId("pencomenda4")
        .setLabel("Data para entrega da encomenda?")
        .setMaxLength(30)
        .setPlaceholder("Informe a data da entrega aqui!")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true)

      const pencomenda5 = new Discord.TextInputBuilder()
        .setCustomId("pencomenda5")
        .setLabel("A encomenda ja foi entregue?")
        .setMaxLength(30)
        .setPlaceholder("Informe o status da encomanda aqui!")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true)

      modal3.addComponents(
        new Discord.ActionRowBuilder().addComponents(pencomenda1),
        new Discord.ActionRowBuilder().addComponents(pencomenda2),
        new Discord.ActionRowBuilder().addComponents(pencomenda3),
        new Discord.ActionRowBuilder().addComponents(pencomenda4),
        new Discord.ActionRowBuilder().addComponents(pencomenda5),
      )

      await interaction.showModal(modal3)
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal3") {

      let eresposta1 = interaction.fields.getTextInputValue("pencomenda1")
      let eresposta2 = interaction.fields.getTextInputValue("pencomenda2")
      let eresposta3 = interaction.fields.getTextInputValue("pencomenda3")
      let eresposta4 = interaction.fields.getTextInputValue("pencomenda4")
      let eresposta5 = interaction.fields.getTextInputValue("pencomenda5")

      if (!eresposta1) eresposta1 = "Não informado."
      if (!eresposta2) eresposta2 = "Não informado."
      if (!eresposta3) eresposta3 = "Não informado."
      if (!eresposta4) eresposta4 = "Não informado."
      if (!eresposta5) eresposta5 = "Não informado."

      let embed = new Discord.EmbedBuilder()
        .setColor(cor.amarelo)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`O usuário ${interaction.user} enviou a encomenda abaixo:`)
        .addFields(
          {
            name: `Quantidade e item encomendado:`,
            value: `\`\`\`${eresposta1}\`\`\``,
            inline: false
          },
          {
            name: `Cliente:`,
            value: `\`\`\`${eresposta2}\`\`\``,
            inline: false
          },
          {
            name: `Valor da encomenda:`,
            value: `\`\`\`${eresposta3}\`\`\``,
            inline: false
          },
          {
            name: `Data para entrega da encomenda:`,
            value: `\`\`\`${eresposta4}\`\`\``,
            inline: false
          },
          {
            name: `A encomenda ja foi entregue:`,
            value: `\`\`\`${eresposta5}\`\`\``,
            inline: false
          }
        );

      let buttonEntrega = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('entrega')
          .setEmoji('✔️')
          .setLabel('Finalizar entrega')
          .setStyle(Discord.ButtonStyle.Success)
      )

      interaction.reply({ content: `${interaction.user} A sua encomenda foi enviada com sucesso!`, flags: 64 })
      await interaction.guild.channels.cache.get(await db.get(`canal_log_encomenda_${interaction.guild.id}`)).send({ embeds: [embed], components: [buttonEntrega] }).then(async (msg) => {
        await db.set(`r1_${msg.id}`, eresposta1)
        await db.set(`r2_${msg.id}`, eresposta2)
        await db.set(`r3_${msg.id}`, eresposta3)
        await db.set(`r4_${msg.id}`, eresposta4)
      })
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'entrega') {

      const r1 = await db.get(`r1_${interaction.message.id}`)
      const r2 = await db.get(`r2_${interaction.message.id}`)
      const r3 = await db.get(`r3_${interaction.message.id}`)
      const r4 = await db.get(`r4_${interaction.message.id}`)

      let embed = new Discord.EmbedBuilder()
        .setColor(cor.verde)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Encomenda entregue por: ${interaction.user}`)
        .addFields(
          {
            name: `Quantidade e item encomendado:`,
            value: `\`\`\`${r1}\`\`\``,
            inline: false
          },
          {
            name: `Cliente:`,
            value: `\`\`\`${r2}\`\`\``,
            inline: false
          },
          {
            name: `Valor da encomenda:`,
            value: `\`\`\`${r3}\`\`\``,
            inline: false
          },
          {
            name: `Data para entrega da encomenda:`,
            value: `\`\`\`${r4}\`\`\``,
            inline: false
          },
          {
            name: `A encomenda ja foi entregue:`,
            value: `\`\`\`entregue\`\`\``,
            inline: false
          }
        );

      interaction.message.edit({ embeds: [embed], components: [] })
    }
  }
})