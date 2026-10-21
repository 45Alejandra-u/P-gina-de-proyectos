/**
 * 6-Month (180 Days / 24 Weeks) Comprehensive English Curriculum
 * Structured across 6 Fluency Realms from A1 to B2/C1.
 */

const MONTH_THEMES = [
  {
    month: 1,
    title: "Mes 1: The Outpost (Fundamentos & Fonética de Supervivencia)",
    level: "A1 Principiante",
    color: "#6366f1",
    daysRange: [1, 30],
    description: "Aprende a presentarte, pronunciar sonidos vocálicos que no existen en español, dominar el Verbo To Be y hacer preguntas esenciales.",
    bossDay: 30,
    bossTitle: "Entrevista de Inmigración & Saludo Real"
  },
  {
    month: 2,
    title: "Mes 2: The Daily Valley (Rutinas, Hábitos & Presente Simple)",
    level: "A1-A2 Elemental",
    color: "#10b981",
    daysRange: [31, 60],
    description: "Narra tu día a día, domina las horas, pide comida en restaurantes y conquista la pronunciación de la temida combinación 'TH'.",
    bossDay: 60,
    bossTitle: "Un Día Completo en Londres"
  },
  {
    month: 3,
    title: "Mes 3: Metro City (Conversación Social, Compras & Direcciones)",
    level: "A2 Pre-Intermedio",
    color: "#06b6d4",
    daysRange: [61, 90],
    description: "Muévete por una ciudad extranjera, regatea compras, describe lo que puedes o no hacer (Can/Could) y expresa preferencias.",
    bossDay: 90,
    bossTitle: "La Misión del Turista en Manhattan"
  },
  {
    month: 4,
    title: "Mes 4: The Memory Realm (El Pasado & Storytelling)",
    level: "B1 Intermedio",
    color: "#f59e0b",
    daysRange: [91, 120],
    description: "Relata tus anécdotas, domina la terminación fonética de los verbos regulares (-ed: /t/, /d/, /ɪd/) y los verbos irregulares clave.",
    bossDay: 120,
    bossTitle: "El Interrogatorio del Detective"
  },
  {
    month: 5,
    title: "Mes 5: Horizon Tower (Futuro, Carrera & Negocios)",
    level: "B1-B2 Intermedio Alto",
    color: "#ec4899",
    daysRange: [121, 150],
    description: "Haz planes con Will y Going to, domina entrevistas de trabajo, redacta correos profesionales y usa 'Connected Speech' natural.",
    bossDay: 150,
    bossTitle: "La Entrevista en Silicon Valley"
  },
  {
    month: 6,
    title: "Mes 6: The Fluency Summit (Fluidez Total, Idioms & Debate)",
    level: "B2 Fluido",
    color: "#8b5cf6",
    daysRange: [151, 180],
    description: "Conecta ideas como un nativo usando Phrasal Verbs, Presente Perfecto, modismos culturales y defiende tus puntos de vista con soltura.",
    bossDay: 180,
    bossTitle: "The Grand Fluency TED Talk"
  }
];

