const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("..//..//cor.json")
const db = new QuickDB()

module.exports = {
    name: "ban", // Coloque o nome do comando
    description: "bani um membro do servidor", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Mencione o membro que deseja banir",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Qual o motivo para banir este membro",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        const user = interaction.user
        const membro1 = interaction.options.getUser('membro')
        const membro = interaction.guild.members.cache.get(membro1.id)
        const motivo = interaction.options.getString('motivo')

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            interaction.reply({ content: `${user} Apenas pessoas com permissão de banir membros podem utilizar este comando!`, flags: 64 })
        } else {
                const embedBan = new Discord.EmbedBuilder()
                .setTitle("🚨 | Membro banido")
                .setThumbnail(membro.user.displayAvatarURL({ dynimc: true }))
                .setDescription(`${membro} Foi banido deste servidor!`)
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
                        name: '✍ | Motivo:',
                        value: `\`\`\`${motivo}\`\`\``,
                        inline: false
                    }
                )
                .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp(new Date())
                .setColor("#FF0000")


            interaction.reply({ content: `${user} Você baniu ${membro} deste servidor!`, flags: 64 }).then(() => {
                interaction.channel.send({ embeds: [embedBan] }).then(() => {
                    membro.send({ content: `Você foi banido de ${interaction.guild.name}`, embeds: [embedBan] }).then(() => {
                        membro.ban()
                    })
                })
            })
        }
    }
}