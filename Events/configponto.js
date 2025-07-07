require('../index')

const Discord = require('discord.js')
const client = require('../index')
const cor = require('../cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {

    const categoria = interaction.guild.channels.cache.get(await db.get(`categoriaPontoId_${interaction.guild.id}`))

    if (interaction.isButton()) {
        if (interaction.customId === "criarPonto") {

            let cname = `🕧・${interaction.member.nickname}`
            const respPonto = await db.get(`respPonto_${interaction.guild.id}`)
            const role = interaction.guild.roles.cache.get(respPonto)

            if (interaction.guild.channels.cache.find(c => c.name === cname)) {
                interaction.reply({ content: `${interaction.user} Você ja possui um chat de ponto aberto. ${interaction.guild.channels.cache.find(c => c.name === cname)}`, flags: 64 })
            } else {
                interaction.guild.channels.create({
                    name: cname,
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
                    interaction.reply({ content: `${interaction.user} O seu chat ponto foi aberto. ${ch}`, flags: 64 })
                    ch.send({ content: `${interaction.user} Este canal será direcionado para bater seu ponto!` }).then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                        }, 30000)
                    })
                })
            }
        }
    }
})