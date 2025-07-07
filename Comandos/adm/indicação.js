const Discord = require("discord.js")
const cor = require('../../cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "indicação", // Coloque o nome do comando
  description: "Abra o painel de indicação para os membros.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_indicaçao",
        description: "Canal para enviar o painel de indicação para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_log_indicaçao",
        description: "Canal para enviar as logs das indicações recebidas.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, flags: 64 })
    } else {
        const canal_indicaçao = interaction.options.getChannel("canal_indicaçao")
        const canal_log_indicaçao = interaction.options.getChannel("canal_log_indicaçao")

        if (canal_indicaçao.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_indicaçao} não é um canal de texto.`, flags: 64 })
        } else if (canal_log_indicaçao.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_log_indicaçao} não é um canal de texto.`, flags: 64 })
        } else {
            await db.set(`canal_indicaçao_${interaction.guild.id}`, canal_indicaçao.id)
            await db.set(`canal_log_indicaçao_${interaction.guild.id}`, canal_log_indicaçao.id)

            let embed = new Discord.EmbedBuilder()
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal de Indicação: ${canal_indicaçao}.\n> Canal de Logs: ${canal_log_indicaçao}.`)
            .setColor(cor.verde)

            interaction.reply({ embeds: [embed], flags: 64 }).then( () => {
                let embed_indicaçao = new Discord.EmbedBuilder()
                .setColor(cor.amarelo)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Indique um amigo(a):`)
                .setDescription(`Faça uma indicação clicando no botão abaixo!`);

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("indicaçao")
                    .setEmoji("💞")
                    .setLabel("Indicar!")
                    .setStyle(Discord.ButtonStyle.Primary)
                    
                );

                canal_indicaçao.send({ embeds: [embed_indicaçao], components: [botao] })
                
            })
        } 
    }
  }
}