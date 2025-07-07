const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const cor = require("..//..//cor.json")
const db = new QuickDB()

module.exports = {
  name: "registro", // Coloque o nome do comando
  description: "Abra o painel de formulário para os membros.", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal_formulário",
      description: "Canal para enviar o formulário para os membros.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "canal_logs",
      description: "Canal para enviar as logs dos formulários recebidos.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "categoria_farm",
      description: "Categoria em que o canal de farm sera criado.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "cargo_inicial",
      description: "Cargo que o membro recebe após ser aprovado.",
      type: Discord.ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "cargo_responsavel_farm",
      description: "Cargo que poderá ver os canais de farm.",
      type: Discord.ApplicationCommandOptionType.Role,
      required: true,
    }
  ],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      interaction.reply({ content: `${interaction.user} Apenas membros com permissão de Administrador podem utilizar este comando`, flags: 64 })
    } else {
      const canalFormulario = interaction.options.getChannel("canal_formulário")
      const canalLogs = interaction.options.getChannel("canal_logs")
      const categoriaFarm = interaction.options.getChannel("categoria_farm")
      const cargo = interaction.options.getRole("cargo_inicial")
      const cargoResp = interaction.options.getRole("cargo_responsavel_farm")

      if(canalFormulario.type !== Discord.ChannelType.GuildText) {
        interaction.reply({ content: `${interaction.user} Mencione um canal de texto para enviar o painel do formulario`, flags: 64 })
      } else {

        if(canalLogs.type !== Discord.ChannelType.GuildText) {
          interaction.reply({ content: `${interaction.user} Mencione um canal de texto para enviar as logs do formulario`, flags: 64 })
        } else {

          if(categoriaFarm.type !== Discord.ChannelType.GuildCategory) {
            interaction.reply({ content: `${interaction.user} Mencione uma categoria para criar os canais de farm`, flags: 64 })
          } else {

            await db.set(`canaFormulario_${interaction.guild.id}`, canalFormulario.id)
            await db.set(`canalLogs_${interaction.guild.id}`, canalLogs.id)
            await db.set(`categoriaFarm_${interaction.guild.id}`, categoriaFarm.id)
            await db.set(`cargoInicial_${interaction.guild.id}`, cargo.id)
            await db.set(`cargoResp_${interaction.guild.id}`, cargoResp.id)

            let registro = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('registro')
                .setEmoji('📝')
                .setLabel('Pedir set')
                .setStyle(Discord.ButtonStyle.Success)
            )

            const painelRegistro = new Discord.EmbedBuilder()
            .setAuthor({ name: `Registro ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setDescription(`Clique em \`\`Pedir set\`\` para que algum lider/gerente aprove o seu registro!`)
            .setColor(cor.amarelo)

            canalFormulario.send({ embeds: [painelRegistro], components: [registro] }).then(() => {
              interaction.reply({ content: `${interaction.user} O sistema de registro foi configurado com sucesso`, flags: 64 })
            })
          }
        }
      }
    }
  }
}