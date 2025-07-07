require('../index')

const Discord = require('discord.js')
const client = require('../index')
const cor = require('..//cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "indicaçao") {
      if (!interaction.guild.channels.cache.get(await db.get(`canal_log_indicaçao_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, flags: 64 })
      const modal2 = new Discord.ModalBuilder()
        .setCustomId("modal2")
        .setTitle("Indicação");

      const pergunta01 = new Discord.TextInputBuilder()
        .setCustomId("pergunta01")
        .setLabel("Nome completo no RP?")
        .setMaxLength(30)
        //.setMinLength(5)
        .setPlaceholder("Informe o nome do indicado aqui!")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short)

      const pergunta02 = new Discord.TextInputBuilder()
        .setCustomId("pergunta02")
        .setLabel("Há quanto tempo vocês se conhecem?")
        .setMaxLength(30)
        .setPlaceholder("Informe o tempo aqui!")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true)

      const pergunta03 = new Discord.TextInputBuilder()
        .setCustomId("pergunta03")
        .setLabel("O indicado já trabalhou com o que?")
        .setMaxLength(30)
        .setPlaceholder("Informe os empregos aqui!")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true)

      const pergunta04 = new Discord.TextInputBuilder()
        .setCustomId("pergunta04")
        .setLabel("O que o indicado é seu?")
        .setMaxLength(30)
        .setPlaceholder("Informe o que ele é aqui!")
        .setStyle(Discord.TextInputStyle.Short)
        .setRequired(true)

      const pergunta05 = new Discord.TextInputBuilder()
        .setCustomId("pergunta05")
        .setLabel("Por que devemos aceitar o indicado?")
        .setPlaceholder("Informe o porque de ser aceito aqui!")
        .setStyle(Discord.TextInputStyle.Paragraph)
        .setRequired(true)

      modal2.addComponents(
        new Discord.ActionRowBuilder().addComponents(pergunta01),
        new Discord.ActionRowBuilder().addComponents(pergunta02),
        new Discord.ActionRowBuilder().addComponents(pergunta03),
        new Discord.ActionRowBuilder().addComponents(pergunta04),
        new Discord.ActionRowBuilder().addComponents(pergunta05),
      )

      await interaction.showModal(modal2)
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal2") {

      let resposta01 = interaction.fields.getTextInputValue("pergunta01")
      let resposta02 = interaction.fields.getTextInputValue("pergunta02")
      let resposta03 = interaction.fields.getTextInputValue("pergunta03")
      let resposta04 = interaction.fields.getTextInputValue("pergunta04")
      let resposta05 = interaction.fields.getTextInputValue("pergunta05")

      if (!resposta01) resposta01 = "Não informado."
      if (!resposta02) resposta02 = "Não informado."
      if (!resposta03) resposta03 = "Não informado."
      if (!resposta04) resposta04 = "Não informado."
      if (!resposta05) resposta05 = "Não informado."



      let embed = new Discord.EmbedBuilder()
        .setColor(cor.amarelo)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`O usuário ${interaction.user} enviou a indicação abaixo:`)
        .addFields(
          {
            name: `Nome completo no RP:`,
            value: `\`\`\`${resposta01}\`\`\``,
            inline: false
          },
          {
            name: `Há quanto tempo vocês se conhecem:`,
            value: `\`\`\`${resposta02}\`\`\``,
            inline: false
          },
          {
            name: `O indicado já trabalhou com o que:`,
            value: `\`\`\`${resposta03}\`\`\``,
            inline: false
          },
          {
            name: `O que o indicado é seu:`,
            value: `\`\`\`${resposta04}\`\`\``,
            inline: false
          },
          {
            name: `Por que devemos aceitar o indicado:`,
            value: `\`\`\`${resposta05}\`\`\``,
            inline: false
          }
        );

      let botao = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("aprovarIndicação")
          .setEmoji("✔️")
          .setLabel("Aprovar")
          .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
          .setCustomId("reprovarIndicação")
          .setEmoji("✖️")
          .setLabel("Reprovar")
          .setStyle(Discord.ButtonStyle.Danger)

      );

      interaction.reply({ content: `${interaction.user} Sua indicação foi enviada com sucesso!`, flags: 64 }).then(async () => {
        interaction.guild.channels.cache.get(await db.get(`canal_log_indicaçao_${interaction.guild.id}`)).send({ embeds: [embed], components: [botao] }).then(async (msg) => {
          await db.set(`indicadorId_${msg.id}`, interaction.user.id)
          await db.set(`p1_${msg.id}`, resposta01)
          await db.set(`p2_${msg.id}`, resposta02)
          await db.set(`p3_${msg.id}`, resposta03)
          await db.set(`p4_${msg.id}`, resposta04)
          await db.set(`p5_${msg.id}`, resposta05)
        })
      })
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "aprovarIndicação") {
      const userId = await db.get(`indicadorId_${interaction.message.id}`)
      const p1 = await db.get(`p1_${interaction.message.id}`)
      const p2 = await db.get(`p2_${interaction.message.id}`)
      const p3 = await db.get(`p3_${interaction.message.id}`)
      const p4 = await db.get(`p4_${interaction.message.id}`)
      const p5 = await db.get(`p5_${interaction.message.id}`)

      let embed = new Discord.EmbedBuilder()
        .setColor(cor.verde)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.guild.members.cache.get(userId).user.displayAvatarURL({ dynamic: true }))
        .setDescription(`O usuário <@${userId}> enviou a indicação abaixo:`)
        .addFields(
          {
            name: `Nome completo no RP:`,
            value: `\`\`\`${p1}\`\`\``,
            inline: false
          },
          {
            name: `Há quanto tempo vocês se conhecem:`,
            value: `\`\`\`${p2}\`\`\``,
            inline: false
          },
          {
            name: `O indicado já trabalhou com o que:`,
            value: `\`\`\`${p3}\`\`\``,
            inline: false
          },
          {
            name: `O que o indicado é seu:`,
            value: `\`\`\`${p4}\`\`\``,
            inline: false
          },
          {
            name: `Por que devemos aceitar o indicado:`,
            value: `\`\`\`${p5}\`\`\``,
            inline: false
          },
          {
            name: `Quem indicou:`,
            value: `<@${userId}>`,
            inline: false
          },
          {
            name: `Aprovado por:`,
            value: `${interaction.user}`,
            inline: false
          }
        );

      interaction.message.edit({ embeds: [embed], components: [] })
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "reprovarIndicação") {
      const userId = await db.get(`indicadorId_${interaction.message.id}`)
      const p1 = await db.get(`p1_${interaction.message.id}`)
      const p2 = await db.get(`p2_${interaction.message.id}`)
      const p3 = await db.get(`p3_${interaction.message.id}`)
      const p4 = await db.get(`p4_${interaction.message.id}`)
      const p5 = await db.get(`p5_${interaction.message.id}`)

      let embed = new Discord.EmbedBuilder()
        .setColor(cor.vermelho)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.guild.members.cache.get(userId).user.displayAvatarURL({ dynamic: true }))
        .setDescription(`O usuário <@${userId}> enviou a indicação abaixo:`)
        .addFields(
          {
            name: `Nome completo no RP:`,
            value: `\`\`\`${p1}\`\`\``,
            inline: false
          },
          {
            name: `Há quanto tempo vocês se conhecem:`,
            value: `\`\`\`${p2}\`\`\``,
            inline: false
          },
          {
            name: `O indicado já trabalhou com o que:`,
            value: `\`\`\`${p3}\`\`\``,
            inline: false
          },
          {
            name: `O que o indicado é seu:`,
            value: `\`\`\`${p4}\`\`\``,
            inline: false
          },
          {
            name: `Por que devemos aceitar o indicado:`,
            value: `\`\`\`${p5}\`\`\``,
            inline: false
          },
          {
            name: `Quem indicou:`,
            value: `<@${userId}>`,
            inline: false
          },
          {
            name: `Reprovado por:`,
            value: `${interaction.user}`,
            inline: false
          }
        );

      interaction.message.edit({ embeds: [embed], components: [] })
    }
  }
})