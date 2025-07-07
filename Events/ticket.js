require('../index')

const Discord = require('discord.js')
const client = require('../index')
const cor = require('../cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB
const discordTranscripts = require('discord-html-transcripts');
const moment = require('moment');
moment.locale('pt_BR');

client.on('interactionCreate', async (interaction) => {

    const categoria = interaction.guild.channels.cache.get(await db.get(`categoria_ticket_${interaction.guild.id}`))
    const log_ticket = interaction.guild.channels.cache.get(await db.get(`log_ticket_${interaction.guild.id}`))

    if (interaction.isButton()) {
        if (interaction.customId === 'abrir_ticket') {

            let nome = `ticket-${interaction.user.globalName}`
            const respTicket = await db.get(`respTicket_${interaction.guild.id}`)
            const role = interaction.guild.roles.cache.get(respTicket)

            if (interaction.guild.channels.cache.find(c => c.name === nome)) {
                interaction.reply({ content: `Você ja possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}`, flags: 64 })
            } else {
                interaction.guild.channels.create({
                    name: nome,
                    type: Discord.ChannelType.GuildText,
                    parent: categoria,
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

                    let tab = new Discord.EmbedBuilder()
                    .setDescription(`${interaction.user} O seu ticket foi aberto em ${ch}`)
                    .setColor(cor.verde)

                    interaction.reply({ embeds: [tab], flags: 64 })

                    let ticket_aberto = new Discord.EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                    .setTitle(`🎟️┃Ticket aberto`)
                    .setDescription(`**OLÁ ${interaction.user}, o seu ticket está aberto!**
                    
                    ▸ Os responsáveis já foram notificados e logo irão te atender
                    ▸ Para agilizar o seu atendimento, escreva o motivo do seu suporte!`)
                    .setColor(cor.vermelho)

                    let fechar = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('fechar_ticket')
                        .setEmoji('🔒')
                        .setStyle(Discord.ButtonStyle.Danger)
                    );

                    let log = new Discord.EmbedBuilder()
                    .setTitle(`✅┃Ticket Aberto`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setFields(
                        {
                            name: `🎫┃Ticket:`,
                            value: `> \`\`${ch.name}\`\``,
                            inline: true
                        },
                        {
                            name: `👤┃Aberto Por:`,
                            value: `> ${interaction.user}`,
                            inline: true
                        },
                        {
                            name: `📅┃Aberto Dia:`,
                            value: `> ${moment(new Date()).format('DD/MM')} ás ${moment(new Date()).format('HH:mm')}`,
                            inline: true
                        }
                    )
                    .setColor(cor.verde)

                    log_ticket.send({ embeds: [log] })
                    ch.send({ content: `||${interaction.user}||`, embeds: [ticket_aberto], components: [fechar] })
                })
            }
        }

        if (interaction.isButton()) {
            
            let log_fechado = new Discord.EmbedBuilder()
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(`❌┃Ticket Encerrado`)
            .setFields(
                {
                    name: `🎫 | Ticket:`,
                    value: `> \`\`${interaction.channel.name}\`\``,
                    inline: true
                  },
                  {
                    name: `👤 | Fechado por:`,
                    value: `> ${interaction.user}`,
                    inline: true
                  },
                  {
                    name: `📆 | Fechado dia:`,
                    value: `> ${moment(new Date()).format('DD/MM')} ás ${moment(new Date()).format('HH:mm')}`,
                    inline: true
                  }
            )
            .setColor(cor.vermelho)

            if (interaction.customId === 'fechar_ticket') {

                let channel = interaction.channel
                let attachment = await discordTranscripts.createTranscript(channel)

                if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                    interaction.reply({ content: `❌┃Apenas membros com permissão de administrador podem encerrar um ticket!`, flags: 64 })
                    return;
                }

                interaction.reply(`${interaction.user} este ticket será excluido em alguns segundos...`).then(() => {
                    setTimeout(() => {
                        try {
                            log_ticket.send({ embeds: [log_fechado], files: [attachment] })
                            interaction.channel.delete()
                        } catch (e) {
                            return;
                        }
                    }, 5000)
                })
            }


        }
    }
})