// Curated database for core milestone lessons
const CURATED_LESSONS = {
  1: {
    day: 1,
    title: "Primer Contacto: Saludos y Presentaciones",
    month: 1,
    week: 1,
    proTip: "En inglés, la 'H' inicial suena como un suspiro suave y cálido (como empañar un espejo), no como la 'J' fuerte del español.",
    grammarNote: "Usa 'I am' para decir quién eres. Para decir 'mucho gusto', la frase más natural es 'Nice to meet you'.",
    vocab: [
      { word: "Hello", ipa: "/həˈloʊ/", meaning: "Hola", sample: "Hello, my name is Alex." },
      { word: "Nice to meet you", ipa: "/naɪs tu miːt juː/", meaning: "Mucho gusto en conocerte", sample: "Nice to meet you too." },
      { word: "I am", ipa: "/aɪ æm/", meaning: "Yo soy / Yo estoy", sample: "I am from Colombia." },
      { word: "How are you?", ipa: "/haʊ ɑːr juː/", meaning: "¿Cómo estás?", sample: "How are you today?" }
    ],
    speakingChallenge: {
      target: "Hello, my name is Alex. Nice to meet you!",
      translation: "¡Hola, mi nombre es Alex. Mucho gusto en conocerte!",
      phoneticHint: "Suaviza la H de 'Hello' y junta 'meet you' como /miːtʃuː/."
    },
    sentenceBuilder: {
      prompt: "Ordena las palabras para decir: 'Mucho gusto en conocerte'",
      words: ["meet", "Nice", "you", "to"],
      correct: "Nice to meet you",
      explanation: "En inglés, la fórmula fija de cortesía es 'Nice to meet you'. El adjetivo 'Nice' conecta con el verbo 'meet' mediante el infinitivo con 'to' ('to meet'), seguido del pronombre objeto 'you'."
    },
    quiz: {
      question: "¿Cuál es la respuesta más natural a 'How are you?' en una conversación cotidiana?",
      options: [
        "I am fine, thank you, and you?",
        "I'm good, thanks! How about you?",
        "Yes, I am Alex.",
        "Nice to meet you."
      ],
      correctIndex: 1,
      explanation: "'I'm good, thanks! How about you?' es la forma más espontánea y moderna usada por nativos."
    }
  },

  2: {
    day: 2,
    title: "El Secreto del Verbo To Be y Contracciones",
    month: 1,
    week: 1,
    proTip: "Los hablantes nativos casi NUNCA dicen 'I am happy' por separado. Siempre contraen: 'I'm happy', 'He's tired', 'They're ready'.",
    grammarNote: "El verbo To Be significa tanto 'Ser' como 'Estar'. El contexto siempre te dirá cuál es.",
    vocab: [
      { word: "I'm ready", ipa: "/aɪm ˈrɛdi/", meaning: "Estoy listo", sample: "I'm ready to learn English." },
      { word: "She is happy", ipa: "/ʃiː ɪz ˈhæpi/", meaning: "Ella está feliz", sample: "She is happy today." },
      { word: "We are friends", ipa: "/wiː ɑːr frɛndz/", meaning: "Somos amigos", sample: "We are good friends." },
      { word: "Are you sure?", ipa: "/ɑːr juː ʃʊr/", meaning: "¿Estás seguro?", sample: "Are you sure about this?" }
    ],
    speakingChallenge: {
      target: "I am ready to speak English every single day.",
      translation: "Estoy listo para hablar inglés todos los días.",
      phoneticHint: "La 'R' de 'ready' no vibra: curva la punta de la lengua hacia atrás sin tocar el paladar."
    },
    sentenceBuilder: {
      prompt: "Ordena la oración: 'Ella está muy feliz hoy'",
      words: ["today", "She", "is", "happy", "very"],
      correct: "She is very happy today",
      explanation: "Estructura Sujeto (She) + Verbo To Be (is) + Intensificador (very) + Adjetivo (happy) + Expresión de tiempo al final (today)."
    },
    quiz: {
      question: "¿Cómo se contrae 'They are' de forma correcta?",
      options: ["They're", "They'is", "Ther're", "Their're"],
      correctIndex: 0,
      explanation: "'They're' suena exactamente igual que 'their' y 'there'."
    }
  },

  5: {
    day: 5,
    title: "Las Vocales Cortas vs Largas: Ship vs Sheep",
    month: 1,
    week: 1,
    proTip: "El español solo tiene 5 sonidos vocálicos. ¡El inglés tiene más de 14! La diferencia entre /ɪ/ (corta y relajada) y /iː/ (larga y sonriente) cambia significados por completo.",
    grammarNote: "Practica relajar la mandíbula para la /ɪ/ de 'live', 'ship', 'sit'.",
    vocab: [
      { word: "Live", ipa: "/lɪv/", meaning: "Vivir (vocal corta)", sample: "I live in a big city." },
      { word: "Leave", ipa: "/liːv/", meaning: "Irse / Salir (vocal larga)", sample: "Don't leave yet." },
      { word: "Sit", ipa: "/sɪt/", meaning: "Sentarse", sample: "Please sit down." },
      { word: "Seat", ipa: "/siːt/", meaning: "Asiento", sample: "Have a seat." }
    ],
    speakingChallenge: {
      target: "Please have a seat and tell me where you live.",
      translation: "Por favor toma asiento y dime dónde vives.",
      phoneticHint: "Sonríe en 'seat' (/siːt/) y relaja la boca en 'live' (/lɪv/)."
    },
    sentenceBuilder: {
      prompt: "Ordena: 'Yo vivo en una ciudad hermosa'",
      words: ["city", "I", "live", "a", "beautiful", "in"],
      correct: "I live in a beautiful city",
      explanation: "En inglés, el adjetivo siempre antecede al sustantivo que califica: 'a beautiful city' (un/una hermosa ciudad), no 'city beautiful'."
    },
    quiz: {
      question: "¿Cuál palabra tiene el sonido /iː/ largo (sonriendo)?",
      options: ["Fit", "Hit", "Beach", "Bit"],
      correctIndex: 2,
      explanation: "'Beach' tiene la vocal larga /iː/, diferenciándola de palabras con vocal corta relajada."
    }
  },

  15: {
    day: 15,
    title: "Hacer Preguntas Clave: Las 5 Wh- Questions",
    month: 1,
    week: 3,
    proTip: "Las preguntas con Wh- generalmente tienen entonación descendente al final en inglés hablado.",
    grammarNote: "Estructura: Wh- Word + Auxiliar (Do/Is) + Sujeto + Verbo.",
    vocab: [
      { word: "Where", ipa: "/wɛər/", meaning: "¿Dónde?", sample: "Where do you work?" },
      { word: "What", ipa: "/wʌt/", meaning: "¿Qué? / ¿Cuál?", sample: "What is your goal?" },
      { word: "Why", ipa: "/waɪ/", meaning: "¿Por qué?", sample: "Why are you learning English?" },
      { word: "When", ipa: "/wɛn/", meaning: "¿Cuándo?", sample: "When do we start?" }
    ],
    speakingChallenge: {
      target: "Where do you work and what do you do?",
      translation: "¿Dónde trabajas y a qué te dedicas?",
      phoneticHint: "Junta 'What do you' como un fluido /wʌt-də-jə/ o /wʌ-dʒuː/."
    },
    sentenceBuilder: {
      prompt: "Pregunta: '¿Dónde vives tú?'",
      words: ["live?", "do", "you", "Where"],
      correct: "Where do you live?",
      explanation: "Estructura de pregunta con Wh-: Partícula (Where) + Auxiliar del Presente Simple (do) + Sujeto (you) + Verbo en forma base (live?)."
    },
    quiz: {
      question: "¿Cómo preguntas '¿A qué te dedicas?' de forma idiomática?",
      options: [
        "What do you do?",
        "What is your work person?",
        "Where do you make?",
        "Who are you working?"
      ],
      correctIndex: 0,
      explanation: "'What do you do?' es la pregunta estándar para preguntar por la profesión u ocupación."
    }
  },

  30: {
    day: 30,
    title: "👑 BOSS BATTLE MES 1: The Gatekeeper's Visa Interview",
    month: 1,
    week: 4,
    proTip: "Respira hondo. En esta prueba del jefe final del Mes 1 debes demostrar que puedes saludar, decir tu propósito y responder con seguridad.",
    grammarNote: "Integración de: To Be, Wh- questions, saludos y descripciones personales.",
    vocab: [
      { word: "Purpose", ipa: "/ˈpɜːrpəs/", meaning: "Propósito / Motivo", sample: "What is the purpose of your visit?" },
      { word: "Sightseeing", ipa: "/ˈsaɪtˌsiːɪŋ/", meaning: "Turismo", sample: "I am here for sightseeing." },
      { word: "Vacation", ipa: "/veɪˈkeɪʃən/", meaning: "Vacaciones", sample: "I am taking a two-week vacation." }
    ],
    speakingChallenge: {
      target: "Good morning Officer, I am here for vacation and sightseeing for two weeks.",
      translation: "Buenos días oficial, estoy aquí de vacaciones y turismo por dos semanas.",
      phoneticHint: "Pronuncia claro cada término. Mantén un ritmo firme y seguro."
    },
    sentenceBuilder: {
      prompt: "Ordena tu respuesta: 'I am staying at a downtown hotel'",
      words: ["staying", "hotel", "at", "I", "a", "am", "downtown"],
      correct: "I am staying at a downtown hotel",
      explanation: "Presente Continuo para estancias temporales: Sujeto (I) + Verbo auxiliar (am) + Verbo en gerundio (staying) + Preposición de lugar (at) + a downtown hotel."
    },
    quiz: {
      question: "Si el oficial pregunta: 'How long do you plan to stay?', ¿cuál es la mejor respuesta?",
      options: [
        "Yes, I am happy.",
        "Just two weeks, here is my return ticket.",
        "I am from Madrid.",
        "Because I like airplanes."
      ],
      correctIndex: 1,
      explanation: "'How long' pregunta por duración de tiempo. Dar una duración precisa con comprobante es ideal."
    }
  },

  45: {
    day: 45,
    title: "El Truco de la 'TH' Sonora y Sorda en Restaurantes",
    month: 2,
    week: 7,
    proTip: "La combinación TH tiene dos sonidos: sordo (como en 'think' o 'thanks', solo aire entre dientes) y sonoro (como en 'this' o 'that', haciendo vibrar las cuerdas vocales).",
    grammarNote: "Para pedir comida con cortesía, usa 'I would like' o 'Could I have' en lugar de 'I want'.",
    vocab: [
      { word: "Thanks", ipa: "/θæŋks/", meaning: "Gracias (TH sorda)", sample: "Thanks for the recommendation." },
      { word: "This one", ipa: "/ðɪs wʌn/", meaning: "Este (TH sonora)", sample: "Could I have this one?" },
      { word: "Delicious", ipa: "/dɪˈlɪʃəs/", meaning: "Delicioso", sample: "This meal is delicious." }
    ],
    speakingChallenge: {
      target: "Thanks a lot, I think this coffee is absolutely delicious.",
      translation: "Muchas gracias, creo que este café está absolutamente delicioso.",
      phoneticHint: "Contrasta 'Thanks' /θ/ (aire) con 'this' /ð/ (vibración en lengua)."
    },
    sentenceBuilder: {
      prompt: "Ordena: '¿Podría tener un vaso de agua por favor?'",
      words: ["water,", "I", "a", "have", "glass", "of", "please?", "Could"],
      correct: "Could I have a glass of water, please?",
      explanation: "Para pedir algo de forma educada se usa el modal 'Could' + Sujeto (I) + Verbo (have) + Objeto ('a glass of water') + 'please?' al final."
    },
    quiz: {
      question: "¿Cuál es la forma más educada de pedir algo en un café en inglés?",
      options: [
        "Give me coffee now.",
        "I want a coffee.",
        "I'd like an iced coffee, please.",
        "Coffee for me."
      ],
      correctIndex: 2,
      explanation: "'I'd like...' (I would like) es la fórmula estándar de cortesía."
    }
  },

  60: {
    day: 60,
    title: "👑 BOSS BATTLE MES 2: Un Día Completo en Londres",
    month: 2,
    week: 8,
    proTip: "Combina rutinas, la hora, pedir transporte y comida en el metro londinense.",
    grammarNote: "Presente Simple para horarios y peticiones cotidianas.",
    vocab: [
      { word: "Underground", ipa: "/ˈʌndərˌɡraʊnd/", meaning: "El metro de Londres (Tube)", sample: "Where is the nearest underground station?" },
      { word: "Ticket", ipa: "/ˈtɪkɪt/", meaning: "Boleto", sample: "A single ticket to Piccadilly, please." }
    ],
    speakingChallenge: {
      target: "Excuse me, which train goes directly to Central London?",
      translation: "Disculpe, ¿qué tren va directamente al centro de Londres?",
      phoneticHint: "Enlaza 'Excuse me' suavemente y marca el acento en 'di-REC-tly'."
    },
    sentenceBuilder: {
      prompt: "Ordena: 'The train arrives at ten past eight'",
      words: ["at", "arrives", "The", "eight", "past", "train", "ten"],
      correct: "The train arrives at ten past eight",
      explanation: "Sujeto ('The train') + Verbo en 3ra persona con -s ('arrives') + Preposición de hora ('at') + la hora en formato británico ('ten past eight' = ocho y diez)."
    },
    quiz: {
      question: "Si alguien te dice 'Mind the gap', ¿qué te están advirtiendo?",
      options: [
        "Cuidado con tu equipaje.",
        "Cuidado con el espacio entre el andén y el tren.",
        "Que te apures a subir.",
        "Que guardes silencio."
      ],
      correctIndex: 1,
      explanation: "'Mind the gap' es el famoso aviso del metro británico sobre el hueco entre el andén y el vagón."
    }
  },

  90: {
    day: 90,
    title: "👑 BOSS BATTLE MES 3: La Misión del Turista en Manhattan",
    month: 3,
    week: 12,
    proTip: "En Nueva York las calles son rectas: domina 'blocks', 'avenues', 'cross street' y 'turn left/right'.",
    grammarNote: "Preposiciones de lugar y direcciones imperativas.",
    vocab: [
      { word: "Crosswalk", ipa: "/ˈkrɔːsˌwɔːk/", meaning: "Paso de cebra / cruce peatonal", sample: "Use the crosswalk to stay safe." },
      { word: "Three blocks", ipa: "/θriː blɑːks/", meaning: "Tres cuadras / manzanas", sample: "Walk three blocks north." }
    ],
    speakingChallenge: {
      target: "Go straight for three blocks, then turn left at Fifth Avenue.",
      translation: "Sigue derecho por tres cuadras, luego gira a la izquierda en la Quinta Avenida.",
      phoneticHint: "Suelta bien el sonido 'straight' sin agregar una 'e' antes de la 's'."
    },
    sentenceBuilder: {
      prompt: "Ordena la dirección: 'It is located between the museum and the park'",
      words: ["between", "is", "located", "museum", "and", "the", "It", "park", "the"],
      correct: "It is located between the museum and the park",
      explanation: "Estructura pasiva de ubicación: Sujeto neutro (It) + is located + preposición 'between' (entre dos puntos conectados por 'and'): 'between the museum and the park'."
    },
    quiz: {
      question: "¿Cómo preguntas la dirección de forma natural a un transeúnte?",
      options: [
        "Where is museum, tell me?",
        "Excuse me, could you tell me how to get to Central Park?",
        "I need go park now.",
        "Which street park please?"
      ],
      correctIndex: 1,
      explanation: "'Could you tell me how to get to...?' es la fórmula más educada y precisa para pedir direcciones."
    }
  },

  105: {
    day: 105,
    title: "El Truco Secreto del Pasado: Los 3 Sonidos de la Terminación -ED",
    month: 4,
    week: 14,
    proTip: "¡NUNCA pronuncies 'ed' como una sílaba extra a menos que el verbo termine en T o D! 'Worked' suena /wɜːrkt/ (sonido T), 'Played' suena /pleɪd/ (sonido D), y solo 'Wanted' suena /wɒntɪd/.",
    grammarNote: "Regla de oro: Si termina en T o D -> /ɪd/. Si es sorda (p, k, s, ch, sh) -> /t/. El resto -> /d/.",
    vocab: [
      { word: "Watched", ipa: "/wɑːtʃt/", meaning: "Miró (termina en /t/)", sample: "I watched an amazing movie." },
      { word: "Lived", ipa: "/lɪvd/", meaning: "Vivió (termina en /d/)", sample: "She lived in Chicago." },
      { word: "Needed", ipa: "/ˈniːdɪd/", meaning: "Necesitó (termina en /ɪd/)", sample: "We needed some help." }
    ],
    speakingChallenge: {
      target: "Yesterday I worked late, watched a film, and visited my family.",
      translation: "Ayer trabajé hasta tarde, vi una película y visité a mi familia.",
      phoneticHint: "Worked (/t/), watched (/t/), visited (/ɪd/). ¡Siente la diferencia!"
    },
    sentenceBuilder: {
      prompt: "Ordena: 'They decided to travel together'",
      words: ["travel", "They", "decided", "together", "to"],
      correct: "They decided to travel together",
      explanation: "El verbo 'decide' rige infinitivo: Sujeto (They) + Verbo en pasado (decided) + Infinitivo con 'to' (to travel) + Adverbio de compañía (together)."
    },
    quiz: {
      question: "¿Cuál de estos verbos en pasado se pronuncia con sonido /t/ final?",
      options: ["Decided", "Played", "Cooked", "Ended"],
      correctIndex: 2,
      explanation: "'Cook' termina en sonido sordo /k/, por lo que su pasado 'cooked' se pronuncia /kʊkt/ con una 't' seca."
    }
  },

  120: {
    day: 120,
    title: "👑 BOSS BATTLE MES 4: El Interrogatorio del Detective",
    month: 4,
    week: 16,
    proTip: "El detective quiere saber qué estabas haciendo exactamente cuando ocurrió el evento. Combina Pasado Simple y Pasado Continuo.",
    grammarNote: "Acción en progreso (Past Continuous) interrumpida por acción puntual (Past Simple): 'I was sleeping when the alarm rang'.",
    vocab: [
      { word: "Alibi", ipa: "/ˈælɪbaɪ/", meaning: "Coartada", sample: "My alibi is completely solid." },
      { word: "Witness", ipa: "/ˈwɪtnɪs/", meaning: "Testigo", sample: "The witness saw everything." }
    ],
    speakingChallenge: {
      target: "I was having dinner with my friends when the incident occurred at nine PM.",
      translation: "Estaba cenando con mis amigos cuando el incidente ocurrió a las nueve de la noche.",
      phoneticHint: "Enlaza 'was having' y pronuncia con naturalidad 'incident occurred'."
    },
    sentenceBuilder: {
      prompt: "Ordena: 'While she was reading, the telephone suddenly rang'",
      words: ["suddenly", "While", "was", "she", "reading,", "telephone", "rang", "the"],
      correct: "While she was reading, the telephone suddenly rang",
      explanation: "Acción en progreso continua con 'While' (Past Continuous: was reading) interrumpida por una acción puntual en Pasado Simple (the telephone suddenly rang)."
    },
    quiz: {
      question: "¿Qué tiempo verbal describe la acción larga de fondo en el pasado?",
      options: ["Past Continuous (was/were + ing)", "Present Simple", "Future with Will", "Past Perfect"],
      correctIndex: 0,
      explanation: "El Past Continuous establece la escena de lo que estaba transcurriendo en ese momento."
    }
  },

  135: {
    day: 135,
    title: "Connected Speech: Reducciones y Ritmo Nativo",
    month: 5,
    week: 18,
    proTip: "Los hablantes nativos conectan las palabras: 'going to' se convierte en 'gonna', 'want to' en 'wanna', y 'could have' en 'could've'. No es pereza, es la música natural del idioma.",
    grammarNote: "Usa estas reducciones en el habla informal para sonar infinitamente más fluido y entender las películas.",
    vocab: [
      { word: "Gonna", ipa: "/ˈɡənə/", meaning: "Going to (voy a)", sample: "I'm gonna crush this interview." },
      { word: "Wanna", ipa: "/ˈwɑːnə/", meaning: "Want to (quiero)", sample: "Do you wanna grab a coffee?" },
      { word: "Gotta", ipa: "/ˈɡɑːtə/", meaning: "Got to (tengo que)", sample: "I gotta go now." }
    ],
    speakingChallenge: {
      target: "I'm gonna do my best because I really wanna succeed.",
      translation: "Voy a dar lo mejor de mí porque realmente quiero tener éxito.",
      phoneticHint: "Conecta 'gonna do' y 'wanna succeed' con un flujo rítmico continuo sin pausas entrecortadas."
    },
    sentenceBuilder: {
      prompt: "Ordena: 'We are gonna launch the project next week'",
      words: ["gonna", "are", "next", "launch", "project", "We", "week", "the"],
      correct: "We are gonna launch the project next week",
      explanation: "Sujeto (We) + are + reducción informal 'gonna' (going to) + verbo principal (launch) + objeto directo ('the project') + complemento temporal ('next week')."
    },
    quiz: {
      question: "¿A qué frase equivale la reducción hablada 'I gotta'?",
      options: ["I got to (I have to)", "I go today", "I get alone", "I will go"],
      correctIndex: 0,
      explanation: "'I gotta' proviene de 'I have got to', que significa 'tengo que / debo'."
    }
  },

  150: {
    day: 150,
    title: "👑 BOSS BATTLE MES 5: La Entrevista en Silicon Valley",
    month: 5,
    week: 20,
    proTip: "En una entrevista en inglés, demuestra proactividad, liderazgo y habla de tus metas futuras con confianza.",
    grammarNote: "Uso de condicionales y visión futura: 'If hired, I will contribute to...'",
    vocab: [
      { word: "Strengths", ipa: "/strɛŋkθs/", meaning: "Fortalezas", sample: "One of my greatest strengths is problem-solving." },
      { word: "Milestone", ipa: "/ˈmaɪlˌstoʊn/", meaning: "Hito / Logro importante", sample: "We achieved every major milestone." }
    ],
    speakingChallenge: {
      target: "My greatest strength is solving complex problems quickly and collaborating effectively.",
      translation: "Mi mayor fortaleza es resolver problemas complejos rápidamente y colaborar de forma efectiva.",
      phoneticHint: "Articula claramente 'complex problems' y 'collaborating effectively'."
    },
    sentenceBuilder: {
      prompt: "Ordena: 'I am excited about this career opportunity'",
      words: ["this", "am", "excited", "opportunity", "about", "I", "career"],
      correct: "I am excited about this career opportunity",
      explanation: "El adjetivo 'excited' va regido por la preposición 'about': Sujeto (I) + am + excited + about + demostrativo y sustantivo compuesto ('this career opportunity')."
    },
    quiz: {
      question: "Si el reclutador dice: 'Where do you see yourself in five years?', ¿qué busca evaluar?",
      options: [
        "Tu visión a largo plazo, ambición y compromiso profesional.",
        "Tu edad exacta dentro de 5 años.",
        "Dónde vas a vivir geográficamente.",
        "Tu sueldo del año anterior."
      ],
      correctIndex: 0,
      explanation: "Evalúan tu planificación de carrera, ambición alineada a la empresa y metas personales."
    }
  },

  180: {
    day: 180,
    title: "👑 GRAND BOSS BATTLE: The Fluency Summit & TED Talk",
    month: 6,
    week: 24,
    proTip: "¡Has llegado a la cima de los 6 meses (Día 180)! Es hora de hablar con pasión, usando idioms, entonación de orador y fluidez absoluta.",
    grammarNote: "Integración de todo el viaje de 6 meses: desde el día 1 hasta el dominio B2/C1.",
    vocab: [
      { word: "Breakthrough", ipa: "/ˈbreɪkˌθruː/", meaning: "Avance transformador / logro cumbre", sample: "This journey was a personal breakthrough." },
      { word: "Piece of cake", ipa: "/piːs əv keɪk/", meaning: "Pan comido / facilísimo", sample: "Now speaking English is a piece of cake!" },
      { word: "Second nature", ipa: "/ˈsɛkənd ˈneɪtʃər/", meaning: "Algo natural e instintivo", sample: "Thinking in English has become second nature." }
    ],
    speakingChallenge: {
      target: "Consistency is the key: after six months of dedication, speaking English has become second nature.",
      translation: "La constancia es la clave: tras seis meses de dedicación, hablar inglés se ha vuelto algo natural.",
      phoneticHint: "Pronuncia como un auténtico orador internacional: pausas estratégicas, énfasis en 'Consistency' y 'second nature'."
    },
    sentenceBuilder: {
      prompt: "Ordena el mantra final: 'I can now express my ideas freely and with confidence'",
      words: ["with", "freely", "now", "express", "confidence", "I", "can", "my", "and", "ideas"],
      correct: "I can now express my ideas freely and with confidence",
      explanation: "Sujeto (I) + modal (can) + adverbio de tiempo (now) + verbo (express) + objeto ('my ideas') + adverbios y locuciones de modo ('freely and with confidence')."
    },
    quiz: {
      question: "¿Qué significa el idiom 'Hit the nail on the head'?",
      options: [
        "Golpearse la cabeza por error.",
        "Dar exactamente en el clavo / acertar con precisión.",
        "Terminar un trabajo de carpintería.",
        "Estar en desacuerdo con alguien."
      ],
      correctIndex: 1,
      explanation: "'Hit the nail on the head' significa haber dicho o hecho exactamente lo correcto y acertado."
    }
  }
};

