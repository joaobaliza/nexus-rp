const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
    name: "configadv", // Coloque o nome do comando
    description: "Configura o sistema de advertência", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "logadvertencia",
            description: "Canal para enviar as logs de advertência",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const logadvertencia = interaction.options.getChannel('logadvertencia')
        const role1 = interaction.guild.roles.cache.find(role => role.name === 'Advertência 1')
        const role2 = interaction.guild.roles.cache.find(role => role.name === 'Advertência 2')
        const roleban = interaction.guild.roles.cache.find(role => role.name === 'Banido') 
        const user = interaction.user

        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)){
            return interaction.reply({content: `${user} Apenas membros com permissão de banir usuarios podem configurar o sistema de advertência do servidor.`, Flags: 64})
        } else {
            if (logadvertencia.type !== Discord.ChannelType.GuildText) {
                return interaction.reply({ content: `${user} Mencione um canal de texto para enviar as logs de advertência.`, flags: 64})
            } else {
                await db.set(`logadvertencia_${interaction.guild.id}`, logadvertencia.id)

                if (!role1) {
                    try {
                        interaction.channel.send({ content: `${user} Os cargos de advertência estão sendo criados neste servidor!`}).then(msg => {
                            setTimeout(() => {
                                msg.delete()
                            }, 3000)
                        })
        
                        let adv_role1 = await interaction.guild.roles.create({
        
        
                            name: 'Advertência 1',
                            color: '#FF0000'
        
                        })
                        interaction.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                            await channel.createOverwrite(adv_role1, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            })
                        });
                    } catch (error) {
                        console.log(error)
                    }
                };
        
                if (!role2) {
                    try {
                        let adv_role2 = await interaction.guild.roles.create({
        
        
                            name: 'Advertência 2',
                            color: '#FF0000'
        
                        })
                        interaction.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                            await channel.createOverwrite(adv_role2, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            })
                        });
                        interaction.channel.send({ content: `Os cargos de advertência foram criados neste servidor!`}).then(msg => {
                            setTimeout(() => {
                                msg.delete()
                            }, 3000)
                        }).then(() => {
                            interaction.channel.send({content: `${user} O sistema de advertência foi configurado no servidor!`}).then(msg => {
                                setTimeout(() => {
                                    msg.delete()
                                }, 5000)
                            })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                };

                if (!roleban) {
                    try {
                        let role_ban = await interaction.guild.roles.create({
        
        
                            name: 'Banido',
                            color: '#FF0000'
        
                        })
                        interaction.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                            await channel.createOverwrite(role_ban, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            })
                        });
                        interaction.channel.send({ content: `Os cargos de advertência foram criados neste servidor!`}).then(msg => {
                            setTimeout(() => {
                                msg.delete()
                            }, 3000)
                        }).then(() => {
                            interaction.channel.send({content: `${user} O sistema de advertência foi configurado no servidor!`}).then(msg => {
                                setTimeout(() => {
                                    msg.delete()
                                }, 5000)
                            })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
                interaction.reply({content: `${user} O sistema de advertência foi configurado no servidor!`, flags: 64})
            }
        }
    }
}