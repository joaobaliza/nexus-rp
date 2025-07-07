const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("..//..//cor.json")
const db = new QuickDB()

module.exports = {
    name: "ticketparceiro", // Coloque o nome do comando
    description: "Configura o sistema de ticket para parceiros", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canalticket",
            description: "Canal para o painel ser enviado",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "categoriaticket",
            description: "Categoria para criar o ticket",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "cargo_responsavel_ticket",
            description: "Cargo que poderá ver os canais dos tickets.",
            type: Discord.ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `${interaction.user} Apenas membros com permissão de administrador podem uitlizar este comando`, flags: 64 })
        } else {
            const canalTicket = interaction.options.getChannel('canalticket')
            const categoriaTicket = interaction.options.getChannel('categoriaticket')
            const respTicketP = interaction.options.getRole('cargo_responsavel_ticket')

            if (canalTicket.type !== Discord.ChannelType.GuildText) {
                interaction.reply({ content: `${interaction.user} Mencione uma canal de texto para enviar o painel!`, flags: 64 })
            } else if (categoriaTicket.type !== Discord.ChannelType.GuildCategory) {
                interaction.reply({ content: `${interaction.user} Mencione uma categoria onde os tickets serão criados!`, flags: 64 })
            } else {
                await db.set(`categoriaTicket_${interaction.guild.id}`, categoriaTicket.id)
                await db.set(`respTicketP_${interaction.guild.id}`, respTicketP.id)

                interaction.reply({ content: `${interaction.user} O sistema de ticket para parceiros foi configurado`, flags: 64 }).then(() => {
                    const ticketParceiro = new Discord.EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setTitle(`🎟️ | Ticket para parceiros`)
                        .setDescription(`Clique em 🎟️ Para criar um ticket parceiro e falar com um de nossos responsáveis.`)
                        .setColor(cor.verde)

                    let botaoParceiro = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('botaoParceiro')
                            .setEmoji('🎟️')
                            .setLabel('Abrir Ticket')
                            .setStyle(Discord.ButtonStyle.Success)
                    )

                    canalTicket.send({ embeds: [ticketParceiro], components: [botaoParceiro] })
                })
            }
        }
    }
}