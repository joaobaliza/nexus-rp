const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("../../cor.json")
const db = new QuickDB()

module.exports = {
    name: "info", // Coloque o nome do comando
    description: "informações de um usuario", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "mencione um usuario",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const user = interaction.options.getUser('user')

        const userType = {
            true: 'Bot',
            false: 'Humano'
        }

        const guildUser = interaction.guild.members.cache.get(user.id)
        const status = guildUser.presence ? guildUser.presence.status : 'offline'
        const statusMapp = {
            online: 'Online',
            idle: 'Ausente',
            dnd: 'Não pertube',
            offline: 'Offline'
        }

        const activiti = guildUser.presence?.activities?.length > 0
            ? guildUser.presence.activities
            : 'Nenhuma atividade';

        const boostingSince = guildUser.premiumSince ? guildUser.premiumSince.toLocaleDateString() : 'Não é impulsionador';
        const badges = user.flags?.toArray().map(flag => flag.replace(/_/g, ' ').toLowerCase()).join(', ') || 'Sem emblemas';
        const clientStatus = guildUser.presence?.clientStatus || {};

        let statusDevices = 'Desconhecido';
        if (clientStatus.desktop) statusDevices = 'Computador';
        if (clientStatus.mobile) statusDevices = statusDevices === 'Desconhecido' ? 'Mobile' : `${statusDevices}, Celular`;
        if (clientStatus.web) statusDevices = statusDevices === 'Desconhecido' ? 'Web' : `${statusDevices}, Web`;

        const embedUser = new Discord.EmbedBuilder()
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(`👤 **Informações de:** ${user}`)
            .addFields(
                {
                    name: `✏️ | Nome de usuario:`,
                    value: `\`\`\`${user.username}\`\`\``,
                    inline: true
                },
                {
                    name: `🆔 | ID do usuario:`,
                    value: `\`\`\`${user.id}\`\`\``,
                    inline: true
                },
                {
                    name: `📅 | Membro do servidor desde:`,
                    value: `\`\`\`${guildUser.joinedAt.toLocaleDateString()}\`\`\``,
                    inline: false
                },
                {
                    name: `📅 | Conta criada em:`,
                    value: `\`\`\`${user.createdAt.toLocaleDateString()}\`\`\``
                },
                {
                    name: `🟢 | Status do usuario:`,
                    value: `\`\`\`${statusMapp[status]}\`\`\``,
                    inline: false
                },
                {
                    name: `🎮 | Atividade atual:`,
                    value: `\`\`\`${activiti}\`\`\``,
                    inline: false
                },
                {
                    name: `🤖 | O usuario é um:`,
                    value: `\`\`\`${userType[user.bot]}\`\`\``,
                    inline: false
                },
                {
                    name: `🚀 | Impulsionando o servidor desde:`,
                    value: `\`\`\`${boostingSince}\`\`\``,
                    inline: false
                },
                {
                    name: `⭐ | emblemas do usuario:`,
                    value: `\`\`\`${badges}\`\`\``,
                    inline: false
                },
                {
                    name: `💻 | Online por:`,
                    value: `\`\`\`${statusDevices}\`\`\``,
                    inline: false
                },
                {
                    name: `💼 | Cargos do usuario:`,
                    value: `${guildUser.roles.cache.map(role => role).join(`\n`)}`
                },
                {
                    name: `📸 | Foto do perfil:`,
                    value: `[Baixe aqui](${user.displayAvatarURL({ dynamic: true })})`,
                    inline: false
                }
            )

        interaction.reply({ embeds: [embedUser] })
    }
}