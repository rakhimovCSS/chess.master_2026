import { Grandmaster, StrategyGuide } from '../types';

export const GRANDMASTERS: Grandmaster[] = [
  {
    id: 'nodirbek',
    name: 'Nodirbek Abdusattorov',
    country: "O'zbekiston",
    countryCode: 'UZ',
    birthYear: 2004,
    peakRating: 2784,
    title: 'Xalqaro Grossmeyster',
    photoUrl: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=800&auto=format&fit=crop',
    bio: "O'zbekistonning eng yorqin shaxmat yulduzi. 2021-yilda 17 yoshida Rapid bo'yicha eng yosh Jahon chempioni bo'lib, Magnus Karlsenni mag'lubiyatga uchratgan. 2022-yilgi Chennay Olimpiadasida 1-taxtada O'zbekiston terma jamoasini tarixiy chempionlikka olib chiqqan.",
    achievements: [
      "2021 Jahon Rapid Chempioni (Tarixdagi eng yosh)",
      "44-Shaxmat Olimpiadasi Chempioni (Chennay 2022)",
      "Dunyo TOP-10 reytingida barqaror o'rin",
      "Prague Chess Festival g'olibi"
    ],
    quote: "Har bir mag'lubiyat — keyingi g'alaba uchun eng qimmatli darslikdir."
  },
  {
    id: 'magnus',
    name: 'Magnus Carlsen',
    country: 'Norvegiya',
    countryCode: 'NO',
    birthYear: 1990,
    peakRating: 2882,
    title: '16-Jahon Chempioni',
    photoUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=800&auto=format&fit=crop',
    bio: "Shaxmat tarixidagi eng yuqori ELO reytingi (2882) sohibi. 2013-yildan 2023-yilgacha klassik shaxmat bo'yicha Jahon toji egasi. Uning chuqur pozitsion tushunchasi va deyarli xatosiz o'yini uni zamonamizning eng buyuk shaxmatchisiga aylantirdi.",
    achievements: [
      "5 karra Klassik Jahon Chempioni",
      "Tarixdagi eng yuqori reyting: 2882 ELO",
      "Bir necha karra Rapid va Blitz Jahon Chempioni",
      "125 o'yindan iborat mag'lubiyatsiz seriya"
    ],
    quote: "Men shunchaki eng to'g'ri yurishni topishga va raqibimni qiyin ahvolga solishga harakat qilaman."
  },
  {
    id: 'kasparov',
    name: 'Garry Kasparov',
    country: 'Rossiya / Xorvatiya',
    countryCode: 'HR',
    birthYear: 1963,
    peakRating: 2851,
    title: '13-Jahon Chempioni',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
    bio: "1985-yilda 22 yoshida Anatoliy Karpovni yengib, tarixdagi eng yosh Jahon chempioniga aylangan. 15 yil davomida (1985-2000) dunyo shaxmat tojini o'zida saqlab qolgan va 20 yil ketma-ket dunyo reytingi 1-pog'onasida turgan tirik afsona.",
    achievements: [
      "13-Jahon Chempioni (1985–2000)",
      "20 yil uzluksiz dunyo №1 reytingi",
      "11 karra Shaxmat Oskari sohibi",
      "Deep Blue kompyuteriga qarshi tarixiy matchlar"
    ],
    quote: "Shaxmat — bu aqlning ruhiy jangi, unda faqat irodasi mustahkamlar g'olib bo'ladi."
  },
  {
    id: 'qosimjonov',
    name: 'Rustam Qosimjonov',
    country: "O'zbekiston",
    countryCode: 'UZ',
    birthYear: 1979,
    peakRating: 2715,
    title: 'FIDE Jahon Chempioni (2004)',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    bio: "2004-yilda Liviyaning Tripoli shahrida o'tkazilgan chempionatda Maykl Adamsni finalda mag'lub etib, O'zbekiston tarixida birinchi FIDE Jahon chempioni unvoniga sazovor bo'lgan. Keyinchalik Anand va Karuana kabi yulduzlarga bosh murabbiy bo'lgan.",
    achievements: [
      "FIDE Jahon Chempioni (2004)",
      "Osiyo chempioni (1998)",
      "O'zbekiston iftixori faxriy unvoni",
      "Viswanathan Anandning Jahon chempionligi sekundant-murabbiyi"
    ],
    quote: "Strategiya bu nima qilishni bilish, taktika esa biror narsa qilish mumkin bo'lganda to'g'ri harakat qilishdir."
  }
];

