/*
  CATÁLOGO CENTRAL — NETFLIX 2%
  Edite os dados das séries aqui. Os episódios são gerados automaticamente
  pela quantidade informada em criarEpisodios(). Para cadastrar vídeos, cole cada ID
  no campo vazio do número correspondente dentro do objeto de IDs da série.
*/
function criarEpisodios(quantidade, idsVideos = {}) {
  return Array.from({ length: quantidade }, (_, indice) => {
    const numero = indice + 1;
    const numeroFormatado = String(numero).padStart(3, "0");

    return {
      numero,
      titulo: `Episódio ${numeroFormatado}`,
      descricao: "Descrição do episódio será adicionada.",
      duracao: "A definir",
      // Cole o ID correspondente no objeto idsVideos da série, usando o número do episódio.
      youtubeId: idsVideos[numero] || ""
    };
  });
}

const catalogo = [
  {
    id: "vida-2",
    numero: "01",
    titulo: "A VIDA 2%",
    categoria: "DESENVOLVIMENTO PESSOAL",
    descricao: "Uma série sobre escolhas, disciplina e transformação. Um convite para questionar hábitos e construir uma vida com mais intenção.",
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
        4: "", // Episódio 004
        5: "", // Episódio 005
        6: "", // Episódio 006
        7: "", // Episódio 007
        8: "", // Episódio 008
        9: "", // Episódio 009
        10: "", // Episódio 010
        11: "", // Episódio 011
        12: "", // Episódio 012
        13: "", // Episódio 013
        14: "", // Episódio 014
        15: "", // Episódio 015
        16: "", // Episódio 016
        17: "", // Episódio 017
        18: "", // Episódio 018
        19: "", // Episódio 019
        20: "", // Episódio 020
        21: "", // Episódio 021
        22: "", // Episódio 022
        23: "", // Episódio 023
        24: "", // Episódio 024
        25: "", // Episódio 025
        26: "", // Episódio 026
        27: "", // Episódio 027
        28: "", // Episódio 028
        29: "", // Episódio 029
        30: "", // Episódio 030
        31: "", // Episódio 031
        32: "", // Episódio 032
        33: "", // Episódio 033
        34: "", // Episódio 034
        35: "", // Episódio 035
        36: "", // Episódio 036
        37: "", // Episódio 037
        38: "", // Episódio 038
        39: "", // Episódio 039
        40: "", // Episódio 040
        41: "", // Episódio 041
        42: "", // Episódio 042
        43: "", // Episódio 043
        44: "", // Episódio 044
        45: "", // Episódio 045
        46: "", // Episódio 046
        47: "", // Episódio 047
        48: "", // Episódio 048
        49: "", // Episódio 049
        50: "", // Episódio 050
        51: "", // Episódio 051
        52: "", // Episódio 052
        53: "", // Episódio 053
        54: "", // Episódio 054
        55: "", // Episódio 055
        56: "", // Episódio 056
        57: "", // Episódio 057
        58: "", // Episódio 058
        59: "", // Episódio 059
        60: "", // Episódio 060
        61: "", // Episódio 061
        62: "", // Episódio 062
        63: "", // Episódio 063
        64: "", // Episódio 064
        65: "", // Episódio 065
        66: "", // Episódio 066
        67: "", // Episódio 067
        68: "", // Episódio 068
        69: "", // Episódio 069
        70: "", // Episódio 070
        71: "", // Episódio 071
        72: "", // Episódio 072
        73: "", // Episódio 073
        74: "", // Episódio 074
        75: "", // Episódio 075
        76: "", // Episódio 076
        77: "", // Episódio 077
        78: "", // Episódio 078
        79: "", // Episódio 079
        80: "", // Episódio 080
        81: "", // Episódio 081
        82: "", // Episódio 082
        83: "", // Episódio 083
        84: "", // Episódio 084
        85: "", // Episódio 085
        86: "", // Episódio 086
        87: "", // Episódio 087
        88: "", // Episódio 088
        89: "", // Episódio 089
        90: "", // Episódio 090
        91: "", // Episódio 091
        92: "", // Episódio 092
        93: "", // Episódio 093
        94: "", // Episódio 094
        95: "", // Episódio 095
        96: "", // Episódio 096
        97: "", // Episódio 097
        98: "", // Episódio 098
        99: "", // Episódio 099
        100: "", // Episódio 100
        101: "", // Episódio 101
        102: "", // Episódio 102
        103: "", // Episódio 103
        104: "", // Episódio 104
        105: "", // Episódio 105
        106: "", // Episódio 106
        107: "", // Episódio 107
        108: "", // Episódio 108
        109: "", // Episódio 109
        110: "", // Episódio 110
        111: "", // Episódio 111
        112: "", // Episódio 112
        113: "", // Episódio 113
        114: "", // Episódio 114
        115: "", // Episódio 115
        116: "", // Episódio 116
        117: "", // Episódio 117
        118: "", // Episódio 118
        119: "", // Episódio 119
        120: "", // Episódio 120
        121: "", // Episódio 121
        122: "", // Episódio 122
        123: "", // Episódio 123
        124: "", // Episódio 124
        125: "", // Episódio 125
        126: "", // Episódio 126
        127: "", // Episódio 127
        128: "", // Episódio 128
        129: "", // Episódio 129
        130: "", // Episódio 130
        131: "", // Episódio 131
        132: "", // Episódio 132
        133: "", // Episódio 133
        134: "", // Episódio 134
        135: "", // Episódio 135
        136: "", // Episódio 136
        137: "", // Episódio 137
        138: "", // Episódio 138
        139: "", // Episódio 139
        140: "", // Episódio 140
        141: "", // Episódio 141
        142: "", // Episódio 142
        143: "", // Episódio 143
        144: "", // Episódio 144
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
        182: "", // Episódio 182
        183: "", // Episódio 183
        184: "", // Episódio 184
        185: "", // Episódio 185
        186: "", // Episódio 186
        187: "", // Episódio 187
        188: "", // Episódio 188
        189: "", // Episódio 189
        190: "", // Episódio 190
        191: "", // Episódio 191
        192: "", // Episódio 192
        193: "", // Episódio 193
        194: "", // Episódio 194
        195: "", // Episódio 195
        196: "", // Episódio 196
        197: "", // Episódio 197
        198: "", // Episódio 198
        199: "", // Episódio 199
        200: "", // Episódio 200
        201: "", // Episódio 201
        202: "", // Episódio 202
        203: "", // Episódio 203
        204: "", // Episódio 204
        205: "", // Episódio 205
        206: "", // Episódio 206
        207: "", // Episódio 207
        208: "", // Episódio 208
        209: "", // Episódio 209
        210: "", // Episódio 210
        211: "", // Episódio 211
        212: "", // Episódio 212
        213: "", // Episódio 213
        214: "", // Episódio 214
        215: "", // Episódio 215
        216: "", // Episódio 216
        217: "", // Episódio 217
        218: "", // Episódio 218
        219: "", // Episódio 219
        220: "", // Episódio 220
        221: "", // Episódio 221
        222: "", // Episódio 222
        223: "", // Episódio 223
        224: "", // Episódio 224
        225: "", // Episódio 225
        226: "", // Episódio 226
        227: "", // Episódio 227
        228: "", // Episódio 228
        229: "", // Episódio 229
        230: "", // Episódio 230
        231: "", // Episódio 231
        232: "", // Episódio 232
        233: "", // Episódio 233
        234: "", // Episódio 234
        235: "", // Episódio 235
        236: "", // Episódio 236
        237: "", // Episódio 237
        238: "", // Episódio 238
        239: "", // Episódio 239
        240: "", // Episódio 240
        241: "", // Episódio 241
        242: "", // Episódio 242
        243: "", // Episódio 243
        244: "", // Episódio 244
        245: "", // Episódio 245
        }) }
    ]
  },
  {
    id: "retencao-48-leis",
    numero: "02",
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
        1: "", // Episódio 001
        2: "", // Episódio 002
        3: "", // Episódio 003
        4: "", // Episódio 004
        5: "", // Episódio 005
        6: "", // Episódio 006
        }) }
    ]
  },
  {
    id: "voz-dos-2",
    numero: "03",
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
        1: "", // Episódio 001
        2: "", // Episódio 002
        3: "", // Episódio 003
        }) }
    ]
  }
];
