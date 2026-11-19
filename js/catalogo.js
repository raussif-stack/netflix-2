/*
  CATÁLOGO CENTRAL — NETFLIX 2%
  Edite os dados das séries aqui. Os episódios são gerados automaticamente
  pela quantidade informada em criarEpisodios(). Para cadastrar títulos, preencha o objeto
  titulosEpisodios de cada série. Os IDs do YouTube continuam no objeto idsVideos.
*/
function criarEpisodios(quantidade, idsVideos = {}, titulosEpisodios = {}) {
  return Array.from({ length: quantidade }, (_, indice) => {
    const numero = indice + 1;
    const numeroFormatado = String(numero).padStart(3, "0");

    return {
      numero,
      titulo: `Episódio ${numeroFormatado}`,
      // Preencha o título personalizado no objeto titulosEpisodios da série.
      descricao: titulosEpisodios[numero] || "",
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
        }, {
          // Escreva o título de cada episódio entre aspas. Ex.: 1: "Meu título"
          1: "Título", // Título do Episódio 001
          2: "", // Título do Episódio 002
          3: "", // Título do Episódio 003
          4: "", // Título do Episódio 004
          5: "", // Título do Episódio 005
          6: "", // Título do Episódio 006
          7: "", // Título do Episódio 007
          8: "", // Título do Episódio 008
          9: "", // Título do Episódio 009
          10: "", // Título do Episódio 010
          11: "", // Título do Episódio 011
          12: "", // Título do Episódio 012
          13: "", // Título do Episódio 013
          14: "", // Título do Episódio 014
          15: "", // Título do Episódio 015
          16: "", // Título do Episódio 016
          17: "", // Título do Episódio 017
          18: "", // Título do Episódio 018
          19: "", // Título do Episódio 019
          20: "", // Título do Episódio 020
          21: "", // Título do Episódio 021
          22: "", // Título do Episódio 022
          23: "", // Título do Episódio 023
          24: "", // Título do Episódio 024
          25: "", // Título do Episódio 025
          26: "", // Título do Episódio 026
          27: "", // Título do Episódio 027
          28: "", // Título do Episódio 028
          29: "", // Título do Episódio 029
          30: "", // Título do Episódio 030
          31: "", // Título do Episódio 031
          32: "", // Título do Episódio 032
          33: "", // Título do Episódio 033
          34: "", // Título do Episódio 034
          35: "", // Título do Episódio 035
          36: "", // Título do Episódio 036
          37: "", // Título do Episódio 037
          38: "", // Título do Episódio 038
          39: "", // Título do Episódio 039
          40: "", // Título do Episódio 040
          41: "", // Título do Episódio 041
          42: "A Lua Está Fazendo Você Recaír no NoFap (Ninguém Te Contou Isso)", // Título do Episódio 042
          43: "", // Título do Episódio 043
          44: "", // Título do Episódio 044
          45: "", // Título do Episódio 045
          46: "", // Título do Episódio 046
          47: "", // Título do Episódio 047
          48: "", // Título do Episódio 048
          49: "", // Título do Episódio 049
          50: "", // Título do Episódio 050
          51: "", // Título do Episódio 051
          52: "", // Título do Episódio 052
          53: "", // Título do Episódio 053
          54: "", // Título do Episódio 054
          55: "", // Título do Episódio 055
          56: "", // Título do Episódio 056
          57: "", // Título do Episódio 057
          58: "", // Título do Episódio 058
          59: "", // Título do Episódio 059
          60: "", // Título do Episódio 060
          61: "", // Título do Episódio 061
          62: "", // Título do Episódio 062
          63: "", // Título do Episódio 063
          64: "", // Título do Episódio 064
          65: "", // Título do Episódio 065
          66: "", // Título do Episódio 066
          67: "", // Título do Episódio 067
          68: "", // Título do Episódio 068
          69: "", // Título do Episódio 069
          70: "", // Título do Episódio 070
          71: "", // Título do Episódio 071
          72: "", // Título do Episódio 072
          73: "", // Título do Episódio 073
          74: "", // Título do Episódio 074
          75: "", // Título do Episódio 075
          76: "", // Título do Episódio 076
          77: "", // Título do Episódio 077
          78: "", // Título do Episódio 078
          79: "", // Título do Episódio 079
          80: "", // Título do Episódio 080
          81: "", // Título do Episódio 081
          82: "", // Título do Episódio 082
          83: "", // Título do Episódio 083
          84: "", // Título do Episódio 084
          85: "", // Título do Episódio 085
          86: "", // Título do Episódio 086
          87: "", // Título do Episódio 087
          88: "", // Título do Episódio 088
          89: "", // Título do Episódio 089
          90: "", // Título do Episódio 090
          91: "", // Título do Episódio 091
          92: "", // Título do Episódio 092
          93: "", // Título do Episódio 093
          94: "", // Título do Episódio 094
          95: "", // Título do Episódio 095
          96: "", // Título do Episódio 096
          97: "", // Título do Episódio 097
          98: "", // Título do Episódio 098
          99: "", // Título do Episódio 099
          100: "", // Título do Episódio 100
          101: "", // Título do Episódio 101
          102: "", // Título do Episódio 102
          103: "", // Título do Episódio 103
          104: "", // Título do Episódio 104
          105: "", // Título do Episódio 105
          106: "", // Título do Episódio 106
          107: "", // Título do Episódio 107
          108: "", // Título do Episódio 108
          109: "", // Título do Episódio 109
          110: "", // Título do Episódio 110
          111: "", // Título do Episódio 111
          112: "", // Título do Episódio 112
          113: "", // Título do Episódio 113
          114: "", // Título do Episódio 114
          115: "", // Título do Episódio 115
          116: "", // Título do Episódio 116
          117: "", // Título do Episódio 117
          118: "", // Título do Episódio 118
          119: "", // Título do Episódio 119
          120: "", // Título do Episódio 120
          121: "", // Título do Episódio 121
          122: "", // Título do Episódio 122
          123: "", // Título do Episódio 123
          124: "", // Título do Episódio 124
          125: "", // Título do Episódio 125
          126: "", // Título do Episódio 126
          127: "", // Título do Episódio 127
          128: "", // Título do Episódio 128
          129: "", // Título do Episódio 129
          130: "", // Título do Episódio 130
          131: "", // Título do Episódio 131
          132: "", // Título do Episódio 132
          133: "", // Título do Episódio 133
          134: "", // Título do Episódio 134
          135: "", // Título do Episódio 135
          136: "", // Título do Episódio 136
          137: "", // Título do Episódio 137
          138: "", // Título do Episódio 138
          139: "", // Título do Episódio 139
          140: "", // Título do Episódio 140
          141: "", // Título do Episódio 141
          142: "", // Título do Episódio 142
          143: "", // Título do Episódio 143
          144: "", // Título do Episódio 144
          145: "", // Título do Episódio 145
          146: "", // Título do Episódio 146
          147: "", // Título do Episódio 147
          148: "", // Título do Episódio 148
          149: "", // Título do Episódio 149
          150: "", // Título do Episódio 150
          151: "", // Título do Episódio 151
          152: "", // Título do Episódio 152
          153: "", // Título do Episódio 153
          154: "", // Título do Episódio 154
          155: "", // Título do Episódio 155
          156: "", // Título do Episódio 156
          157: "", // Título do Episódio 157
          158: "", // Título do Episódio 158
          159: "", // Título do Episódio 159
          160: "", // Título do Episódio 160
          161: "", // Título do Episódio 161
          162: "", // Título do Episódio 162
          163: "", // Título do Episódio 163
          164: "", // Título do Episódio 164
          165: "", // Título do Episódio 165
          166: "", // Título do Episódio 166
          167: "", // Título do Episódio 167
          168: "", // Título do Episódio 168
          169: "", // Título do Episódio 169
          170: "", // Título do Episódio 170
          171: "", // Título do Episódio 171
          172: "", // Título do Episódio 172
          173: "", // Título do Episódio 173
          174: "", // Título do Episódio 174
          175: "", // Título do Episódio 175
          176: "", // Título do Episódio 176
          177: "", // Título do Episódio 177
          178: "", // Título do Episódio 178
          179: "", // Título do Episódio 179
          180: "", // Título do Episódio 180
          181: "", // Título do Episódio 181
          182: "", // Título do Episódio 182
          183: "", // Título do Episódio 183
          184: "", // Título do Episódio 184
          185: "", // Título do Episódio 185
          186: "", // Título do Episódio 186
          187: "", // Título do Episódio 187
          188: "", // Título do Episódio 188
          189: "", // Título do Episódio 189
          190: "", // Título do Episódio 190
          191: "", // Título do Episódio 191
          192: "", // Título do Episódio 192
          193: "", // Título do Episódio 193
          194: "", // Título do Episódio 194
          195: "", // Título do Episódio 195
          196: "", // Título do Episódio 196
          197: "", // Título do Episódio 197
          198: "", // Título do Episódio 198
          199: "", // Título do Episódio 199
          200: "", // Título do Episódio 200
          201: "", // Título do Episódio 201
          202: "", // Título do Episódio 202
          203: "", // Título do Episódio 203
          204: "", // Título do Episódio 204
          205: "", // Título do Episódio 205
          206: "", // Título do Episódio 206
          207: "", // Título do Episódio 207
          208: "", // Título do Episódio 208
          209: "", // Título do Episódio 209
          210: "", // Título do Episódio 210
          211: "", // Título do Episódio 211
          212: "", // Título do Episódio 212
          213: "", // Título do Episódio 213
          214: "", // Título do Episódio 214
          215: "", // Título do Episódio 215
          216: "", // Título do Episódio 216
          217: "", // Título do Episódio 217
          218: "", // Título do Episódio 218
          219: "", // Título do Episódio 219
          220: "", // Título do Episódio 220
          221: "", // Título do Episódio 221
          222: "", // Título do Episódio 222
          223: "", // Título do Episódio 223
          224: "", // Título do Episódio 224
          225: "", // Título do Episódio 225
          226: "", // Título do Episódio 226
          227: "", // Título do Episódio 227
          228: "", // Título do Episódio 228
          229: "", // Título do Episódio 229
          230: "", // Título do Episódio 230
          231: "", // Título do Episódio 231
          232: "", // Título do Episódio 232
          233: "", // Título do Episódio 233
          234: "", // Título do Episódio 234
          235: "", // Título do Episódio 235
          236: "", // Título do Episódio 236
          237: "", // Título do Episódio 237
          238: "", // Título do Episódio 238
          239: "", // Título do Episódio 239
          240: "", // Título do Episódio 240
          241: "", // Título do Episódio 241
          242: "", // Título do Episódio 242
          243: "", // Título do Episódio 243
          244: "", // Título do Episódio 244
          245: "", // Título do Episódio 245
        
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
        1: "y50TIL2I68g", // Episódio 001
        2: "KBYdwCPXAK4", // Episódio 002
        3: "lH275gpnLk0", // Episódio 003
        }, {
          // Escreva o título de cada episódio entre aspas. Ex.: 1: "Meu título"
          1: "", // Título do Episódio 001
          2: "", // Título do Episódio 002
          3: "", // Título do Episódio 003
        
        }) }
    ]
  }
];