// Procedural Generator for any day from 1 to 180
const TOPIC_LIBRARY = [
  { topic: "Saludos y Vida Social", tips: "No traduzcas palabra por palabra; piensa en bloques de significado (chunks).", vocabBase: ["Meet", "Friend", "Glad", "Smile", "Chat"] },
  { topic: "Café, Restaurantes y Comida", tips: "Los camareros usan expresiones cortas como 'For here or to go?' (¿Para aquí o para llevar?).", vocabBase: ["Order", "Dish", "Beverage", "Delicious", "Bill"] },
  { topic: "Trabajo, Carrera y Productividad", tips: "Usa verbos de acción en tu currículum como 'Managed', 'Developed', 'Spearheaded'.", vocabBase: ["Task", "Deadline", "Meeting", "Project", "Teamwork"] },
  { topic: "Viajes, Aeropuerto y Hoteles", tips: "Al pasar por aduanas, sé conciso y mantén documentos a mano.", vocabBase: ["Flight", "Boarding", "Luggage", "Passport", "Reservation"] },
  { topic: "Emociones, Opiniones y Sentimientos", tips: "Decir 'In my humble opinion' o 'From my perspective' suaviza cualquier debate.", vocabBase: ["Excited", "Confident", "Grateful", "Curious", "Inspired"] },
  { topic: "Tecnología, Internet y Futuro", tips: "Palabras técnicas suelen ser préstamos universales, pero cuida el acento nativo.", vocabBase: ["Device", "Network", "Algorithm", "Innovate", "Digital"] },
  { topic: "Naturaleza, Clima y Medio Ambiente", tips: "A los británicos les encanta iniciar conversaciones hablando del clima ('Miserable rain, isn't it?').", vocabBase: ["Breeze", "Storm", "Sunny", "Forecast", "Wilderness"] },
  { topic: "Compras, Dinero y Negociación", tips: "Para preguntar por ofertas: 'Is there any discount available?' o 'Is it on sale?'.", vocabBase: ["Discount", "Receipt", "Affordable", "Cash", "Purchase"] },
  { topic: "Historias, Anécdotas y Memorias", tips: "Los conectores 'Suddenly', 'Out of nowhere' y 'As it turned out' mantienen al oyente intrigado.", vocabBase: ["Remember", "Happened", "Unbelievable", "Memory", "Story"] },
  { topic: "Phrasal Verbs y Modismos Cotidianos", tips: "Aprende los phrasal verbs por contexto emocional, no listas alfabéticas.", vocabBase: ["Find out", "Give up", "Carry on", "Break down", "Turn on"] }
];