export const STRATEGY_GUIDES: StrategyGuide[] = [
  {
    id: 'center-control',
    title: 'Markazni Nazorat Qilish',
    category: 'strategy',
    categoryName: 'Asosiy qoida',
    level: 'Boshlang\'ich',
    description: "Taxtaning markazi (e4, e5, d4, d5 kataklari) shaxmatning yuragi hisoblanadi. Markazni nazorat qilgan tomon butun taxta bo'ylab donalarini erkin harakatlantirish imkoniyatiga ega bo'ladi.",
    keyPoints: [
      "Ilk yurishlarda piyodalarni markazga suring (1.e4 yoki 1.d4)",
      "Otlar va fillarni markaziy kataklarga qarata joylashtiring",
      "Raqibingiz markazga osongina kirib kelishiga yo'l qo'ymang"
    ],
    iconName: 'Target'
  },
  {
    id: 'piece-development',
    title: 'Donalarni Faol Rivojlantirish',
    category: 'opening',
    categoryName: 'Debyut qoidasi',
    level: 'Boshlang\'ich',
    description: "O'yin boshida bir xil dona bilan bir necha marta yurish qilmang. Har bir yurishingiz yangi donani (avval yengil donalar: otlar va fillar) jangga kiritishga xizmat qilishi kerak.",
    keyPoints: [
      "Avval otlarni, keyin fillarni o'yinga kiriting",
      "Vazirni debyutda erta chiqarmang — uni raqib quvib yurishi oson",
      "To'ralarni ochiq vertikallarga (chiziqlarga) joylashtirishni rejalashtiring"
    ],
    iconName: 'Zap'
  },
  {
    id: 'king-safety',
    title: 'Shoh Xavfsizligi va Rokirovka',
    category: 'tactics',
    categoryName: 'Xavfsizlik',
    level: 'Boshlang\'ich',
    description: "Markazda qolib ketgan shoh oson nishonga aylanadi. O'yinning dastlabki 7-10 yurishida rokirovka (shoh va to'ra o'rnini almashtirish) qilib, shohni burchakdagi xavfsiz boshpanaga o'tkazish shart.",
    keyPoints: [
      "Qisqa rokirovka (0-0) tezroq va xavfsizroq hisoblanadi",
      "Shoh oldidagi 3 ta himoyachi piyodani asossiz oldinga surmang",
      "Markazdagi yo'llar ochilishidan oldin rokirovkani bajaring"
    ],
    iconName: 'Shield'
  },
  {
    id: 'italian-game',
    title: 'Italyancha O\'yin (Giuoco Piano)',
    category: 'opening',
    categoryName: 'Mashhur Debyut',
    level: 'O\'rta',
    moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4',
    description: "Dunyodagi eng qadimiy va o'rganish uchun eng qulay debyutlardan biri. Oqlar f7 zaif nuqtasiga hujum uyushtiradi va markazni tez egallashni maqsad qiladi.",
    keyPoints: [
      "Oqlarning fily c4 katagidan qora shohning eng zaif f7 katagiga qaraydi",
      "Keyingi yurishlarda c3 va d4 bilan kuchli markaz hosil qilish mumkin",
      "Ochiq va qiziqarli hujumkor pozitsiyalarga olib keladi"
    ],
    iconName: 'BookOpen'
  },
  {
    id: 'sicilian-defense',
    title: 'Sitsiliyancha Himoya',
    category: 'opening',
    categoryName: 'Mashhur Debyut',
    level: 'Ilg\'or',
    moves: '1. e4 c5',
    description: "Qoralar uchun 1.e4 ga qarshi eng mashhur va eng o'tkir javob. Qoralar nosimmetrik kurash boshlaydi va c-vertikali orqali yarim-ochiq chiziqda faol kontr-o'yin olib boradi.",
    keyPoints: [
      "Karpov, Kasparov va Fisherning eng sevimli qurollaridan biri",
      "Durang emas, faqat g'alaba uchun o'ynaydigan o'yinchilar tanlovi",
      "Murakkab taktika va har ikki tomon uchun chuqur hisob-kitobni talab qiladi"
    ],
    iconName: 'Flame'
  },
  {
    id: 'endgame-principles',
    title: 'Endshpil Qonunlari',
    category: 'endgame',
    categoryName: 'Yakuniy qism',
    level: 'O\'rta',
    description: "Taxtadagi ko'pchilik donalar almashib ketgach, shoh xavfsiz boshpanadan chiqib, faol hujumchiga aylanadi. O'tkinchi piyodani vazirga aylantirish asosiy maqsadga aylanadi.",
    keyPoints: [
      "Endshpilda shohingizni darhol markazga faollashtiring",
      "O'tkinchi piyoda (Passed Pawn) g'alaba kalitidir",
      "To'ralarni o'tkinchi piyodalarning orqasiga joylashtiring"
    ],
    iconName: 'Award'
  }
];
