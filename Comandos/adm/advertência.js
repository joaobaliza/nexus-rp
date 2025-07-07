const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("..//..//cor.json")
const db = new QuickDB()

module.exports = {
    name: "advertencia", // Coloque o nome do comando
    description: "Aplica uma advertência em um membro do servidor.", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Mencione um mebro para ser advêrtido.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Informe o motivo da avertêcia.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const role1 = interaction.guild.roles.cache.find(role => role.name === 'Advertência 1')
        const role2 = interaction.guild.roles.cache.find(role => role.name === 'Advertência 2')
        const roleban = interaction.guild.roles.cache.find(role => role.name === 'Banido')
        const logadvertencia = interaction.guild.channels.cache.get(await db.get(`logadvertencia_${interaction.guild.id}`))
        const useradv = interaction.options.getUser('membro')
        const membro = interaction.guild.members.cache.get(useradv.id)
        const motivo = interaction.options.getString('motivo')
        const user = interaction.user

        const adv1 = new Discord.EmbedBuilder()
            .setTitle("🚨 | Advertência")
            .setAuthor({ name: `Sistema de advertência - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(membro.user.displayAvatarURL({ dynimc: true }))
            .addFields(
                {
                    name: '<a:julgado:862141549708836864> | Membro:',
                    value: `> ${membro}`,
                    inline: true
                },
                {
                    name: '<:iddd:861850187361419264> | Advêrtido por:',
                    value: `> ${user}`,
                    inline: true
                },
                {
                    name: '<a:julgado:862141549708836864> | Advertência:',
                    value: `> **1**/3`,
                    inline: true
                },
                {
                    name: '✍ | Motivo:',
                    value: `\`\`\`${motivo}\`\`\``,
                    inline: false
                }
            )
            .setFooter({ text: `Todos os direitos reservados a ${interaction.guild.name}©`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor(cor.vermelho)

        const adv2 = new Discord.EmbedBuilder()
            .setTitle("🚨 | Advertência")
            .setAuthor({ name: `Sistema de advertência - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(membro.user.displayAvatarURL({ dynimc: true }))
            .addFields(
                {
                    name: '<a:julgado:862141549708836864> | Membro:',
                    value: `> ${membro}`,
                    inline: true
                },
                {
                    name: '<:iddd:861850187361419264> | Advêrtido por:',
                    value: `> ${user}`,
                    inline: true
                },
                {
                    name: '<a:julgado:862141549708836864> | Advertência:',
                    value: `> **2**/3`,
                    inline: true
                },
                {
                    name: '✍ | Motivo:',
                    value: `\`\`\`${motivo}\`\`\``,
                    inline: false
                }
            )
            .setFooter({ text: `Todos os direitos reservados a ${interaction.guild.name}©`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor(cor.vermelho)

        const adv3 = new Discord.EmbedBuilder()
            .setTitle("🚨 | Advertência")
            .setAuthor({ name: `Sistema de advertência - ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(membro.user.displayAvatarURL({ dynimc: true }))
            .addFields(
                {
                    name: '<a:julgado:862141549708836864> | Membro:',
                    value: `> ${membro}`,
                    inline: true
                },
                {
                    name: '<:iddd:861850187361419264> | Banido por:',
                    value: `> ${user}`,
                    inline: true
                },
                {
                    name: '<a:julgado:862141549708836864> | Advertência:',
                    value: `> **3**/3`,
                    inline: true
                },
                {
                    name: '✍ | Motivo:',
                    value: `\`\`\`${motivo}\`\`\``,
                    inline: false
                }
            )
            .setFooter({ text: `Todos os direitos reservados a ${interaction.guild.name}©`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setColor(cor.vermelho)

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: `${user} Apenas membros com permissão de banir usuarios podem utilizar este comando.`, flags: 64 })
        } else {
            if (!logadvertencia) {
                return interaction.reply({ content: `${user} O canal de logs não foi encontrado, configure o sistema de advertência utilizando **/configadv**`, flags: 64 })
            } else {
                if (!role1) {
                    return interaction.reply({ content: `${user} O cargo de **advertência 1** não foi encontrado, configure o sistema de advertência utilizando **/configadv**`, flags: 64 })
                } else {
                    if (!role2) {
                        return interaction.reply({ content: `${user} O cargo de **advertência 2** não foi encontrado, configure o sistema de advertência utilizando **/configadv**`, flags: 64 })
                    } else {
                        if (!roleban) {
                            return interaction.reply({ content: `${user} O cargo de **Banido** não foi encontrado, configure o sistema de advertência utilizando **/configadv**`, flags: 64 })
                        } else {

                            if (membro.roles.cache.has(role2.id)) {
                                membro.roles.set([]).then(async () => {
                                    membro.roles.add(roleban.id)
                                    try {
                                        await membro.send({ content: `${membro} Você foi banido de ${interaction.guild.name}`, embeds: [adv3] })
                                        await logadvertencia.send({ content: `${membro}`, embeds: [adv3] }).then(async () => {
                                            interaction.reply({ content: `${user} Você aplicou a **3°** advertência de ${membro}`, flags: 64 })
                                        })
                                    } catch (error) {
                                        await logadvertencia.send({ content: `${membro}`, embeds: [adv3] }).then(async () => {
                                            interaction.reply({ content: `${user} Você aplicou a **3°** advertência de ${membro}`, flags: 64 })
                                        })
                                    }
                                })
                            } else {
                                if (membro.roles.cache.has(role1.id)) {
                                    membro.roles.add(role2.id)
                                    try {
                                        await membro.send({ content: `${membro} Você recebeu **2**/3 advertências em: ${interaction.guild.name}! \nCaso receba **3**/3 advertências será banido do servidor!!`, embeds: [adv2] })
                                        await logadvertencia.send({ content: `${membro}`, embeds: [adv2] }).then(async () => {
                                            interaction.reply({ content: `${user} Você aplicou a **2°** advertência de ${membro}`, flags: 64 })
                                        })
                                    } catch (error) {
                                        await logadvertencia.send({ content: `${membro}`, embeds: [adv2] }).then(async () => {
                                            interaction.reply({ content: `${user} Você aplicou a **2°** advertência de ${membro}`, flags: 64 })
                                        })
                                    }
                                } else {
                                    if (!membro.roles.cache.has(role1.id)) {
                                        membro.roles.add(role1.id)
                                        try {
                                            await membro.send({ content: `${membro} Você recebeu **1**/3 advertências em: ${interaction.guild.name}`, embeds: [adv1] })
                                            await logadvertencia.send({ content: `${membro}`, embeds: [adv1] }).then(async () => {
                                                interaction.reply({ content: `${user} Você aplicou a **1°** advertência de ${membro}`, flags: 64 })
                                            })

                                        } catch (error) {
                                            await logadvertencia.send({ content: `${membro}`, embeds: [adv1] }).then(async () => {
                                                interaction.reply({ content: `${user} Você aplicou a **1°** advertência de ${membro}`, flags: 64 })
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}