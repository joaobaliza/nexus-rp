require('../index')

const Discord = require('discord.js')
const client = require('../index')
const cor = require('../cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'botaoParceiro') {
            const categoriaTicket = await db.get(`categoriaTicket_${interaction.guild.id}`)
            const respTicketP = await db.get(`respTicketP_${interaction.guild.id}`)
            let cname = `parceiro-${interaction.user.globalName}`
            const role = interaction.guild.roles.cache.get(respTicketP)

            if (interaction.guild.channels.cache.find(c => c.name === cname)) {
                interaction.reply({ content: `${interaction.user} Você ja possui um ticket parceiro aberto. ${interaction.guild.channels.cache.find(c => c.name === cname)}`, flags: 64 })
            } else {
                interaction.guild.channels.create({
                    name: cname,
                    type: Discord.ChannelType.GuildText,
                    parent: categoriaTicket,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [
                                Discord.PermissionFlagsBits.ViewChannel
                            ]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks,
                                Discord.PermissionFlagsBits.AddReactions,
                                Discord.PermissionFlagsBits.ReadMessageHistory
                            ]
                        },
                        {
                            id: role.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks,
                                Discord.PermissionFlagsBits.AddReactions,
                                Discord.PermissionFlagsBits.ReadMessageHistory
                            ]
                        }
                    ]
                }).then((ch) => {
                    interaction.reply({ content: `${interaction.user} O seu ticket parceiro foi criado. ${ch}`, flags: 64 })

                    const ticketAberto = new Discord.EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setTitle(`🎟️ | Ticket Parceiro`)
                        .setDescription(`**Olá ${interaction.user}, o seu ticket foi aberto!**
                        
                    ▸ Os responsáveis já foram notificados e logo irão te atender
                    ▸ Para agilizar o seu atendimento, escreva o motivo do seu suporte!`)
                        .setColor(cor.vermelho)

                    let fecharParceiro = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('fecharParceiro')
                            .setEmoji('🔒')
                            .setLabel('Fechar Ticket')
                            .setStyle(Discord.ButtonStyle.Danger)
                    )

                    ch.send({ content: `||${interaction.user}||`, embeds: [ticketAberto], components: [fecharParceiro] })
                })
            }
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'fecharParceiro') {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
                interaction.reply({ content: `${interaction.user} Apenas membros com permissão de gerenciar canais podem fechar o ticket!`, flags: 64 })
            } else {
                interaction.reply({ content: `${interaction.user} este ticket será excluido em alguns segundos...` }).then(() => {
                    setTimeout(() => {
                        interaction.channel.delete()
                    }, 5000)
                })
            }
        }
    }
})