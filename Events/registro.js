require('../index')

const Discord = require('discord.js')
const client = require('../index')
const cor = require('..//cor.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {

    const canalLogs = await db.get(`canalLogs_${interaction.guild.id}`)
    const categoriaFarm = await db.get(`categoriaFarm_${interaction.guild.id}`)
    const cargoInicial = await db.get(`cargoInicial_${interaction.guild.id}`)
    const cargoResp = await db.get(`cargoResp_${interaction.guild.id}`)

    if (interaction.isButton()) {
        if (interaction.customId === 'registro') {
            if (interaction.user.id === interaction.guild.ownerId) {
                return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${interaction.user} Desculpe, eu não tenho permissão para fazer alterações no(a) dono(a) do servidor!`).setColor(cor.vermelho)], flags: 64 })
            }
            if (interaction.member.roles.cache.has(cargoInicial)) {
                return interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${interaction.user} Você já foi aprovado!`).setColor(cor.vermelho)], flags: 64 })
            } else {
                const registroModal = new Discord.ModalBuilder()
                    .setCustomId('registroModal')
                    .setTitle('Registro')

                const pergunta1 = new Discord.TextInputBuilder()
                    .setCustomId("pergunta1")
                    .setLabel("Qual o seu nome completo RP?")
                    .setMaxLength(30)
                    .setMinLength(5)
                    .setPlaceholder("Informe seu nome aqui!")
                    .setRequired(true)
                    .setStyle(Discord.TextInputStyle.Short)

                const pergunta2 = new Discord.TextInputBuilder()
                    .setCustomId("pergunta2")
                    .setLabel("Qual o seu ID?")
                    .setPlaceholder("Informe seu ID aqui!")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(true)

                const pergunta3 = new Discord.TextInputBuilder()
                    .setCustomId("pergunta3")
                    .setLabel("Qual o seu telefone?")
                    .setMaxLength(10)
                    .setPlaceholder("Informe seu número aqui!")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setRequired(true)

                const pergunta4 = new Discord.TextInputBuilder()
                .setCustomId("pergunta4")
                .setLabel("Quem te recrutou?")
                .setMaxLength(30)
                .setPlaceholder("Informe quem te recrutou aqui!")
                .setStyle(Discord.TextInputStyle.Short)
                .setRequired(true)

                registroModal.addComponents(
                    new Discord.ActionRowBuilder().addComponents(pergunta1),
                    new Discord.ActionRowBuilder().addComponents(pergunta2),
                    new Discord.ActionRowBuilder().addComponents(pergunta3),
                    new Discord.ActionRowBuilder().addComponents(pergunta4)
                )

                await interaction.showModal(registroModal)
            }
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'registroModal') {

            const r1 = interaction.fields.getTextInputValue('pergunta1')
            const r2 = interaction.fields.getTextInputValue('pergunta2')
            const r3 = interaction.fields.getTextInputValue('pergunta3')
            const r4 = interaction.fields.getTextInputValue('pergunta4')

            await db.set(`r1_${interaction.user.id}`, r1)
            await db.set(`r2_${interaction.user.id}`, r2)
            await db.set(`r3_${interaction.user.id}`, r3)
            await db.set(`r4_${interaction.user.id}`, r4)

            const respostas = new Discord.EmbedBuilder()
                .setDescription(`**Respostas do(a) membro(a)** ${interaction.user}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: `Qual o seu nome:`,
                        value: `\`\`\`${r1}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Qual o seu ID:`,
                        value: `\`\`\`${r2}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Qual o seu telefone:`,
                        value: `\`\`\`${r3}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Quem te recrutou:`,
                        value: `\`\`\`${r4}\`\`\``,
                        inline: false
                    }
                )
                .setColor(cor.amarelo)

            let analise = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('aprovar')
                    .setEmoji('✔️')
                    .setLabel('Aprovar')
                    .setStyle(Discord.ButtonStyle.Success),
                new Discord.ButtonBuilder()
                    .setCustomId('reprovar')
                    .setEmoji('✖️')
                    .setLabel('Reprovar')
                    .setStyle(Discord.ButtonStyle.Danger)
            )

            interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`✅ | ${interaction.user} O seu registro foi enviado com sucesso!`).setColor(cor.verde)], flags: 64 }).then(async () => {
                interaction.guild.channels.cache.find(c => c.id === canalLogs).send({ embeds: [respostas], components: [analise] }).then(async (msg) => {
                    await db.set(`msgid_${msg.id}`, interaction.user.id)
                })
            })
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'aprovar') {

            const role = interaction.guild.roles.cache.get(cargoResp)
            const userId = await db.get(`msgid_${interaction.message.id}`)
            const r1 = await db.get(`r1_${userId}`)
            const r2 = await db.get(`r2_${userId}`)
            const r3 = await db.get(`r3_${userId}`)
            const r4 = await db.get(`r4_${userId}`)
            const thumbnail = interaction.guild.members.cache.find(m => m.id === userId)

            const respostaAprovada = new Discord.EmbedBuilder()
                .setDescription(`**Respostas do(a) membro(a)** <@${userId}>`)
                .setThumbnail(thumbnail.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: `Qual o seu nome:`,
                        value: `\`\`\`${r1}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Qual o seu ID:`,
                        value: `\`\`\`${r2}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Qual o seu telefone:`,
                        value: `\`\`\`${r3}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Quem te recrutou:`,
                        value: `\`\`\`${r4}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Aprovado por:`,
                        value: `${interaction.user}`,
                        inline: false
                    }
                )
                .setColor(cor.verde)

            interaction.guild.members.cache.find(m => m.id === userId).setNickname(`${r1}┃${r2}`).then(async () => {
                interaction.guild.members.cache.find(m => m.id === userId).roles.add(cargoInicial).then(async () => {

                    interaction.guild.channels.create({
                        name: interaction.guild.members.cache.find(m => m.id === userId).nickname,
                        type: Discord.ChannelType.GuildText,
                        parent: categoriaFarm,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [
                                    Discord.PermissionFlagsBits.ViewChannel
                                ]
                            },
                            {
                                id: userId,
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
                    }).then(async (ch) => {
                        ch.send({ content: `<@${userId}>`, embeds: [new Discord.EmbedBuilder().setDescription(`✅ | <@${userId}> Envie neste canal as fotos da sua meta semanal`).setColor(cor.verde)] })
                        interaction.message.edit({ embeds: [respostaAprovada], components: [] })
                    })
                })
            })
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'reprovar') {

            const userId = await db.get(`msgid_${interaction.message.id}`)
            const r1 = await db.get(`r1_${userId}`)
            const r2 = await db.get(`r2_${userId}`)
            const r3 = await db.get(`r3_${userId}`)
            const r4 = await db.get(`r4_${userId}`)
            const thumbnail = interaction.guild.members.cache.find(m => m.id === userId)

            const respostaReprovada = new Discord.EmbedBuilder()
                .setDescription(`**Respostas do(a) membro(a)** <@${userId}>`)
                .setThumbnail(thumbnail.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: `Qual o seu nome:`,
                        value: `\`\`\`${r1}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Qual o seu ID:`,
                        value: `\`\`\`${r2}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Qual o seu telefone:`,
                        value: `\`\`\`${r3}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Quem te recrutou:`,
                        value: `\`\`\`${r4}\`\`\``,
                        inline: false
                    },
                    {
                        name: `Reprovado por:`,
                        value: `${interaction.user}`,
                        inline: false
                    }
                )
                .setColor(cor.vermelho)

            interaction.reply({
                content: `${interaction.user}`,
                embeds: [new Discord.EmbedBuilder().setDescription(`❌ | ${interaction.user} O registro do usuario <@${userId}> foi reprovado, peça para o membro refazer o pedido de set!`).setColor(cor.vermelho)],
                flags: 64
            }).then(async () => {
                interaction.message.edit({ embeds: [respostaReprovada], components: [] })
            })
        }
    }
})