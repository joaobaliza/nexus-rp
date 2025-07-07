const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "radvertência", // Coloque o nome do comando
  description: "Remove uma advertência do membro mencionado.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "membro",
      description: "Mencione um membro para remover uma advertêcia!",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Informe o motivo de remoção da advertência!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
      interaction.reply({ content: `${autor} Você não pode banir membros deste servidor!`, flags: 64 })
    }

    const role1 = interaction.guild.roles.cache.find(role => role.name === 'Advertência 1')
    const role2 = interaction.guild.roles.cache.find(role => role.name === 'Advertência 2')

    const user = interaction.options.getUser('membro')
    const membro = interaction.guild.members.cache.get(user.id)
    let motivo = interaction.options.getString('motivo')
    const autor = interaction.user

    const radv1 = new Discord.EmbedBuilder()
      .setTitle("🚨 | Advertência removida")
      .setThumbnail(membro.user.displayAvatarURL({ dynimc: true }))
      .addFields(
        {
          name: '<a:julgado:862141549708836864> | Membro:',
          value: `> ${membro}`,
          inline: true
        },
        {
          name: '<:iddd:861850187361419264> | Advertência removida por:',
          value: `> ${autor}`,
          inline: true
        },
        {
          name: '<a:julgado:862141549708836864> | Advertências restantes:',
          value: `> **0**/3`,
          inline: true
        }, {
        name: '✍ | Motivo:',
        value: `\`\`\`${motivo}\`\`\``,
        inline: false
      }
      )
      .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
      .setTimestamp(new Date())
      .setColor("#FF0000")

    const radv2 = new Discord.EmbedBuilder()
      .setTitle("🚨 | Advertência removida")
      .setThumbnail(membro.user.displayAvatarURL({ dynimc: true }))
      .addFields(
        {
          name: '<a:julgado:862141549708836864> | Membro:',
          value: `> ${membro}`,
          inline: true
        },
        {
          name: '<:iddd:861850187361419264> | Advertência removida por:',
          value: `> ${autor}`,
          inline: true
        },
        {
          name: '<a:julgado:862141549708836864> | Advertências restantes:',
          value: `> **1**/3`,
          inline: true
        }, {
        name: '✍ | Motivo:',
        value: `\`\`\`${motivo}\`\`\``,
        inline: false
      }
      )
      .setFooter({ text: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
      .setTimestamp(new Date())
      .setColor("#FF0000")

    if (membro.roles.cache.has(role2.id)) return ([
      membro.roles.remove(role2),
      interaction.channel.send({ embeds: [radv2] }),
      membro.send({ embeds: [radv2] }),
      interaction.reply({ content: `${autor} Você removeu uma advertência de: ${membro}`, flags: 64 })
    ])

    if (membro.roles.cache.has(role1.id)) return ([
      membro.roles.remove(role1),
      interaction.channel.send({ embeds: [radv1] }),
      membro.send({ embeds: [radv1] }),
      interaction.reply({ content: `${autor} Você removeu uma advertência de: ${membro}`, flags: 64 })
    ])

    if (!membro.roles.cache.has(role1.id)) return ([
      interaction.reply({ content: `Este usuario não possui advertências para serem removidas!`, flags: 64 })
    ])
  }
}