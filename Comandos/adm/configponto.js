const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("..//..//cor.json")
const db = new QuickDB()

module.exports = {
    name: "configponto", // Coloque o nome do comando
    description: "Configure um canal para os membros criarem o ponto", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "chatponto",
            description: "Canal em que o painel sera enviado",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "categoriaponto",
            description: "Categoria em que o canal de ponto será criado",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "cargo_responsavel_ponto",
            description: "Cargo que poderá ver os canais dos tickets.",
            type: Discord.ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `${interaction.user} Apenas membros com permissão de administrador podem configurar o sistema de ponto.`, flags: 64 })
        } else {
            const chatponto = interaction.options.getChannel('chatponto')
            const categoriaponto = interaction.options.getChannel('categoriaponto')
            const respPonto = interaction.options.getRole('cargo_responsavel_ponto')
            if (chatponto.type !== Discord.ChannelType.GuildText) {
                interaction.reply({ content: `${interaction.user} Mencione um canal de texto`, flags: 64 })
            } else if (categoriaponto.type !== Discord.ChannelType.GuildCategory) {
                interaction.reply({ content: `${interaction.user} Mencione uma categoria para criar os canais de ponto`, flags: 64 })
            } else {
                await db.set(`categoriaPontoId_${interaction.guild.id}`, categoriaponto.id)
                await db.set(`respPonto_${interaction.guild.id}`, respPonto.id)
                const embedPonto = new Discord.EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setTitle(`<a:preto_reloFS:872992752370085898> | Bater Ponto`)
                    .setDescription(`Clique no 🕧 para criar seu canal de bater ponto`)
                    .setColor(cor.amarelo)

                let criarPonto = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("criarPonto")
                        .setEmoji("🕧")
                        .setLabel("Criar Ponto!")
                        .setStyle(Discord.ButtonStyle.Primary)
                )

                chatponto.send({ embeds: [embedPonto], components: [criarPonto] }).then(() => {
                    interaction.reply({ content: `${interaction.user} Sistema de ponto configurado`, flags: 64 })
                })
            }
        }
    }
}