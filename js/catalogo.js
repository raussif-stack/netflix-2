/*
  CATÁLOGO CENTRAL — NETFLIX 2%
  Edite os dados das séries aqui. Os episódios são gerados automaticamente
  pela quantidade informada em criarEpisodios(). Para cadastrar títulos, preencha o objeto
  titulosEpisodios de cada série. Os IDs do YouTube continuam no objeto idsVideos.
*/
function criarEpisodios(quantidade, idsVideos = {}, titulosEpisodios = {}, duracoesEpisodios = {}) {
  return Array.from({ length: quantidade }, (_, indice) => {
    const numero = indice + 1;
    const numeroFormatado = String(numero).padStart(3, "0");

    return {
      numero,
      titulo: `Episódio ${numeroFormatado}`,
      // Preencha o título personalizado no objeto titulosEpisodios da série.
      descricao: titulosEpisodios[numero] || "",
      duracao: duracoesEpisodios[numero] || "A definir",
      // Cole o ID correspondente no objeto idsVideos da série, usando o número do episódio.
      youtubeId: idsVideos[numero] || ""
    };
  });
}

const catalogo = [
  {
    id: "vida-2",
    titulo: "A VIDA 2%",
    categoria: "DESENVOLVIMENTO PESSOAL",
    descricao: "Uma série sobre escolhas, disciplina e transformação. Um convite para questionar hábitos e construir uma vida com mais propósito.",
    destaque: true,
    banner: "assets/banners/avidadoisporcentobanner.png",
    capa: "assets/posters/avidadoisporcentocapa.png",
    capaFallback: "assets/posters/vida-2-poster.svg",
    temporadas: [
      { numero: 1, titulo: "Temporada 1", // Para cadastrar: 1: "ID_DO_YOUTUBE", 2: "OUTRO_ID" etc.
        episodios: criarEpisodios(245, {
        1: "0LfDv8SSDIo", // Episódio 001
        2: "9r_CyHLEn20", // Episódio 002
        3: "YILrb0x5FHE", // Episódio 003
        4: "-Sxw4Lr1f6A", // Episódio 004
        5: "vMTwprUadgQ", // Episódio 005
        6: "tR2bFqSnoSQ", // Episódio 006
        7: "AhH-3a58bNI", // Episódio 007
        8: "47toDk4Sx-c", // Episódio 008
        9: "VW2bbAOgsNE", // Episódio 009
        10: "1cKxHAYkfVw", // Episódio 010
        11: "tP-iPiFh9h4", // Episódio 011
        12: "kMwpNnZYqRk", // Episódio 012
        13: "ZmqKWZN4s0U", // Episódio 013
        14: "y8rm8X2vQ40", // Episódio 014
        15: "aVkZcaSJ3so", // Episódio 015
        16: "BiRUuheBFOE", // Episódio 016
        17: "Pufk-tCLsEM", // Episódio 017
        18: "cQLAXlPW3JE", // Episódio 018
        19: "ic1jooq_pDI", // Episódio 019
        20: "9V3hiLOx6xM", // Episódio 020
        21: "dXYcsfEoJis", // Episódio 021
        22: "gaYnpcpPoco", // Episódio 022
        23: "UXBCzCGWUWA", // Episódio 023
        24: "t1AhebqY25k", // Episódio 024
        25: "Q0GCuFMFqPI", // Episódio 025
        26: "OxKnZ7GkLdA", // Episódio 026
        27: "tE97DjvUyME", // Episódio 027
        28: "irqMH2XScnM", // Episódio 028
        29: "oWves1c5lCo", // Episódio 029
        30: "fGnB8JRteXs", // Episódio 030
        31: "vehR-6b9xKg", // Episódio 031
        32: "628w7tRRf2Q", // Episódio 032
        33: "cv4OvM3wGAE", // Episódio 033
        34: "n6MmHwqPA-I", // Episódio 034
        35: "YRiprT0NI-8", // Episódio 035
        36: "SvU4xlo7Vqc", // Episódio 036
        37: "Rt4DofZKlJ0", // Episódio 037
        38: "jHhiTCG-9RI", // Episódio 038
        39: "UrbjD0QJmC4", // Episódio 039
        40: "gWp4bF3b8oA", // Episódio 040
        41: "M2b7pw7r0z4", // Episódio 041
        42: "hfwfqHuH8A4", // Episódio 042
        43: "c3wVlLwv774", // Episódio 043
        44: "8deNmke0S_o", // Episódio 044
        45: "uWfeHWenwIA", // Episódio 045
        46: "po1CQmnDQQ0", // Episódio 046
        47: "E688OHqdaB4", // Episódio 047
        48: "EzZiR4_xGGc", // Episódio 048
        49: "ucW4M8JCbQo", // Episódio 049
        50: "27yDcr6DeME", // Episódio 050
        51: "ljt2Ije3Ius", // Episódio 051
        52: "dBW-AeCWyQk", // Episódio 052
        53: "Z-s65nN0lbw", // Episódio 053
        54: "8iYS3QOuN1M", // Episódio 054
        55: "W5seZz1zSgo", // Episódio 055
        56: "SOghDfi_1II", // Episódio 056
        57: "UAOhoiuemtM", // Episódio 057
        58: "jJdDLBEOerQ", // Episódio 058
        59: "irNI6C3-vZY", // Episódio 059
        60: "g-sePuAoYjE", // Episódio 060
        61: "NOQ9eIP1n5Y", // Episódio 061
        62: "a3RR0ckJGrU", // Episódio 062
        63: "-Q_NLuH1Uf4", // Episódio 063
        64: "IzF338BbpcE", // Episódio 064
        65: "t81Omabf-aw", // Episódio 065
        66: "lT-1T2Funx4", // Episódio 066
        67: "MJJueukDUMg", // Episódio 067
        68: "Brb4QgLAZH4", // Episódio 068
        69: "0XLm8L8gqsc", // Episódio 069
        70: "l5kqAHbV-lQ", // Episódio 070
        71: "1UwhNVR0kt4", // Episódio 071
        72: "3va1TCb2F20", // Episódio 072
        73: "41PSgaJEwDU", // Episódio 073
        74: "kwnPLQZFjYg", // Episódio 074
        75: "MYF-bKTrrHw", // Episódio 075
        76: "Nmgk7iuaw9w", // Episódio 076
        77: "0SEjXQqlQEg", // Episódio 077
        78: "3j5y_vMYccI", // Episódio 078
        79: "E6zpcH9U9_I", // Episódio 079
        80: "fjeOygWeX78", // Episódio 080
        81: "5fOZWwSnoAo", // Episódio 081
        82: "iAmYOQmTJkU", // Episódio 082
        83: "DDTqZKElK1A", // Episódio 083
        84: "SkmKm1FMUJY", // Episódio 084
        85: "edW60BTq9ME", // Episódio 085
        86: "i8sMhwPCMN4", // Episódio 086
        87: "M3Z9BfKdqZA", // Episódio 087
        88: "KSGpYWgIHzc", // Episódio 088
        89: "vrR5p9GaqNg", // Episódio 089
        90: "U05un0hRRuo", // Episódio 090
        91: "iGF9XDQiCBU", // Episódio 091
        92: "pwGufT5I8b0", // Episódio 092
        93: "x62K6TGssu4", // Episódio 093
        94: "1iJzzBnVHm8", // Episódio 094
        95: "PBOsmjT_R7k", // Episódio 095
        96: "p-29vf2PyR4", // Episódio 096
        97: "lkWr4aD8yBc", // Episódio 097
        98: "96bf13cgnl0", // Episódio 098
        99: "ztm-8WUY1nQ", // Episódio 099
        100: "Zw7VYZhcNps", // Episódio 100
        101: "3FXT97roLf8", // Episódio 101
        102: "zlQLlaXD_mI", // Episódio 102
        103: "xcMH5ID4qOc", // Episódio 103
        104: "0kX7_PBIhFg", // Episódio 104
        105: "xV_LXeilG04", // Episódio 105
        106: "Muh4KJlK-w8", // Episódio 106
        107: "tu0LiejVynY", // Episódio 107
        108: "nWLTA51UIr4", // Episódio 108
        109: "-cCvIsakuAA", // Episódio 109
        110: "xggKRo9DhEA", // Episódio 110
        111: "83Y9ZxUHUDE", // Episódio 111
        112: "wGCfdabwjsg", // Episódio 112
        113: "Hlw1va20uUo", // Episódio 113
        114: "KnbpbYcSR2U", // Episódio 114
        115: "W7UTzrgnmmc", // Episódio 115
        116: "wPOj_2Xi5U8", // Episódio 116
        117: "UIe2uzd_2dA", // Episódio 117
        118: "liDtH121KMA", // Episódio 118
        119: "UjQ_fNRTZ2M", // Episódio 119
        120: "yH_UHzUbKBE", // Episódio 120
        121: "Qsp5swsjFlM", // Episódio 121
        122: "n8K1IwdhVVE", // Episódio 122
        123: "q92PGNXNtzo", // Episódio 123
        124: "mml1ire2ITc", // Episódio 124
        125: "VM1bQe4Txcs", // Episódio 125
        126: "Di3uCoV_oSQ", // Episódio 126
        127: "IYiMahZwLOg", // Episódio 127
        128: "6cjeb5jHRXI", // Episódio 128
        129: "-VekHcCdjPQ", // Episódio 129
        130: "_cT8YI6ZgfE", // Episódio 130
        131: "28sAmo3qVeI", // Episódio 131
        132: "oXaToloi2R8", // Episódio 132
        133: "ogOIr3EODfM", // Episódio 133
        134: "BIp2C_z7X68", // Episódio 134
        135: "w8q1pElC84g", // Episódio 135
        136: "8cs1h7NmFQc", // Episódio 136
        137: "MXR7RSsp68M", // Episódio 137
        138: "M7-d-KbCJoA", // Episódio 138
        139: "Owed7H2T7Co", // Episódio 139
        140: "V0TqdGcIPd4", // Episódio 140
        141: "hT2qc37eLcY", // Episódio 141
        142: "QSmWP-9w-2E", // Episódio 142
        143: "t3iOLiQCoWA", // Episódio 143
        144: "Sx0xB6Doa0o", // Episódio 144
        145: "", // Episódio 145
        146: "", // Episódio 146
        147: "", // Episódio 147
        148: "", // Episódio 148
        149: "", // Episódio 149
        150: "", // Episódio 150
        151: "", // Episódio 151
        152: "", // Episódio 152
        153: "", // Episódio 153
        154: "", // Episódio 154
        155: "", // Episódio 155
        156: "", // Episódio 156
        157: "", // Episódio 157
        158: "", // Episódio 158
        159: "", // Episódio 159
        160: "", // Episódio 160
        161: "", // Episódio 161
        162: "", // Episódio 162
        163: "", // Episódio 163
        164: "", // Episódio 164
        165: "", // Episódio 165
        166: "", // Episódio 166
        167: "", // Episódio 167
        168: "", // Episódio 168
        169: "", // Episódio 169
        170: "", // Episódio 170
        171: "", // Episódio 171
        172: "", // Episódio 172
        173: "", // Episódio 173
        174: "", // Episódio 174
        175: "", // Episódio 175
        176: "", // Episódio 176
        177: "", // Episódio 177
        178: "", // Episódio 178
        179: "", // Episódio 179
        180: "", // Episódio 180
        181: "", // Episódio 181
        182: "BIa5YdJipbg",
        183: "unEcwZddk8o",
        184: "2E_zyXPNf1Y",
        185: "hpOfsB7iatU",
        186: "q3TwaanuTfQ",
        187: "XMNcgqBvtJA",
        188: "Wc7BMrfkveo",
        189: "FFNVySjsU4U",
        190: "hRMgd5IbDjI",
        191: "WAI7iq_JpUs",
        192: "2xSyUnTptyY",
        193: "15xKDzKj6DU",
        194: "yjMY-GOxzQg",
        195: "K59Dfr7dXj0",
        196: "v62OPCIN-Sk",
        197: "ovxQnluV10o",
        198: "YnfvmvXRTWA",
        199: "4BJjVZyqrLM", // Episódio 199
        200: "3ECsfUwN71U", // Episódio 200
        201: "dJ-hY0GVZZs", // Episódio 201
        202: "RHK54fEZQDM", // Episódio 202
        203: "copcI2GZ_ao", // Episódio 203
        204: "UNXFzR90iH0", // Episódio 204
        205: "k47UcEwkD4A", // Episódio 205
        206: "4RcYSonIw9o", // Episódio 206
        207: "msa2vCmUD5A", // Episódio 207
        208: "5AW5WfsVNLY", // Episódio 208
        209: "Mv-24FLWs4Y", // Episódio 209
        210: "BMB6d_1z1lU", // Episódio 210
        211: "HVo2G54bh1A", // Episódio 211
        212: "j0oxvueUSA8", // Episódio 212
        213: "BRzZ1sfu3k0", // Episódio 213
        214: "eKvkJ49upvo", // Episódio 214
        215: "6pJuVuzw69o", // Episódio 215
        216: "mjRO5FfIRWU", // Episódio 216
        217: "R5EJMZZ51Aw", // Episódio 217
        218: "QSrf11r-xc4", // Episódio 218
        219: "KQH4sIq27S4", // Episódio 219
        220: "Zmg-Y0Set7E", // Episódio 220
        221: "UcoetvScyZQ", // Episódio 221
        222: "Qz2XObDz9XY", // Episódio 222
        223: "jh2RaN2zeUg", // Episódio 223
        224: "n3FAjEooAK8", // Episódio 224
        225: "0Z95xOy1nr0", // Episódio 225
        226: "DBs3JKmtnq0", // Episódio 226
        227: "1MbdD6q_2C0", // Episódio 227
        228: "zeS_AGja074", // Episódio 228
        229: "xbKs2KD6lmc", // Episódio 229
        230: "0U8hOhKABD0", // Episódio 230
        231: "ZPVjC4EF2C4", // Episódio 231
        232: "Ym-1YdTD7CY", // Episódio 232
        233: "klFyA3Mk1hc", // Episódio 233
        234: "y_-u_ZTdkV4", // Episódio 234
        235: "xqLZlJkuPrY", // Episódio 235
        236: "54NmilewvSM", // Episódio 236
        237: "Jd9goHgmNvE", // Episódio 237
        238: "pr-4YKrEJjk", // Episódio 238
        239: "UrJUEUr_giA", // Episódio 239
        240: "v67nV9WsXfs", // Episódio 240
        241: "9wkR0kYCmyA", // Episódio 241
        242: "YkD-ADF4nuM", // Episódio 242
        243: "L_t6ofBzJYk", // Episódio 243
        244: "Xv8vS5bFInc", // Episódio 244
        245: "", // Episódio 245
        }, {
          // Escreva o título de cada episódio entre aspas. Ex.: 1: "Meu título"
          1: "Decidi vir para o YouTube e falar sobre a verdade do NoFap. 1.599 dias", // Episódio 001 — Decidi vir para o YouTube e falar sobre a verdade do NoFap. 1.599 dias

          2: "Você tem essa sensação ao praticar NoFap? (hipnotizado). 1600 dias", // Episódio 002 — Você tem essa sensação ao praticar NoFap? (hipnotizado). 1600 dias
          3: "O motivo de você recair no nofap (REVELADO.) 1.606 Dias", // Episódio 003 — O motivo de você recair no nofap (REVELADO.) 1.606 Dias
          4: "Eu tive 26 benefícios praticando nofap. 1.609 DIAS", // Episódio 004 — Eu tive 26 benefícios praticando nofap. 1.609 DIAS
          5: "EU VOU PARAR DE PRATICAR NOFAP. 1621 DIAS.", // Episódio 005 — EU VOU PARAR DE PRATICAR NOFAP. 1621 DIAS
          6: "CHEGUEI AOS 1.628 DIAS DE NOFAP FAZENDO ISSO CCC.", // Episódio 006 — CHEGUEI AOS 1.628 DIAS DE NOFAP FAZENDO ISSO CCC.
          7: "SE VOCÊ FAZ NOFAP E TOMA CAFÉ, CUIDADO. 15 DIAS SEM CAFÉ.", // Episódio 007 — SE VOCÊ FAZ NOFAP E TOMA CAFÉ, CUIDADO. 15 DIAS SEM CAFÉ.
          8: "NENHUMA AUTORIDADE TE ENSINA SOBRE NOFAP 1.646 DIAS.", // Episódio 008 — NENHUMA AUTORIDADE TE ENSINA SOBRE NOFAP 1.646 DIAS.
          9: "Eu tive uma mudança absurda na minha APARÊNCIA depois de praticar nofap. 1654 DIAS", // Episódio 009 — Eu tive uma mudança absurda na minha APARÊNCIA depois de praticar nofap. 1654 DIAS
          10: "VOCÊ VAI FICAR POBRE. 1.663 DIAS NOFAP.", // Episódio 010 — VOCÊ VAI FICAR POBRE. 1.663 DIAS NOFAP.
          11: "ESSES 19 BIOHACKERS ME FIZERAM CHEGAR A 1.679 DIAS DE NOFAP.", // Episódio 011 — ESSES 19 BIOHACKERS ME FIZERAM CHEGAR A 1.679 DIAS DE NOFAP.
          12: "O que acontece nos PRIMEIROS 30 DIAS longe da pornografia. 1.690 NO FAP", // Episódio 012 — O que acontece nos PRIMEIROS 30 DIAS longe da pornografia. 1.690 NO FAP
          13: "Esse video chegará até você na hora CERTA. 1.692 DIAS | NOFAP", // Episódio 013 — Esse video chegará até você na hora CERTA. 1.692 DIAS | NOFAP
          14: "Os poderes de Jesus e a Retenção Seminal. 1.694 Dias de Nofap", // Episódio 014 — Os poderes de Jesus e a Retenção Seminal. 1.694 Dias de Nofap
          15: "MÁS - TURBAÇÃO é isso que você precisa entender. 1.702 dias de Nofap", // Episódio 015 — MÁS - TURBAÇÃO é isso que você precisa entender. 1.702 dias de Nofap
          16: "ESSE É O JOGO DO NOFAP 1.722 Dias.", // Episódio 016 — ESSE É O JOGO DO NOFAP 1.722 Dias.
          17: "RECAÍ NO NOFAP. 1.724 DIAS", // Episódio 017 — RECAÍ NO NOFAP. 1.724 DIAS
          18: "AS MULHERES AMAM ISSO. (HOMENS QUE SE MAST). 1.741 Dias", // Episódio 018 — AS MULHERES AMAM ISSO. (HOMENS QUE SE MAST). 1.741 Dias
          19: "DIA 1.742 DE NOFAP E A ESSA ALTURA DO CAMPEONATO ESTOU ARREPENDIDO", // Episódio 019 — DIA 1.742 DE NOFAP E A ESSA ALTURA DO CAMPEONATO ESTOU ARREPENDIDO
          20: "O MESMO OLHAR DE SOLDADOS EM GUERRA ESTÁ APARECENDO EM MULHERES ONLINE", // Episódio 020 — O MESMO OLHAR DE SOLDADOS EM GUERRA ESTÁ APARECENDO EM MULHERES ONLINE
          21: "JOGUE FORA SEU CAFÉ (125 dias sem café e o NoFap mudou de nível)", // Episódio 021 — Título do Episódio 021
          22: "Eles querem que você recaia no NOFAP. 1751 DIAS", // Episódio 022 — Título do Episódio 022
          23: "Soldado, você foi programado. (Aqui começa a sua mudança no NoFap)", // Episódio 023 — Título do Episódio 023
          24: "ACONTECEU ISSO COM MINHA PRÓSTATA (depois de mais de 1.700 dias)", // Episódio 024 — Título do Episódio 024
          25: "O perigo da POLUÇÃO NOTURNA (veja se acontece com você) 1.755 Dias NoFap", // Episódio 025 — Título do Episódio 025
          26: "Fiquei broxa? (Depois de +1.700 dias de NoFap)", // Episódio 026 — Título do Episódio 026
          27: "Não compre nenhum curso de NoFap (eu vou te ensinar tudo)", // Episódio 027 — Título do Episódio 027
          28: "Essas 10 maldições seguirão (aqueles que não praticam NoFap)", // Episódio 028 — Título do Episódio 028
          29: "Eu anotei os meus 90 dias (REBOOT) de NOFAP e vou te contar tudo", // Episódio 029 — Título do Episódio 029
          30: "Sansão caiu... José venceu. A diferença estava no CONTROLE DA LIBIDO", // Episódio 030 — Título do Episódio 030
          31: "NoFap + Minimalismo: O Combo que Transforma Qualquer Homem Fraco em Disciplinado.", // Episódio 031 — Título do Episódio 031
          32: "Mentiram pra você? Magnetismo Pessoal no NoFap.", // Episódio 032 — Título do Episódio 032
          33: "Descobri a Verdadeira Pílula do Filme Sem Limites (E Não É o Que Você Pensa) No fap", // Episódio 033 — Título do Episódio 033
          34: "Fim do canal? Eu também sou uma fraude no NoFap", // Episódio 034 — Título do Episódio 034
          35: "Fora do algoritmo. Apenas 1% dos homens vão assistir. PodcastNoFap 01", // Episódio 035 — Título do Episódio 035
          36: "Esses motivos farão você começar a praticar Nofap", // Episódio 036 — Título do Episódio 036
          37: "Depois desse conselho você nunca mais vai recair", // Episódio 037 — Título do Episódio 037
          38: "Os 5 efeitos 'obscuros' do NoFap que não te contam", // Episódio 038 — Título do Episódio 038
          39: "Eu só consegui 1.779 dias porque faço essas 5 práticas de transmutação no NoFap", // Episódio 039 — Título do Episódio 039
          40: "Com NoFap eu só faço 2 refeições por dia", // Episódio 040 — Título do Episódio 040
          41: "Hoje a pornografia não tem mais nenhum efeito sobre mim (Como chegar nesse nível?)", // Episódio 041 — Título do Episódio 041
          42: "A Lua Está Fazendo Você Recaír no NoFap (Ninguém Te Contou Isso)", // Episódio 042 — Título do Episódio 042
          43: "Como sobreviver até 2030 com a retenção seminal (eles não querem que você chegue)", // Episódio 043 — Título do Episódio 043
          44: "Chega! Vou Sumir das Redes por 6 Meses (Monk Mode)", // Episódio 044 — Título do Episódio 044
          45: "Conversei com um FUNCIONÁRIO de Only F. (o que ele revelou é assustador)", // Episódio 045 — Título do Episódio 045
          46: "Monk Mode: O Que Acontece com Seu Cérebro em 72 Horas (loucura)", // Episódio 046 — Título do Episódio 046
          47: "Se Você Ainda Não Casou, Talvez Nunca Vá Casar Mesmo...", // Episódio 047 — Título do Episódio 047
          48: "E se você parasse de se masturbar? (Eu fiquei 5 anos) No FAP", // Episódio 048 — Título do Episódio 048
          49: "As 4 Modalidades do NoFap que Podem Transformar Sua Vida (a 4ª é a mais poderosa)", // Episódio 049 — Título do Episódio 049
          50: "De Tímido a Magnético: Como o Neurofap Mudou Minha Vida! (Teste em você)", // Episódio 050 — Título do Episódio 050
          51: "Felca revelou o que ninguém tem coragem de falar sobre a pornografia (adultização)", // Episódio 051 — Título do Episódio 051
          52: "A dica mais estranha que te impede de recair no NoFap (aplique em 3 segundos)", // Episódio 052 — Título do Episódio 052
          53: "O Único Benefício que Eu Tive Assistindo Pornografia (e é benefício mesmo)", // Episódio 053 — Título do Episódio 053
          54: "Como Jesus venceria a pornografia hoje (ele deixou códigos)", // Episódio 054 — Título do Episódio 054
          55: "Por que o NoFap pode acabar te destruindo (é isso mesmo que você leu) (7 perigos)", // Episódio 055 — Título do Episódio 055
          56: "A Bíblia tentou nos avisar sobre o NoFap (e o sistema escondeu)", // Episódio 056 — Título do Episódio 056
          57: "Transmutar energia sexual é impossível no Nofap [até você fazer isso]", // Episódio 057 — Título do Episódio 057
          58: "NoFap | Como criar AUTOCONFIANÇA (códigos de Desbloqueio)", // Episódio 058 — Título do Episódio 058
          59: "Eu nem queria contar isso (mas é preciso). A verdade sobre o NoFap", // Episódio 059 — Título do Episódio 059
          60: "A vida dos 2%", // Episódio 060 — Título do Episódio 060
          61: "O que a pornografia está fazendo com a geração Z", // Episódio 061 — Título do Episódio 061
          62: "O SEGREDO DOS 2%: Como avançar 10 anos em 1 (NoFap)", // Episódio 062 — Título do Episódio 062
          63: "NoFap September é uma mentira? (Veja até o final)", // Episódio 063 — Título do Episódio 063
          64: "Pare de Ser Bonzinho Se Quer Vencer a Pornografia. (Isso vai doer)", // Episódio 064 — Título do Episódio 064
          65: "EU FIQUEI 1.834 DIAS SEM GOZ@R E DESCOBRI UM MÉTODO INFALÍVEL", // Episódio 065 — Título do Episódio 065
          66: "EU DESCOBRI QUE A P@RN@GRAFI@ DESTRUIU MINHA DOPAMINA", // Episódio 066 — Título do Episódio 066
          67: "EU RESPONDI AS PERGUNTAS MAIS POLÊMICAS DO NOFAP (e choquei a galera)", // Episódio 067 — Título do Episódio 067
          68: "A TÉCNICA DE LAVAGEM CEREBRAL QUE ME DEIXOU 1.837 DIAS SEM M@STURB@Ç@O", // Episódio 068 — Título do Episódio 068
          69: "EU ENCONTREI ESSE DETALHE em Pense e Enriqueça... e mudou a forma como vejo o Sexo e a Riqueza", // Episódio 069 — Título do Episódio 069
          70: "CONVERSEI COM A PORNOGR@FI@ (E PERGUNTEI COMO ELA TE CONTROLA)", // Episódio 070 — Título do Episódio 070
          71: "O Maldito Segredo que Te Torna Repelente para Elas", // Episódio 071 — Título do Episódio 071
          72: "NoFap dia 1.843: É isso que está acontecendo comigo", // Episódio 072 — Título do Episódio 072
          73: "Você precisa praticar NoFap Antes de 2030 (urgente)", // Episódio 073 — Título do Episódio 073
          74: "Respondi às críticas de médicos e psicólogos sobre o NoFap (mentirosos)", // Episódio 074 — Título do Episódio 074
          75: "1 Homem Sem Pornografia VS 30 Viciados – A Verdade Chocante", // Episódio 075 — Título do Episódio 075
          76: "Brainrot & Pornografia – A Combinação Que Está Matando a Sua Mente", // Episódio 076 — Título do Episódio 076
          77: "Se você e ela assistem pornografia – Estejam preparados para se separarem (AVISO)", // Episódio 077 — Título do Episódio 077
          78: "POR QUE MILHÕES DE HOMENS NÃO TR@NSAM SEM TADALAFILA (CRISE)", // Episódio 078 — Título do Episódio 078
          79: "O fim do Instagram (vou excluir minha conta)", // Episódio 079 — Título do Episódio 079
          80: "Ouça esse áudio todos os Dias – Transforme-se em 21 Dias (Não conte a ninguém)", // Episódio 080 — Título do Episódio 080
          81: "EU MEDI A MINHA TESTOSTERONA DEPOIS DE 5 ANOS DE NOFAP (susto)", // Episódio 081 — Título do Episódio 081
          82: "ENERGIA INFINITA (Assista até o fim)", // Episódio 082 — Título do Episódio 082
          83: "Como é a vida de quem não goz@", // Episódio 083 — Título do Episódio 083
          84: "A Matrix quer seu sêmen", // Episódio 084 — Título do Episódio 084
          85: "Protocolo RECARGA - o que fazer imediatamente após uma recaída", // Episódio 085 — Título do Episódio 085
          86: "Você não foi criado para goz@r (Matrix)", // Episódio 086 — Título do Episódio 086
          87: "O livro proibido que me fez praticar Retenção Seminal (ele elimina a Matrix)", // Episódio 087 — Título do Episódio 087
          88: "Seu testículo vale 4 milhões de euros (a Matrix quer ele)", // Episódio 088 — Título do Episódio 088
          89: "Pare de Goz@r e o Espelho Vai Começar a Te Respeitar", // Episódio 089 — Título do Episódio 089
          90: "Pare de Goz@r e Você Vai Assustar as Mulheres",
          91: "Pare de Goz@r e Você Vai Ficar Inteligente Demais",
          92: "Pare de Goz@r antes de 2026 (Alerta)",
          93: "\"Pare de Goz@r\" A DURA VERDADE SOBRE A RETENÇÃO SEMINAL",
          94: "TOME SOL NAS BOLAS",
          95: "Pare de Goz@r e vire o Leonardo DiCaprio (GLOW UP)",
          96: "Pare de Goz@r, igual o Elon Musk (a verdade por traz da genialidade)",
          97: "Pare de Goz@r por 24h (a ciência não quer que você saiba)",
          98: "Parei de Goz@r e me l@skei (cuidado com a Retenção Seminal)",
          99: "Pare de Goz@r: Um grande erro que cometi (confissão)",
          100: "Pare de Goz@ar e atraia Disciplina Riqueza e Sabedoria",
          101: "Pare de Goz@r, as mulheres não querem que você aprenda isso (NÃO IGNORE)",

          // Episódios 102–118
          102: "Nunca Goz3 em uma Segunda feira (Truque da Matrix)",
          103: "Eu não goz00 há anos — e tenho 15 hábitos estranhos",
          104: "Depois de 7 meses Recaí no café... (mas transformei em poder)",
          105: "Eu não goz00 a anos, mas não recomendo à todos (cuidado)",
          106: "Eu parei de goz@r — E minha ansiedade desapareceu em 30 dias",
          107: "12 anos em Retenção Seminal — o que acontece com o homem?",
          108: "A Maior AULA Sobre Retenção Seminal da Internet (15 Perguntas Essenciais)",
          109: "Faz 5 anos que parei de goz@r e aconteceu o que eles temiam (veja até o final)",
          110: "Pare de Goz@r e ela vai te mandar mensagem. [Me agradeça]",
          111: "O que acontece nos PRIMEIROS 90 dias LONGE DA PORNOGRAFIA. 1.918 NO FAP",
          112: "Pare de Goz@r e comece a farmar AURA",
          113: "Nofap atrai muitas mulheres (EFEITO COLATERAL)",
          114: "Como parei com a pornografia e voltei ao modo analógico. 1.921 NO FAP",
          115: "7 Mulheres implorando por você? (Inevitável) NO FAP",
          116: "Dessexualizar sua Mente vai te dar poderes. (Teste já) NO FAP",
          117: "Em Retenção Seminal 90% dos seus PROBLEMAS NÃO EXISTEM",
          118: "ESSE INFLUENCIADOR DE +1Mi FALOU ISSO DE MIM (Absurdo)",

          // Episódios 119–137
          119: "ESSE INFLUENCIADOR NÃO SABE O QUE FALA (Conselho absurdo)",
          120: "Essa Dra é GO FAP (Eu Reagi ao vídeo dela)",
          121: "Se não vencer o 5 contra 1 você vai ser corno. (Presenciei ao vivo)",
          122: "2026 VAI TE QUEBRAR (se você continuar goz@ndo como um idiota)",
          123: "A TENTAÇÃO QUE QUASE ME FEZ CAIR (NOFAP NA ACADEMIA)",
          124: "O Feminino só respeita saco cheio. (Retenção Seminal)",
          125: "O famoso espanta tudo (mulher, dinheiro, sorte)",
          126: "RETENÇÃO SEMINAL - Se você pratica, está correndo perigo. (Urgente)",
          127: "Efeito Gentleman em 30 Dias de Retenção Seminal. (Atração)",
          128: "O MAIOR ERRO DO NEYMAR FOI NÃO PRATICAR RETENÇÃO SEMINAL. (a falha do gênio)",
          129: "EU NÃO GOOZO E NÃO OUÇO MÚSICA (estou vivendo?)",
          130: "Não Goz3 em 2026 e IRÁ ACONTECER ESSAS 10 COISAS com você (NoFap)",
          131: "VOCÊ ESTÁ USANDO O SEU TESÃO ERRADO (Evite esse Erro Agora)",
          132: "Essa técnica ATIVARÁ SEUS PODERES usando a Retenção Seminal.(Segredo Revelado)",
          133: "A Retenção Seminal te transformará em um Guerreiro no Jardim",
          134: "NÃO OLHE PARA ELAS E PARE DE GOZ@R (Retenção Seminal)",
          135: "ELAS NÃO TE QUEREM PORQUE ESTÃO VICIADAS EM PORNOGRAFIA (Retenção Seminal)",
          136: "NOFAP: EDGING PARECE SER UM BOM ALIADO",
          137: "JÁ FAZEM 5 ANOS QUE NÃO ACORDO MOLHADO - POLUÇÃO NOTURNA",

          // Episódios 138–156
          138: "Elas querem que você Goz3 (isso é loucura)",
          139: "A TÉCNICA MAIS IDIOTA QUE VAI RESETAR SEU CÉREBRO DA PORNOGRAFIA",
          140: "O fim da pornografia é isso que ocorreu no BBB",
          141: "Cuidado com A FASE mais difícil da Retenção Seminal (o teste final)",
          142: "Elas só precisam que você Goz3 e será o fim (Está na Bíblia)",
          143: "Eu larguei a CLT depois que comecei a praticar Retenção Seminal",
          144: "Os Poderes dos Gênios e a Retenção Seminal. 1.982 dias",
          145: "Esse tipo de mulher vai aparecer quando você estiver em Nofap/Retenção Seminal",
          146: "HACK ANTI PORNOGRAFIA PROIBIDO PELA ELITE (antiético)",
          147: "O PORQUÊ A MASTURBAÇÃO FAZ MAL (EXPLICAÇÃO ASSUSTADORA)",
          148: "Como parar com as Recaídas Seguidas na Pornografia | Retenção Seminal",
          149: "Epstein tinha 142 de testosterona (Retenção de Sêmen)",
          150: "Carnaval é um Portal para o INF3RNO (Retenção de Sêmen)",
          151: "OS 7 NÍVEIS DA RETENÇÃO SEMINAL (os 6° e 7° são absurdos)",
          152: "DESAPRENDA TUDO QUE VOCÊ APRENDEU SOBRE S3X0 (14 conselhos)",
          153: "Infelizmente eu tive esses 15 EFEITOS COLATERAIS após muitos anos de Retenção de Sêmen",
          154: "Nofap não funciona e eu explico o porquê (me desculpe)",
          155: "VÍDEOS DE 2020 QUANDO EU ESTAVA COM 30 DIAS DE NOFAP (VÍDEO RARO)",
          156: "PARE DE GOZ@R E DESBLOQUEIE SEU ALTER EGO PRIME. (Assustador)",
          157: "O Segredo Sexu4l Antigo Que Foi Escondido dos Homens Modernos (Retenção de Sêmen)",
          158: "NoFap me deixou CARECA e agora?",
          159: "RECOMEÇANDO APÓS A RECAÍDA.",
          160: "SE VOCÊ ACORDA DURO, CUIDADO!",
          161: "Eu preciso me Retratar",
          162: "O Experimento Que Eles Esperam Que Você Nunca Complete (90 Dias) Sublimação de Sêmen",
          163: "O BRASIL entrará em guerra. Pare de Goz@r",
          164: "Antes Que Tudo Acabe, Você Precisa Entender Isso",
          165: "Por Que Homens Fracos Odeiam Retenção Seminal?",
          166: "Seu Espelho está TENTANDO TE AVISAR | Sublimação do Sêmen",

          // Vídeo extra — sem numeração de episódio
          "extra": "#Lei 5: A Energia Que Não Circula, Estagna e Adoece o Rei",

          // Episódios 167–176
          167: "Eles(as) NÃO gostam quando você para de ESVAZIAR (cuidado)",
          168: "POTENCIALIZE a Retenção Seminal",
          169: "Retenção Seminal te fará um Cavalo Selvagem",
          170: "EM RETENÇÃO SEMINAL Elas vão te mandar mensagem todo dia",
          171: "Se você quer DOMINAR A RETENÇÃO Seminal, grave estas 15 regras",
          172: "EM RETENÇÃO SEMINAL Você vai atrair mulheres naturalmente... e vai parar de se importar",
          173: "Em retenção Seminal: FUJA DE MULHER CASADA",
          174: "EM RETENÇÃO SEMINAL, Jesus ensinou a sair da Matrix",
          175: "RETENÇÃO SEMINAL + JEJUM + VISUALIZAÇÃO = O CÓDIGO DA ENERGIA INFINITA",
          176: "EM RETENÇÃO SEMINAL você é o MEL que elas querem. (Atração)",

          // Episódios 177–190
          177: "RETENÇÃO SEMINAL vs VENVANSE, QUAL O MAIS PODEROSO?",
          178: "EM RETENÇÃO SEMINAL, PARA ELAS VOCÊ SE TORNARÁ UM ESCROTO",
          179: "EM RETENÇÃO SEMINAL VOCÊ PASSARÁ A TER ESSES 7 PODERES (Use com cuidado)",
          180: "DESCOBRI QUE RETENÇÃO SEMINAL É EFEITO PLACEBO (Droga)",
          181: "EU PRATICO RETENÇÃO SEMINAL E MAIS 26 HÁBITOS QUE VÃO CONTRA A MATRIX",
          182: "A BRONHA É A KRYPTONITA DO HOMEM",
          183: "EM 30 DIAS DE RETENÇÃO SEMINAL VOCÊ TERÁ UM NOVO CPF",
          184: "O MARANHENSE QUE VENDEU OS TESTÍCULOS POR 13,5 MILHÕES (Deu ruim)",
          185: "A RETENÇÃO SEMINAL NÃO VAI TER PENA DE VOCÊ",
          186: "Toda Vez Que Você Ejacula, Seu Corpo PAGA Isso...",
          187: "EU PENSEI EM PARAR COM A RETENÇÃO",
          188: "NÃO ACREDITE EM QUEM ENSINA NOFAP/RETENÇÃO SEMINAL",
          189: "VOCÊ FOI ENGANADO: O Que os Antigos Sabiam Sobre Energia Sexual",
          190: "O Fardo De Estar Mais Desperto Que a Maioria",
          191: "EM RETENÇÃO SEMINAL: MENTE VAZIA É OFICINA DE DEUS",
          192: "Pare de Goz@r e vire o Centro. (Retenção de Sêmen)",
          193: "Se você continua recaindo com Pornografia, isso está destruindo sua mente",
          194: "Sua bronha faz uma mulher perder o interesse instantaneamente",
          195: "Dia 2.068 de Retenção Seminal | Como desenvolver presença masculina real",
          196: "Retenção Seminal: Nesse mundo SUJO, jogue de hack. Não seja bobo",
          197: "RECADO DE DEUS: RELAXE, E NÃO GOZ3.",
          198: "Em Retenção Seminal: Quanto mais carente você está, menos atraente você se torna",
          199: "5 MOTIVOS PRA VOCÊ NÃO PRATICAR NOFAP",
          200: "Em Retenção Seminal seu Patrão vai te Demitir",
          201: "Ejaculação: Os homens mais fracos da geração acham que isso é normal",
          202: "30 dias Limpo... e você vai odiar a versão que aceitava ser",
          203: "Essa é a minha Ritalina e o meu Venvanse (Retenção de Sêmen)",
          204: "A idade que todo homem comum teme (menos os 2%) Retenção Seminal",
          205: "A RETENÇÃO SEMINAL ACABOU ME AFETANDO. (É hora de parar?)",
          206: "EM RETENÇÃO SEMINAL VOCÊ FICARÁ FRENTE A FRENTE COM O DIABO | NoFaP",
          207: "SE VOCÊ ACORDA COM TESÃO, VOCÊ É UM HOMEM PODEROSO | Emoção do Sexo",
          208: "PORQUÊ EU DECIDI COMER SÓ CARNE, SAL E ÁGUA PRO RESTO DA VIDA (Lion Diet)",
          209: "EU NÃO SOU UM SER HUMANO (Retenção Seminal)",
          210: "Como criar Tesão sem nem abrir a boca (Retenção de Sêmen)",
          211: "Tenho 30 anos, não trabalho, não tenho relação sexual... sou um peso?",
          212: "COMEÇOU A DAR TUDO ERRADO — 2.100 DIAS DE RETENÇÃO SEMINAL",
          213: "Os 98% que não fazem Retenção Seminal são BOT (Veja se você é um)",
          214: "Os Poderes Que Estou tendo com 2.105 dias de Retenção Seminal",
          215: "Aos 2.106 Dias Eu Desisti do Sucesso (Retenção Seminal)",
          216: "Respondendo os comentários dos 98% sobre Retenção Seminal (Polêmico)",
          217: "EM RETENÇÃO VOCÊ SERÁ UM FOLGADO, INSUPORTÁVEL E METIDO (Iá ele)",
          218: "Recaindo nenhuma mulher te quer, nem sua MÃE.",
          219: "Nenhum Pastor, Padre ou Guru te ensinou isso. (O Deus da Pureza Sexual)",
          220: "Como usar a Energia Sexual para não ficar Doente.",
          221: "O NoFap Está Criando Homens Fracos (E Quase Ninguém Percebeu)",
          222: "JOGADORES DA NBA FICARAM 10 SEMANAS SEM RELAÇÃO COM AS PARCEIRAS (Retenção Seminal?)",
          223: "As 8 maldições da masturbação",
          224: "A Retenção Seminal está me Destruindo.",
          225: "Se torne um mutante com a Retenção Seminal",
          226: "Se você é casado, cuidado com a Retenção Seminal",
          227: "Desabafo",
          228: "6° Dia... Recomeçando",
          229: "Sem Café/Cafeína e Bronha | Dia 7",
          230: "Bronha e café/cafeína te deixa sem essas vitaminas | Dia 8",
          231: "ISSO ESTÁ ADOECENDO SEU CÉREBRO | DIA 12",
          232: "Em Retenção Seminal Você vive pouco como um Zé",
          233: "EFEITO PRONOIA | NoFap",
          234: "EFEITO METANOIA | Retenção Seminal",
          235: "EFEITO CELEBRIDADE | NoFap",
          236: "RETENÇÃO SEMINAL | O EFEITO EXPANSÃO",
          237: "O EFEITO SINGULARIDADE | NoFap",
          238: "O EFEITO NPC | NoFap (Um perigo)",
          239: "NoFap: O EFEITO FLUXO (Tudo Acontece Sem Esforço)",
          240: "Masturbação é MAGIA?",
          241: "Einstein ensinou o TRUQUE para largar a Masturbação",
          242: "A Retenção Seminal te transforma em uma Anomalia 👁️",
          243: "Em Retenção Seminal Tudo vai dar errado até que..."
          244: "", // Título do Episódio 244
          245: "", // Título do Episódio 245
        
        }, {
                "1": "11 min",
                "2": "11 min",
                "3": "12 min",
                "4": "17 min",
                "5": "12 min",
                "6": "16 min",
                "7": "17 min",
                "8": "15 min",
                "9": "18 min",
                "10": "17 min",
                "11": "25 min",
                "12": "13 min",
                "13": "15 min",
                "14": "17 min",
                "15": "17 min",
                "16": "15 min",
                "17": "15 min",
                "18": "14 min",
                "19": "7 min",
                "20": "14 min",
                "21": "17 min",
                "22": "10 min",
                "23": "12 min",
                "24": "14 min",
                "25": "16 min",
                "26": "9 min",
                "27": "25 min",
                "28": "10 min",
                "29": "30 min",
                "30": "11 min",
                "31": "21 min",
                "32": "15 min",
                "33": "14 min",
                "34": "10 min",
                "35": "27 min",
                "36": "3 min",
                "37": "3 min",
                "38": "15 min",
                "39": "14 min",
                "40": "14 min",
                "41": "17 min",
                "42": "20 min",
                "43": "10 min",
                "44": "13 min",
                "45": "9 min",
                "46": "12 min",
                "47": "12 min",
                "48": "10 min",
                "49": "18 min",
                "50": "17 min",
                "51": "11 min",
                "52": "24 min",
                "53": "26 min",
                "54": "26 min",
                "55": "25 min",
                "56": "22 min",
                "57": "31 min",
                "58": "31 min",
                "59": "21 min",
                "60": "18 min",
                "61": "16 min",
                "62": "21 min",
                "63": "14 min",
                "64": "18 min",
                "65": "21 min",
                "66": "17 min",
                "67": "26 min",
                "68": "32 min",
                "69": "22 min",
                "70": "29 min",
                "71": "27 min",
                "72": "27 min",
                "73": "27 min",
                "74": "33 min",
                "75": "34 min",
                "76": "26 min",
                "77": "29 min",
                "78": "22 min",
                "79": "19 min",
                "80": "10 min",
                "81": "25 min",
                "82": "17 min",
                "83": "23 min",
                "84": "24 min",
                "85": "25 min",
                "86": "21 min",
                "87": "24 min",
                "88": "22 min",
                "89": "24 min",
                "90": "27 min",
                "91": "31 min",
                "92": "20 min",
                "93": "32 min",
                "94": "26 min",
                "95": "27 min",
                "96": "30 min",
                "97": "15 min",
                "98": "20 min",
                "99": "24 min",
                "100": "27 min",
                "101": "25 min",
                "102": "22 min",
                "103": "32 min",
                "104": "29 min",
                "105": "30 min",
                "106": "27 min",
                "107": "32 min",
                "108": "37 min",
                "109": "28 min",
                "110": "31 min",
                "111": "34 min",
                "112": "38 min",
                "113": "32 min",
                "114": "40 min",
                "115": "36 min",
                "116": "40 min",
                "117": "38 min",
                "118": "25 min",
                "119": "32 min",
                "120": "27 min",
                "121": "24 min",
                "122": "26 min",
                "123": "27 min",
                "124": "29 min",
                "125": "25 min",
                "126": "28 min",
                "127": "28 min",
                "128": "31 min",
                "129": "32 min",
                "130": "28 min",
                "131": "31 min",
                "132": "41 min",
                "133": "28 min",
                "134": "33 min",
                "135": "33 min",
                "136": "34 min",
                "137": "38 min",
                "138": "33 min",
                "139": "33 min",
                "140": "32 min",
                "141": "24 min",
                "142": "31 min",
                "143": "28 min",
                "144": "33 min",
                "199": "26 min",
                "200": "24 min",
                "201": "26 min",
                "202": "21 min",
                "203": "29 min",
                "204": "29 min",
                "205": "28 min",
                "206": "28 min",
                "207": "30 min",
                "208": "30 min",
                "209": "32 min",
                "210": "27 min",
                "211": "22 min",
                "212": "33 min",
                "213": "33 min",
                "214": "43 min",
                "215": "38 min",
                "216": "45 min",
                "217": "33 min",
                "218": "30 min",
                "219": "42 min",
                "220": "45 min",
                "221": "28 min",
                "222": "34 min",
                "223": "41 min",
                "224": "29 min",
                "225": "39 min",
                "226": "34 min",
                "227": "41 min",
                "228": "28 min",
                "229": "31 min",
                "230": "36 min",
                "231": "35 min",
                "232": "33 min",
                "233": "12 min",
                "234": "13 min",
                "235": "12 min",
                "236": "12 min",
                "237": "13 min",
                "238": "12 min",
                "239": "14 min",
                "240": "23 min",
                "241": "25 min",
                "242": "31 min",
                "243": "15 min",
                "244": "35 min"
        }) }
    ]
  },
  {
    id: "retencao-48-leis",
    titulo: "AS 48 LEIS DA RETENÇÃO SEMINAL",
    categoria: "AUTOCONHECIMENTO",
    descricao: "Uma jornada de reflexões sobre autocontrole, hábitos e desenvolvimento pessoal.",
    destaque: false,
    banner: "assets/banners/48leisretencaoseminalbanner.png",
    capa: "assets/posters/48leisretencaoseminalcapa.png",
    capaFallback: "assets/posters/retencao-poster.svg",
    temporadas: [
      { numero: 1, titulo: "Temporada 1", // Use o número do episódio como chave: 1, 2, 3...
        episodios: criarEpisodios(6, {
        1: "QzV7CgDWTjM", // Episódio 001
        2: "zPSu823FR6Y", // Episódio 002
        3: "Q-lFhH4DvBI", // Episódio 003
        4: "0aq2hvZx7wg", // Episódio 004
        5: "mfM2hcX07nw", // Episódio 005
        6: "6eoSYw6Rdas", // Episódio 006
        }, {
          // Escreva o título de cada episódio entre aspas. Ex.: 1: "Meu título"
          1: "Título", // Título do Episódio 001
          2: "", // Título do Episódio 002
          3: "", // Título do Episódio 003
          4: "", // Título do Episódio 004
          5: "", // Título do Episódio 005
          6: "", // Título do Episódio 006
        
        }, {
                "1": "17 min",
                "2": "22 min",
                "3": "20 min",
                "4": "21 min",
                "5": "20 min",
                "6": "20 min"
        }) }
    ]
  },
  {
    id: "voz-dos-2",
    titulo: "A VOZ DOS 2%",
    categoria: "REFLEXÕES E CONHECIMENTO",
    descricao: "Ideias, conversas e perspectivas para olhar o mundo por outros ângulos e estimular novas reflexões.",
    destaque: false,
    banner: "assets/banners/avozdos2porcentobanner.png",
    capa: "assets/posters/avozdos2porcentocapa.png",
    capaFallback: "assets/posters/voz-2-poster.svg",
    temporadas: [
      { numero: 1, titulo: "Temporada 1", // Use o número do episódio como chave: 1, 2, 3.
        episodios: criarEpisodios(3, {
        1: "y50TIL2I68g", // Episódio 001
        2: "KBYdwCPXAK4", // Episódio 002
        3: "lH275gpnLk0", // Episódio 003
        }, {
          // Escreva o título de cada episódio entre aspas. Ex.: 1: "Meu título"
          1: "", // Título do Episódio 001
          2: "", // Título do Episódio 002
          3: "", // Título do Episódio 003
        
        }, {
                "1": "1h 6min",
                "2": "1h 52min",
                "3": "1h 11min"
        }) }
    ]
  },
  {
    id: "lives-2",
    titulo: "LIVES 2%",
    categoria: "LIVES E TRANSMISSÕES",
    descricao: "Lives, conversas e transmissões do universo 2%.",
    destaque: false,
    banner: "assets/banners/lives-2-banner.png",
    capa: "assets/posters/lives-2-poster.png",
    capaFallback: "assets/posters/lives-2-poster.png",
    temporadas: [
      {
        numero: 1,
        titulo: "Temporada 1",
        episodios: criarEpisodios(4, {}, {}, {})
      }
    ]
  }
];