function getLessonForDay(dayNumber) {
  if (CURATED_LESSONS[dayNumber]) {
    return CURATED_LESSONS[dayNumber];
  }

  // Generate a rich structured daily module dynamically
  const month = Math.ceil(dayNumber / 30);
  const week = Math.ceil(dayNumber / 7);
  const topicData = TOPIC_LIBRARY[(dayNumber - 1) % TOPIC_LIBRARY.length];
  const dayInMonth = ((dayNumber - 1) % 30) + 1;

  const targetPhrases = [
    `I am practicing my English pronunciation every single day to achieve fluency.`,
    `Could you please explain that again more slowly so I can understand?`,
    `Learning English opened up incredible new opportunities for my personal life.`,
    `The best way to improve your accent is by speaking out loud without fear.`,
    `I really enjoy exploring new concepts and expressing my ideas in English.`
  ];

  const target = targetPhrases[(dayNumber - 1) % targetPhrases.length];

  return {
    day: dayNumber,
    title: `Día ${dayNumber}: ${topicData.topic} - Parte ${((dayNumber % 3) + 1)}`,
    month: month,
    week: week,
    proTip: topicData.tips,
    grammarNote: `Enfoque pedagógico del Día ${dayNumber}: Consolidación de estructuras del Mes ${month} y automatización de fluidez auditiva.`,
    vocab: topicData.vocabBase.map((v, i) => ({
      word: v,
      ipa: `/${v.toLowerCase()}/`,
      meaning: `Término clave de ${topicData.topic.toLowerCase()}`,
      sample: `${v} is an important part of our daily communication.`
    })),
    speakingChallenge: {
      target: target,
      translation: "Traducción orientativa: Práctica de fluidez y ritmo natural.",
      phoneticHint: "Mantén un flujo continuo de respiración y conecta las consonantes finales con las vocales iniciales siguientes."
    },
    sentenceBuilder: {
      prompt: `Ordena la frase de práctica del Día ${dayNumber}:`,
      words: ["English", "Every", "I", "practice", "day"],
      correct: "Every day I practice English",
      explanation: "En inglés, el orden estándar es Sujeto (I) + Verbo (practice) + Objeto (English). Los complementos de tiempo como 'Every day' se pueden colocar al principio o al final de la oración."
    },
    quiz: {
      question: `¿Cuál es la mejor estrategia para dominar el tema de hoy (${topicData.topic})?`,
      options: [
        "Repetir las frases en voz alta y usarlas en situaciones cotidianas.",
        "Solo leerlas en silencio una vez.",
        "Memorizar reglas sin hablar.",
        "Traducir palabra por palabra al español."
      ],
      correctIndex: 0,
      explanation: "El método activo de pronunciación en voz alta y activación en contexto garantiza la retención a largo plazo."
    }
  };
}

// Export to window
window.curriculum = {
  MONTH_THEMES,
  CURATED_LESSONS,
  getLessonForDay
};
