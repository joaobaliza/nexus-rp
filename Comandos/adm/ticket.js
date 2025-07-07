const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const cor = require("../../cor.json")
const db = new QuickDB();

module.exports = {
    name: "ticket", //nome do comando
    description: "Abre o painel de ticket para os membros do servidor", // descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal_ticket",
            description: "Canal para enviar o painel de Ticket.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "categoria_ticket",
            description: "Categoria em que o ticket será aberto.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "log_ticket",
            description: "Canal para enviar a log dos tickets",
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
            interaction.reply({ content: `Apenas membros com permissão administrador podem utilizar este comando!`, flags: 64 })
        } else {

            const canal_ticket = interaction.options.getChannel("canal_ticket")
            const categoria_ticket = interaction.options.getChannel("categoria_ticket")
            const log_ticket = interaction.options.getChannel("log_ticket")
            const respTicket = interaction.options.getRole('cargo_responsavel_ticket')

            if (canal_ticket.type !== Discord.ChannelType.GuildText) {
                interaction.reply({ content: `O canal de ticket mencionado deve ser um canal de texto!`, flags: 64 })
            }

            if (categoria_ticket.type !== Discord.ChannelType.GuildCategory) {
                interaction.reply({ content: `Mencione uma categoria para o ticket ser aberto!`, flags: 64 })
            } else if (log_ticket.type !== Discord.ChannelType.GuildText) {
                interaction.reply({ content: `O canala de logs mencionado deve ser um canal de texto!`, flags: 64 })
            } else {

                await db.set(`canal_ticket_${interaction.guild.id}`, canal_ticket.id)
                await db.set(`categoria_ticket_${interaction.guild.id}`, categoria_ticket.id)
                await db.set(`log_ticket_${interaction.guild.id}`, log_ticket.id)
                await db.set(`respTicket_${interaction.guild.id}`, respTicket.id)

                const configurado = new Discord.EmbedBuilder()
                    .setDescription("O sistema de ticket foi configurado com sucesso!")
                    .setColor("Green")

                interaction.reply({ embeds: [configurado], flags: 64 }).then(() => {

                    let ticket = new Discord.EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setTitle(`Suporte ${interaction.guild.name}`)
                        .setDescription(`📢 | Informações:
                    Olá, se você esta lendo isso aqui, provavelmente está precisando de suporte, clique no botão abaixo para entrar em contato com a gente`)
                        .setImage(interaction.guild.iconURL({ dynamic: true }))
                        .setColor(cor.verde)

                    let botao_ticket = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('abrir_ticket')
                            .setEmoji('🎫')
                            .setLabel('Abrir Ticket')
                            .setStyle(Discord.ButtonStyle.Success)
                    );

                    canal_ticket.send({ embeds: [ticket], components: [botao_ticket] })
                })
            }
        }
    }
};
