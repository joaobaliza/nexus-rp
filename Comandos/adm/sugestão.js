const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("../../cor.json")
const db = new QuickDB()

module.exports = {
  name: "sugestão", // Coloque o nome do comando
  description: "Abra o painel de sugestão para os membros.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_sugestão",
        description: "Canal para enviar o painel de sugestões para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_log",
        description: "Canal para enviar as logs das sugestões recebidas.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, flags: 64 })
    } else {
        const canal_sugestao = interaction.options.getChannel("canal_sugestão")
        const canal_log = interaction.options.getChannel("canal_log")

        if (canal_sugestao.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_sugestao} não é um canal de texto.`, flags: 64 })
        } else if (canal_log.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_log} não é um canal de texto.`, flags: 64 })
        } else {
            await db.set(`canal_sugestao_${interaction.guild.id}`, canal_sugestao.id)
            await db.set(`canal_log_${interaction.guild.id}`, canal_log.id)

            let embed = new Discord.EmbedBuilder()
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal de Sugestão: ${canal_sugestao}.\n> Canal de Logs: ${canal_log}.`)
            .setColor(cor.verde)

            interaction.reply({ embeds: [embed], flags: 64 }).then( () => {
                let embed_sugestao = new Discord.EmbedBuilder()
                .setColor(cor.amarelo)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Faça sua sugestão:`)
                .setDescription(`Faça uma sugestão clicando no botão abaixo!`);

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("sugestao")
                    .setEmoji("📝")
                    .setLabel("Sugerir!")
                    .setStyle(Discord.ButtonStyle.Primary)
                    
                );

                canal_sugestao.send({ embeds: [embed_sugestao], components: [botao] })
                
            })
        } 
    }
  }
}