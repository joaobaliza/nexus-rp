const Discord = require("discord.js")
const cor = require('../../cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "encomenda", // Coloque o nome do comando
  description: "Abra o painel de encomendas para os membros.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_encomenda",
        description: "Canal para enviar o painel de encomendas para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_log_encomenda",
        description: "Canal para enviar as logs das encomendas recebidas.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, flags: 64 })
    } else {
        const canal_encomenda = interaction.options.getChannel("canal_encomenda")
        const canal_log_encomenda = interaction.options.getChannel("canal_log_encomenda")

        if (canal_encomenda.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_encomenda} não é um canal de texto.`, flags: 64 })
        } else if (canal_log_encomenda.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_log_encomenda} não é um canal de texto.`, flags: 64 })
        } else {
            await db.set(`canal_encomenda_${interaction.guild.id}`, canal_encomenda.id)
            await db.set(`canal_log_encomenda_${interaction.guild.id}`, canal_log_encomenda.id)

            let embed = new Discord.EmbedBuilder()
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal de Encomendas: ${canal_encomenda}.\n> Canal de Logs: ${canal_log_encomenda}.`)
            .setColor(cor.verde)

            interaction.reply({ embeds: [embed], flags: 64 }).then( () => {
                let embed_encomenda = new Discord.EmbedBuilder()
                .setColor(cor.amarelo)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Encomendas`)
                .setDescription(`Registre uma encomenda clicando no botão abaixo!`);

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("encomenda")
                    .setEmoji("📦")
                    .setLabel("Encomendar!")
                    .setStyle(Discord.ButtonStyle.Primary)
                    
                );

                canal_encomenda.send({ embeds: [embed_encomenda], components: [botao] })
                
            })
        } 
    }
  }
}