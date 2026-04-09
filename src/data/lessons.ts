export type StepType = 'learn' | 'mcq';

export interface LearnStep {
  type: 'learn';
  icon: 'learn' | 'warn' | 'quiz' | 'write';
  title: string;
  content: string;
  bullets?: string[];
  highlight?: string;
}

export interface MCQStep {
  type: 'mcq';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type LessonStep = LearnStep | MCQStep;

export interface Lesson {
  id: string;
  module: string;
  title: string;
  description: string;
  xp: number;
  status: 'completed' | 'in-progress' | 'locked';
  steps: LessonStep[];
}

export const lessons: Lesson[] = [
  // ─── LESSON 1: BECE IE/EI Spelling Rules ───────────────────────────────────
  {
    id: 'bece-spelling-ie-ei',
    module: 'BECE',
    title: 'IE / EI Spelling Rules',
    description: 'Master the classic "I before E except after C" rule and learn tricky exceptions.',
    xp: 150,
    status: 'in-progress',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'What is an Essay?',
        content:
          'The word "words" is central to all these ideas. Words are important as they form the backbone of every piece of writing. Therefore, we need to spell what we say and write correctly — otherwise our meaning becomes unclear. Spelling words incorrectly, such as "S.A." for "essay", can cause confusion and sometimes render writing totally meaningless.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Tricky Spelling: IE & EI Words',
        content:
          'Let us look at "IE" and "EI" words — they can be quite tricky! There is a helpful guideline, called a mnemonic, to remember: a mnemonic is a prompt or rule, sometimes formed from letters, to help us remember something.',
        highlight: '"I" before "E" except after "C"',
        bullets: [
          'Words containing "IE" — the letter I usually comes before E.',
          'When the letters follow the letter C, the order reverses: E comes before I.',
          'So: receive (after C → EI), believe (no C → IE), grief (no C → IE), conceive (after C → EI).',
        ],
      },
      {
        type: 'mcq',
        question: 'Which spelling is CORRECT?',
        options: ['recieve', 'receive', 'receve', 'recieeve'],
        correctIndex: 1,
        explanation: '"Receive" follows the rule: the letters come after C, so E comes before I → "ei".',
      },
      {
        type: 'mcq',
        question: 'Which spelling is CORRECT?',
        options: ['beleive', 'beleve', 'believe', 'beleeve'],
        correctIndex: 2,
        explanation: '"Believe" — no C before the IE, so I comes before E → "ie".',
      },
      {
        type: 'mcq',
        question: 'Which spelling is CORRECT?',
        options: ['greif', 'grefe', 'grieve', 'grief'],
        correctIndex: 3,
        explanation: '"Grief" — no C before the IE, so I comes before E → "ie".',
      },
      {
        type: 'mcq',
        question: 'Which spelling is CORRECT?',
        options: ['concieve', 'conceive', 'conceve', 'conciive'],
        correctIndex: 1,
        explanation: '"Conceive" — the letters follow C, so E comes before I → "ei".',
      },
      {
        type: 'mcq',
        question: 'Which spelling is CORRECT?',
        options: ['breif', 'breef', 'brief', 'brife'],
        correctIndex: 2,
        explanation: '"Brief" — no C, so I before E → "ie".',
      },
      {
        type: 'learn',
        icon: 'warn',
        title: 'Warning: Exceptions to the Rule!',
        content:
          'In English, there are plenty of exceptions. Just when you think you have mastered the IE/EI rule, watch out! Treat the rule as a guideline rather than a hard-and-fast rule.',
        bullets: [
          'Where the vowel sounds like "A" — e.g. neighbour, reign, vein.',
          'When the vowel sounds like "AA-EE" — e.g. height.',
          'Words to memorise: their, friend, ancient, niece, weird, foreign, leisure.',
        ],
      },
      {
        type: 'mcq',
        question: 'Which word is an EXCEPTION to the IE/EI rule (correctly spelled despite looking unusual)?',
        options: ['nieghbour', 'neighbour', 'naighbour', 'neghibour'],
        correctIndex: 1,
        explanation: '"Neighbour" is an exception — the vowel sounds like "A" so E comes before I, even though there is no C.',
      },
      {
        type: 'mcq',
        question: 'Which spelling is CORRECT?',
        options: ['reciever', 'reciver', 'receiver', 'recievere'],
        correctIndex: 2,
        explanation: '"Receiver" — after C, so EI. The word ends in -er: receiver.',
      },
      {
        type: 'mcq',
        question: 'Which spelling is CORRECT?',
        options: ['retreive', 'retrieve', 'reteive', 'retieve'],
        correctIndex: 1,
        explanation: '"Retrieve" — no C, so I before E → "ie".',
      },
      {
        type: 'mcq',
        question: 'A word sounds like "EE" but is spelled with EI. Which word is this?',
        options: ['belief', 'receive', 'weird', 'piece'],
        correctIndex: 2,
        explanation: '"Weird" is an exception — it sounds like "EE" but uses EI without a preceding C.',
      },
    ],
  },

  // ─── LESSON 2: BECE Homophones ─────────────────────────────────────────────
  {
    id: 'bece-homophones',
    module: 'BECE',
    title: 'Homophones',
    description: 'Words that sound the same but have different spellings and meanings — and how to use them correctly.',
    xp: 200,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'What are Homophones?',
        content:
          'The word HOMOPHONE is made up of two parts: HOMO means SAME and PHONE means SOUND. So, homophones are words that sound similar but have different spellings and meanings. It is very important to use the correct spelling of the intended word, as misspelt words cause a lot of confusion!',
        highlight: 'Focus on the MEANING, not the sound.',
        bullets: [
          'their = belonging to them ("their bags")',
          "they're = they are (\"they're happy\")",
          'there = a place ("over there")',
        ],
      },
      {
        type: 'mcq',
        question: 'Complete the sentence: "___ in the corner, with ___ bags."',
        options: [
          "They're / their",
          'There / they\'re',
          "There / their",
          'Their / there',
        ],
        correctIndex: 2,
        explanation: '"There" indicates a place. "Their" means belonging to them. So: "There in the corner, with their bags."',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'How to Find a Homophone',
        content:
          'To find a homophone, focus on the SOUND of the word, not its spelling. For example, ONE and WON are homophones — they sound alike but mean different things. Remember, some words can have more than one homophone: TO / TWO / TOO all sound the same.',
      },
      {
        type: 'mcq',
        question: 'What is the homophone for "eight"?',
        options: ['ait', 'ate', 'aight', 'ete'],
        correctIndex: 1,
        explanation: '"Eight" and "ate" are homophones. "Ate" is the past tense of "eat".',
      },
      {
        type: 'mcq',
        question: 'What is the homophone for "flour"?',
        options: ['floor', 'fleur', 'flower', 'fluor'],
        correctIndex: 2,
        explanation: '"Flour" (used in baking) and "flower" (a plant) sound identical.',
      },
      {
        type: 'mcq',
        question: 'What is the homophone for "sea"?',
        options: ['say', 'see', 'sie', 'sey'],
        correctIndex: 1,
        explanation: '"Sea" (ocean) and "see" (to look) are homophones.',
      },
      {
        type: 'mcq',
        question: 'What is the homophone for "write"?',
        options: ['wright', 'right', 'rite', 'All of these'],
        correctIndex: 3,
        explanation: '"Write", "right", and "rite" are all homophones of each other!',
      },
      {
        type: 'mcq',
        question: 'Fill in the blank: "Ade was not sure ___ he should take an umbrella." (wither / whether / weather)',
        options: ['wither', 'whether', 'weather', 'weether'],
        correctIndex: 1,
        explanation: '"Whether" introduces a doubt or choice ("whether he should"). "Weather" is the climate.',
      },
      {
        type: 'mcq',
        question: 'Fill in the blank: "The ___ on the rope was much bigger than his fist." (not / note / knot)',
        options: ['not', 'note', 'knot', 'naught'],
        correctIndex: 2,
        explanation: 'A "knot" is a fastening made by tying rope. "Not" is a negative word.',
      },
      {
        type: 'mcq',
        question: 'Fill in the blank: "The storyteller\'s ___ is about a monkey who lost his ___." (tail / tale)',
        options: ['tale / tail', 'tail / tale', 'tale / tale', 'tail / tail'],
        correctIndex: 0,
        explanation: '"Tale" means a story. "Tail" is the rear appendage. Storyteller\'s TALE, monkey\'s TAIL.',
      },
      {
        type: 'mcq',
        question: 'Which sentence uses homophones CORRECTLY?',
        options: [
          "It's not fare that passengers avoid paying the bus fair.",
          "It's not fair that passengers avoid paying the bus fare.",
          "It's not fair that passengers avoid paying the bus fair.",
          "It's not fare that passengers avoid paying the bus fare.",
        ],
        correctIndex: 1,
        explanation: '"Fair" = just/right. "Fare" = the price of a bus ticket.',
      },
      {
        type: 'mcq',
        question: 'Fill in the blank: "The referee wearing a ___ jacket blew his whistle." (blew / blue)',
        options: ['blew jacket, blew whistle', 'blue jacket, blue whistle', 'blue jacket, blew whistle', 'blew jacket, blue whistle'],
        correctIndex: 2,
        explanation: '"Blue" is the colour of the jacket. "Blew" is the past tense of "blow" — he blew his whistle.',
      },
    ],
  },

  // ─── LESSON 3: BECE Punctuation & Sentences ────────────────────────────────
  {
    id: 'bece-punctuation',
    module: 'BECE',
    title: 'Punctuation & Sentences',
    description: 'Write clear, correctly punctuated sentences that make sense every time.',
    xp: 200,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'The Rules of a Correct Sentence',
        content:
          'When writing, your words are grouped together to form sentences. To be certain your sentences make sense, follow these rules:',
        bullets: [
          'Your sentence must start with a CAPITAL (upper case) letter.',
          'It must end with a punctuation mark: . or ? or !',
          'It must contain a VERB (a doing/action word).',
          'It must make complete sense on its own.',
          'Use speech marks ("…") for actual words spoken by someone.',
        ],
      },
      {
        type: 'mcq',
        question: 'Which punctuation mark ends a QUESTION?',
        options: ['.', '!', '?', ','],
        correctIndex: 2,
        explanation: 'A question mark (?) ends a sentence that asks something.',
      },
      {
        type: 'mcq',
        question: 'Which punctuation mark ends a COMMAND or EXCLAMATION?',
        options: ['.', '!', '?', ';'],
        correctIndex: 1,
        explanation: 'An exclamation mark (!) is used for imperatives (commands) and strong exclamations.',
      },
      {
        type: 'mcq',
        question: 'Which sentence is correctly punctuated?',
        options: [
          'today is my birthday and I am very happy',
          'Today is my birthday and I am very happy.',
          'today is my birthday and I am very happy.',
          'Today is my birthday and I am very happy',
        ],
        correctIndex: 1,
        explanation: 'A sentence must start with a capital letter and end with a full stop.',
      },
      {
        type: 'learn',
        icon: 'warn',
        title: 'What Happens Without Punctuation?',
        content:
          'Lack of punctuation means your meaning can be totally misunderstood. Without it, the reader has no signal for when to pause. What they see is a huge heap of words to untangle. As a result, the reader feels unable to understand the meaning of what is written.',
        highlight: 'Punctuation is not optional — it is essential.',
      },
      {
        type: 'mcq',
        question: 'Which version is correctly punctuated?',
        options: [
          'I have just got my BECE results I performed even better than I thought I would my parents will be so pleased.',
          'I have just got my BECE results. I performed even better than I thought I would. My parents will be so pleased.',
          'I have just got my bece results. I performed even better than I thought i would. my parents will be so pleased.',
          'I have just got my BECE results, I performed even better, than I thought, I would my parents will be so pleased.',
        ],
        correctIndex: 1,
        explanation: 'Each sentence starts with a capital letter and ends with a full stop. Three separate complete thoughts = three sentences.',
      },
      {
        type: 'mcq',
        question: 'Which sentence correctly uses speech marks?',
        options: [
          "She said 'I love reading' and sat down.",
          'She said, "I love reading," and sat down.',
          'She said "I love reading and sat down."',
          'She said I love reading and sat down.',
        ],
        correctIndex: 1,
        explanation: 'Speech marks (66 and 99) wrap the exact words spoken. The reporting clause and comma come before the speech.',
      },
      {
        type: 'mcq',
        question: 'Which of these IS a complete sentence?',
        options: [
          'Running fast through the market.',
          'Because it was raining heavily.',
          'The boy ran home quickly.',
          'When the sun finally came out.',
        ],
        correctIndex: 2,
        explanation: '"The boy ran home quickly" has a subject (the boy), a verb (ran), and makes complete sense on its own.',
      },
      {
        type: 'mcq',
        question: 'A sentence that gives a statement ends with:',
        options: ['?', '!', '.', ':'],
        correctIndex: 2,
        explanation: 'A statement (declarative sentence) ends with a full stop (.).',
      },
      {
        type: 'mcq',
        question: 'Which sentence has the BEST punctuation?',
        options: [
          "Can't wait to handle my new i-phone though my younger sister will be so jealous!",
          "Can't wait to handle my new I-phone, though. My younger sister will be so jealous!",
          "Cant wait to handle my new I-phone though my younger sister will be so jealous",
          "Can't wait to handle my new I-phone though, my younger sister will be so jealous.",
        ],
        correctIndex: 1,
        explanation: 'Two separate ideas = two sentences. Apostrophe in "Can\'t". The I-phone capitalised. Exclamation for the sister\'s jealousy.',
      },
    ],
  },

  // ─── LESSON 4: BECE PAL Framework & Letter Writing ─────────────────────────
  {
    id: 'bece-pal-letters',
    module: 'BECE',
    title: 'PAL & Letter Writing',
    description: 'Use the PAL framework to choose your language, then write a perfect friendly letter.',
    xp: 250,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'The PAL Framework',
        content:
          'In every piece of writing, you must think about PAL. PAL is a simple equation: P + A = L.',
        highlight: 'Purpose + Audience = Language',
        bullets: [
          'P = PURPOSE — Why are you writing?',
          'A = AUDIENCE — Who are you writing to?',
          'L = LANGUAGE — The words you choose based on P and A.',
        ],
      },
      {
        type: 'mcq',
        question: 'In the PAL framework, what does "A" stand for?',
        options: ['Action', 'Audience', 'Answer', 'Argument'],
        correctIndex: 1,
        explanation: 'A = AUDIENCE — the person or group you are writing/speaking to.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'PAL in Action',
        content:
          'Mum needs to tell both her 2-year-old son Mo AND her 15-year-old son Abdul to wash their hands before dinner. Same PURPOSE — but different AUDIENCE — so very different LANGUAGE.',
        bullets: [
          'To Mo (age 2): "Come here, little one. Let\'s do squishy squashy with the soap bubbles and wash all the dirt off your teeny-weeny fingers!"',
          'To Abdul (age 15): "Abdul, wash your hands before you touch that food — now, please."',
        ],
      },
      {
        type: 'mcq',
        question: 'You are writing to your headteacher to complain about canteen prices. What type of language should you use?',
        options: [
          'Slang and casual language, like a text message',
          'Formal, polite, structured language',
          'The same playful tone you use with friends',
          'Very emotional, angry words',
        ],
        correctIndex: 1,
        explanation: 'PURPOSE = complain / AUDIENCE = headteacher (authority figure) → LANGUAGE = formal and polite.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Friendly Letter — Like Sending a WhatsApp!',
        content:
          'Writing a letter is like sending a WhatsApp message. Walk through these steps:',
        bullets: [
          '1. Your ADDRESS — top right-hand side of the page (like your phone number so they can reply).',
          '2. The DATE — skip a line, write below the address.',
          '3. GREETING — on the left: "Hi John / Hi Marie".',
          '4. SMALL TALK — an ice breaker: "How are you? Hope everything\'s fine."',
          '5. MAIN REASON — 2–3 paragraphs covering what you want to say.',
          '6. CONCLUSION — suggest linking up / what happens next.',
          '7. SIGN OFF — say goodbye: "Love, / Yours truly, / Kind regards,"',
        ],
      },
      {
        type: 'mcq',
        question: 'In a letter, where do you write your own address?',
        options: [
          'Bottom left-hand side of the page',
          'Underneath the greeting',
          'Top right-hand side of the page',
          'At the very end of the letter',
        ],
        correctIndex: 2,
        explanation: 'Your address goes top right-hand side — so the recipient knows where to reply.',
      },
      {
        type: 'mcq',
        question: 'What comes immediately AFTER the address in a friendly letter?',
        options: ['The greeting', 'The main body', 'The sign-off', 'The date'],
        correctIndex: 3,
        explanation: 'After the address, skip a line and write the DATE underneath.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'The Opening Paragraph — Greet, Rephrase, Roadmap',
        content:
          'In an exam, your letters are unsolicited — the reader does not know what you will write about. Your opening paragraph must do THREE things:',
        bullets: [
          '1. GREET — say hello.',
          '2. REPHRASE THE PROMPT — state what the letter is about.',
          '3. PROVIDE A ROADMAP — briefly outline the points you will cover.',
        ],
        highlight: 'Example: "Hi Marie, it has been a while. We have a new head girl — I like her because she is clever, admirable, and helpful."',
      },
      {
        type: 'mcq',
        question: 'Which is the BEST opening for a letter telling a friend about your new head boy?',
        options: [
          'Dear friend, I am writing this letter today as the weather is nice.',
          'Hi Saidu, how are you? My school has a new head boy. His name is Tapeh Kamara. I like him because he is clever, admirable, and helpful.',
          'Hi, I just wanted to let you know some stuff that happened recently at school.',
          'To Whom It May Concern, I am writing regarding a new school head boy.',
        ],
        correctIndex: 1,
        explanation: 'This opening greets the friend, identifies the subject (new head boy), names him, and gives a roadmap of three reasons.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Closing Salutations for Informal Letters',
        content:
          'Your closing phrase (closing salutation) ends the letter in a friendly or polite way. For INFORMAL letters (to friends and family), you can use:',
        bullets: [
          'Kind regards', 'Regards', 'Yours truly', 'Love', 'See ya later', 'Take care',
        ],
      },
      {
        type: 'mcq',
        question: 'Which closing salutation is appropriate for an INFORMAL letter to a friend?',
        options: ['Yours faithfully,', 'Yours sincerely,', 'Love,', 'To whom it may concern,'],
        correctIndex: 2,
        explanation: '"Love," is warm and informal — perfect for a letter to a friend. "Yours faithfully" and "Yours sincerely" are for formal letters.',
      },
      {
        type: 'mcq',
        question: 'When arranging points in the roadmap of your opening sentence, what order is recommended?',
        options: [
          'Most important point first, least important last',
          'Alphabetical order',
          'Least important first, most important last',
          'Random order is fine',
        ],
        correctIndex: 2,
        explanation: 'Arrange from least to most important — it builds up to your strongest point and leaves the best impression.',
      },
    ],
  },

  // ─── LESSON 5: BECE Narrative Writing ──────────────────────────────────────
  {
    id: 'bece-narrative',
    module: 'BECE',
    title: 'Narrative / Creative Writing',
    description: 'Plan and write gripping stories using the narrative arc, the 5 senses, and PAL.',
    xp: 300,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'What is Narrative Writing?',
        content:
          'An imaginative or creative piece of writing can be very entertaining — and it does not have to be based on real events. You can invent it! The important thing is that it must be interesting enough for someone else to read. Aim to bring something different to your work by exploring a new idea whenever possible.',
        highlight: 'Remember your 5 SENSES: sight, sound, smell, taste, touch.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Tips Before You Start Writing',
        content: 'Follow these suggestions to keep your story on track:',
        bullets: [
          'Plan your story first — jot down key points (cross them out to show the examiner they are only a plan).',
          'Follow a narrative arc: BEGINNING → MIDDLE → END.',
          'Choose past OR present tense and STICK to it. Do not change tenses!',
          'Choose first person (I/we) OR third person (he/she/it) — do NOT change.',
          'Have ONE or TWO major characters — too many causes confusion.',
        ],
      },
      {
        type: 'mcq',
        question: 'What is the correct order of the narrative arc?',
        options: [
          'End → Middle → Beginning',
          'Middle → Beginning → End',
          'Beginning → Middle → End',
          'Beginning → End → Middle',
        ],
        correctIndex: 2,
        explanation: 'A narrative arc always goes: BEGINNING (set the stage) → MIDDLE (the conflict) → END (the resolution).',
      },
      {
        type: 'mcq',
        question: 'Which pronoun is used in FIRST PERSON narration?',
        options: ['He / She / It', 'They / Them', 'I / We', 'You / Your'],
        correctIndex: 2,
        explanation: 'First person narration uses I / We — the narrator is a character inside the story.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'PAL for Narratives',
        content: 'Even for stories, always check PAL:',
        bullets: [
          'PURPOSE — to write an adventure/narrative story.',
          'AUDIENCE — peers / fellow students.',
          'LANGUAGE — primarily formal, but dialogue can be informal and action-packed. Tone is generally jovial but can be serious.',
        ],
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Characters: Protagonist & Antagonist',
        content:
          'Every story has a conflict between two forces. Use these two terms to understand who is who:',
        bullets: [
          'PROTAGONIST — the "goodie" or hero/heroine of the story.',
          'ANTAGONIST — the "baddie" or villain. The villain does not have to be human — it can be a storm, an illness, a bad road, or any obstacle.',
        ],
      },
      {
        type: 'mcq',
        question: 'What does PROTAGONIST mean?',
        options: [
          'The villain of the story',
          'The narrator of the story',
          'The hero or heroine of the story',
          'A minor background character',
        ],
        correctIndex: 2,
        explanation: 'PROTAGONIST = the goodie / hero / heroine — the main character the reader roots for.',
      },
      {
        type: 'mcq',
        question: 'The villain in a narrative is called the:',
        options: ['Protagonist', 'Narrator', 'Antagonist', 'Climax'],
        correctIndex: 2,
        explanation: 'ANTAGONIST = the baddie — the force that stands in the way of the protagonist.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Writing the BEGINNING',
        content: 'Set the stage for your story. In your beginning:',
        bullets: [
          'Use TIME MARKERS: "In 1989", "That morning", "Long ago", "The week before".',
          'Use PLACE INDICATORS: "In a village named…", "20 miles away", "Leaving her workplace".',
          'Reveal something UNUSUAL about the hero/heroine (use one or two adjectives or a positive simile).',
          'Reveal something STRANGE about the villain (use a negative simile or descriptive words).',
          'Reveal the EVENT or REASON that causes the protagonist and antagonist to clash.',
        ],
      },
      {
        type: 'mcq',
        question: 'Which of these is a good TIME MARKER to begin a narrative?',
        options: [
          '"The boy was very clever."',
          '"That stormy morning in the village of Kambia…"',
          '"There are many characters in this story."',
          '"I will now tell you about what happened."',
        ],
        correctIndex: 1,
        explanation: 'Time markers anchor the reader in when the story takes place. "That stormy morning in the village of Kambia" sets both time and place.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'The MIDDLE — Back and Forth',
        content: 'The middle is where the real action happens. Show the back-and-forth battle:',
        bullets: [
          'Show the PROTAGONIST discovering something and reacting (use adjectives and your senses).',
          'Show the ANTAGONIST reacting to the protagonist\'s action (use feeling words and action verbs).',
          'Repeat this back-and-forth to build tension.',
          'Build to the CLIMAX — the moment when the outcome hangs in the balance.',
        ],
      },
      {
        type: 'mcq',
        question: 'The CLIMAX of a story is:',
        options: [
          'The opening scene where characters are introduced',
          'The moment of highest tension when the outcome hangs in the balance',
          'The moral lesson at the end of the story',
          'The point where the protagonist is first described',
        ],
        correctIndex: 1,
        explanation: 'The CLIMAX is the turning point — the most intense moment when we do not yet know who will win.',
      },
      {
        type: 'mcq',
        question: 'Which writing technique engages the reader\'s senses?',
        options: [
          '"He walked."',
          '"He trudged through the thick red mud, the rain hammering his back like fists."',
          '"He was a boy who walked in the rain."',
          '"The boy moved."',
        ],
        correctIndex: 1,
        explanation: 'Engaging senses: "trudged" (feeling/movement), "thick red mud" (sight/touch), "hammering his back like fists" (sound/touch simile).',
      },
    ],
  },

  // ─── LESSON 6: WASSCE Advanced Spelling & Homophones ───────────────────────
  {
    id: 'wassce-spelling-advanced',
    module: 'WASSCE',
    title: 'Advanced Spelling & Homophones',
    description: 'WASSCE-level spelling rules, extended homophones, and fill-in-the-blank practice.',
    xp: 300,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'WASSCE Essay Writing — Overview',
        content:
          'This section highlights key foundational skills: correct spelling rules such as the "I before E" mnemonic, proper use of homophones and punctuation, and the PAL framework. It also covers narrative techniques including the story arc and the DREW formula for creating effective fiction.',
        highlight: 'Read and practise the exercises from start to finish.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'What is a Mnemonic?',
        content:
          'A mnemonic is a prompt or rule, sometimes formed from letters or a phrase, to help us remember something. It is a guide that acts as an aide-mémoire — a clue to help us recall important information.',
        highlight: 'The mnemonic for IE/EI words: "I before E, except after C."',
      },
      {
        type: 'mcq',
        question: 'WASSCE Level: Which is the correct spelling?',
        options: ['wierd', 'weird', 'weerd', 'wieerd'],
        correctIndex: 1,
        explanation: '"Weird" is an exception to the IE/EI rule — it uses EI without a preceding C. It must be memorised.',
      },
      {
        type: 'mcq',
        question: 'Which is the correct spelling?',
        options: ['liesure', 'liesure', 'leisure', 'leasure'],
        correctIndex: 2,
        explanation: '"Leisure" is another exception — EI without a preceding C. The e sounds like a short "e".',
      },
      {
        type: 'mcq',
        question: 'Which is the correct spelling?',
        options: ['foriegn', 'forgein', 'foreign', 'froeign'],
        correctIndex: 2,
        explanation: '"Foreign" is an exception — the EI follows the rule\'s spirit but must simply be memorised.',
      },
      {
        type: 'mcq',
        question: 'Spell the word: "She was the ___ girl to pull out of the match." (8th)',
        options: ['eigth', 'eighth', 'eigtht', 'egith'],
        correctIndex: 1,
        explanation: '"Eighth" — E-I-G-H-T-H. Another exception: EI without a C, and the number word must include the "h".',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Extended Homophones List (WASSCE)',
        content: 'You need to know more homophones at WASSCE level. Study these pairs carefully:',
        bullets: [
          'new / knew', 'buy / bye / by', 'were / wear', 'vein / vain',
          'through / threw', 'way / weigh / whey', 'pair / pear',
          'feat / feet / fit', 'prays / praise / prayers',
        ],
      },
      {
        type: 'mcq',
        question: 'Fill in the blank: "He looked ___ the window and threw the book at them." (though / threw / through)',
        options: ['though', 'threw', 'through', 'thro'],
        correctIndex: 2,
        explanation: '"Through" means from one side to the other (looked through the window). "Threw" is past tense of throw.',
      },
      {
        type: 'mcq',
        question: 'Fill in: "There is no ___ that elephant could weigh less than 150 kilos." (weigh / whey / way)',
        options: ['weigh', 'whey', 'way', 'waye'],
        correctIndex: 2,
        explanation: '"Way" means method or possibility. "Weigh" = to measure weight. "Whey" = the liquid from milk.',
      },
      {
        type: 'mcq',
        question: 'Fill in: "He exchanged his ___ of second-hand trainers for a bronze ___." (pair / pear)',
        options: ['pear / pair', 'pair / pear', 'pair / pair', 'pear / pear'],
        correctIndex: 1,
        explanation: '"Pair" = a set of two. "Pear" = the fruit. He exchanged his PAIR of trainers for a bronze PEAR (a fruit-shaped award).',
      },
      {
        type: 'mcq',
        question: 'Fill in: "In our church, the leader ___ and leads the songs of ___." (prayers / praise / prays)',
        options: ['praise / prayers', 'prays / praise', 'prayers / prays', 'prays / prayers'],
        correctIndex: 1,
        explanation: '"Prays" = the action (he prays). "Praise" = songs of worship/admiration.',
      },
      {
        type: 'mcq',
        question: 'Which word means "something you believe but cannot prove"?',
        options: ['Fact', 'Statistic', 'Opinion', 'Mnemonic'],
        correctIndex: 2,
        explanation: 'An OPINION is something you believe or feel but cannot prove with evidence.',
      },
    ],
  },

  // ─── LESSON 7: WASSCE Formal & Informal Letters ─────────────────────────────
  {
    id: 'wassce-letters',
    module: 'WASSCE',
    title: 'Formal & Informal Letters',
    description: 'Master the full structure of both formal and informal letters for WASSCE exams.',
    xp: 350,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'Recap: PAL for Letters',
        content:
          'Before writing any letter, always check PAL. This tells you everything you need to know about how to write it.',
        bullets: [
          'PURPOSE — what are you being asked to do? (inform, complain, persuade?)',
          'AUDIENCE — who are you writing to? (friend, headteacher, government official?)',
          'LANGUAGE — formal or informal? How emotional? What tone?',
        ],
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Informal Letter Structure',
        content: 'An informal (friendly) letter follows this structure:',
        bullets: [
          '1. Your address — top right',
          '2. Date — below your address, skip a line',
          '3. Greeting — "Hi [Name]," / "Dear [Name],"',
          '4. Opening small talk — ice breaker, ask how they are',
          '5. Main body — 2–3 paragraphs of substance',
          '6. Conclusion — suggest meeting up / wrap up thoughts',
          '7. Sign-off — "Love, / Kind regards, / Yours truly,"',
        ],
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Formal Letter Structure',
        content: 'A formal letter requires a slightly different structure and much more careful language:',
        bullets: [
          '1. Your address — top right',
          '2. Recipient\'s address — below your address, on the LEFT',
          '3. Date — below addresses',
          '4. Subject line — "Re: Food Prices in the School Canteen"',
          '5. Greeting — "Dear Mr Johnson," / "Dear Sir/Madam,"',
          '6. Main body — clear, formal, polite paragraphs',
          '7. Sign-off — "Yours sincerely," (if named) / "Yours faithfully," (if unknown)',
        ],
      },
      {
        type: 'mcq',
        question: 'You are writing to a government minister whose name you do not know. Which sign-off do you use?',
        options: ['Yours sincerely,', 'Love,', 'Yours faithfully,', 'Kind regards,'],
        correctIndex: 2,
        explanation: '"Yours faithfully" is used when you do NOT know the name of the recipient (you opened with "Dear Sir/Madam"). "Yours sincerely" is used when you DO know the name.',
      },
      {
        type: 'mcq',
        question: 'You are writing to your friend Marie. Which greeting is most appropriate?',
        options: ['Dear Sir/Madam,', 'To Whom It May Concern,', 'Hi Marie,', 'Dear Ms Marie Johnson,'],
        correctIndex: 2,
        explanation: '"Hi Marie," is warm and informal — exactly right for a letter to a friend.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Opening Paragraph: Greet, Rephrase, Roadmap',
        content:
          'In an exam, your letter\'s opening paragraph MUST do three things, in this order:',
        bullets: [
          '1. GREET the recipient warmly (or formally).',
          '2. REPHRASE the prompt — show you understand what you\'re being asked.',
          '3. ANNOUNCE YOUR POSITION and provide a ROADMAP of the points you will cover.',
        ],
        highlight: 'Tip: Arrange your roadmap points from LEAST to MOST important.',
      },
      {
        type: 'mcq',
        question: 'Which opening best fulfils the three requirements (greet, rephrase, roadmap)?',
        options: [
          'Hi Arthur, I hope you\'re well. I\'m writing to tell you about my holiday.',
          'Hi Arthur, this letter will be my last this semester before our first-term examination. After it, I will participate in recreational activities, do community service, and study for my next exam.',
          'Dear Arthur, there are many things I want to tell you about.',
          'Hi Arthur, I wanted to write to you. How are you? Things are fine here.',
        ],
        correctIndex: 1,
        explanation: 'Option B: greets (Hi Arthur), rephrases the task (last letter before exams), and gives a clear roadmap of three things he will do.',
      },
      {
        type: 'mcq',
        question: 'The BODY paragraphs of a letter should:',
        options: [
          'Introduce new topics that weren\'t in the roadmap',
          'Follow the roadmap set out in the opening paragraph',
          'Repeat the opening paragraph word for word',
          'Use bullet points instead of paragraphs',
        ],
        correctIndex: 1,
        explanation: 'Once you have given the reader a roadmap, the body paragraphs follow that map — no surprises.',
      },
      {
        type: 'mcq',
        question: 'Which sign-off is appropriate for an INFORMAL letter?',
        options: ['Yours faithfully,', 'Yours sincerely,', 'Kind regards,', 'To whom it may concern,'],
        correctIndex: 2,
        explanation: '"Kind regards" is warm but not overly casual — perfect for an informal or semi-formal context.',
      },
      {
        type: 'mcq',
        question: 'You are writing a formal letter and you know the recipient is called Mr Kamara. Which sign-off do you use?',
        options: ['Yours faithfully,', 'Love,', 'See ya,', 'Yours sincerely,'],
        correctIndex: 3,
        explanation: '"Yours sincerely" is used when you opened the letter with the person\'s name ("Dear Mr Kamara").',
      },
      {
        type: 'mcq',
        question: 'In a WASSCE letter exam question, what does "Writing Standard West African English" help you earn?',
        options: ['An A grade automatically', 'A credit', 'Nothing extra', 'Extra time'],
        correctIndex: 1,
        explanation: 'Writing standard West African English will help you earn a CREDIT in your exam.',
      },
    ],
  },

  // ─── LESSON 8: WASSCE Newspaper Article & Speech Writing ───────────────────
  {
    id: 'wassce-newspaper-speech',
    module: 'WASSCE',
    title: 'Newspaper Articles & Speeches',
    description: 'Learn the conventions of news reports, feature articles, and persuasive speeches.',
    xp: 400,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'Conventions of a News Report',
        content: 'News reports and feature articles are both important sources of information, but they differ. A NEWS REPORT:',
        bullets: [
          'Has a catchy headline (e.g. "School Roof Raises Le20M")',
          'Has a byline — who wrote it',
          'Covers the 5 Ws: Who / What / Where / When / Why',
          'Uses THIRD PERSON — can use names of those involved',
          'Reports events IN SEQUENCE: first / next / finally',
          'Uses the PAST TENSE',
          'Written in paragraphs',
          'May include quotes from interviews',
        ],
      },
      {
        type: 'mcq',
        question: 'What are the 5 Ws in a news report?',
        options: [
          'Words, Writing, Where, Why, Wonder',
          'Who, What, Where, When, Why',
          'What, Which, When, Whether, Writing',
          'Who, Which, Where, Wonder, Why',
        ],
        correctIndex: 1,
        explanation: 'The 5 Ws: Who is involved? What happened? Where did it happen? When? Why? These anchor the reader in all key facts.',
      },
      {
        type: 'mcq',
        question: 'News reports are written in which tense?',
        options: ['Future tense', 'Present tense', 'Past tense', 'Mixed tenses'],
        correctIndex: 2,
        explanation: 'News reports use the PAST TENSE because they report events that have already happened.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Conventions of a Feature Article',
        content: 'A FEATURE ARTICLE is more in-depth and can be opinionated. It:',
        bullets: [
          'Has a headline that HOOKS and usually explains the topic (e.g. "Eat Cassava Leaves: Live Longer!")',
          'Uses SUB-HEADINGS to organise sections',
          'Bases evidence on research',
          'Can offer a balanced OR biased view',
          'Mixes factual and personal content',
          'Uses formal language, but colloquial phrases for emphasis',
          'Can use "writing to persuade" devices (DAFOREST)',
          'Structure: opening → middle paragraphs → conclusion → call to action',
        ],
      },
      {
        type: 'mcq',
        question: 'What ends a feature article?',
        options: [
          'A list of sources used',
          'A call to action',
          'A repetition of the headline',
          'A dictionary definition',
        ],
        correctIndex: 1,
        explanation: 'A feature article ends with a CALL TO ACTION — urging the reader to do something about the issue raised.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Newspaper Article Structure',
        content: 'Use this structure for your newspaper/feature article in an exam:',
        bullets: [
          '1. GREET your audience: "Fellow students," / "Dear Editor,"',
          '2. STATE the subject and your opinion',
          '3. EXPLAIN point 1 with a topic sentence and example',
          '4. EXPLAIN point 2 with a topic sentence and example',
          '5. EXPLAIN point 3 with a topic sentence and example',
          '6. CALL FOR ACTION — and explain the consequences of inaction',
        ],
      },
      {
        type: 'mcq',
        question: 'Which PAL check is correct for a school magazine article?',
        options: [
          'Purpose: entertain / Audience: teachers only / Language: slang',
          'Purpose: explain and persuade / Audience: peer group and wider audience / Language: formal with literary devices',
          'Purpose: list facts / Audience: government / Language: legal jargon',
          'Purpose: complain / Audience: canteen workers / Language: angry slang',
        ],
        correctIndex: 1,
        explanation: 'A school magazine article: PURPOSE = explain/persuade, AUDIENCE = peers + wider, LANGUAGE = formal but with emotive/literary devices.',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Speech / Debate Conventions',
        content: 'Speeches are formal presentations designed to PERSUADE, EXPLAIN, or DESCRIBE. A speech has three parts:',
        bullets: [
          '1. OPENING — designed to motivate and grab the listeners\' attention',
          '2. ARGUMENT / BODY — your main points, developed logically',
          '3. CONCLUSION — pulls everything together, repeats your position',
        ],
        highlight: 'Speak directly to the audience: use "I / We / You".',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Speech Techniques',
        content: 'To keep your audience engaged in a speech:',
        bullets: [
          'Use SHORTER SENTENCES to create pace and urgency.',
          'Ask RHETORICAL QUESTIONS — questions that make a point without needing an answer.',
          'Use HUMOUR and EVERYDAY REFERENCES to connect with your audience.',
          'Use EMOTIVE LANGUAGE to stir strong feelings.',
          'Use DIRECT ADDRESS — "You", "We" — to include the audience personally.',
        ],
      },
      {
        type: 'mcq',
        question: 'Which of these is a RHETORICAL QUESTION?',
        options: [
          '"What time does the meeting start?"',
          '"Can you pass me the salt?"',
          '"Are we really going to let this happen to our children?"',
          '"How many people attended the event?"',
        ],
        correctIndex: 2,
        explanation: 'A rhetorical question makes a dramatic point but does not need an answer. "Are we really going to let this happen?" implies "of course not."',
      },
      {
        type: 'mcq',
        question: 'A speech INTRODUCTION should:',
        options: [
          'List all your conclusions immediately',
          'Grab attention, introduce the subject, state your opinion, and outline what you will cover',
          'Apologise for taking the audience\'s time',
          'Read out a long list of statistics',
        ],
        correctIndex: 1,
        explanation: 'The introduction: grabs attention (stat/quote/anecdote), introduces the subject, states your position, and outlines the roadmap.',
      },
      {
        type: 'mcq',
        question: 'In a debate FOR okadas (motorbike taxis), which is a strong CLAIM?',
        options: [
          'Okadas sometimes cause accidents.',
          'Okadas provide cheap, alternative transportation for people who cannot afford taxis.',
          'Okadas are very common in Sierra Leone.',
          'Some people like okadas.',
        ],
        correctIndex: 1,
        explanation: 'A strong claim is specific and arguable. "Cheap, alternative transportation" is a clear benefit that can be supported with evidence.',
      },
    ],
  },

  // ─── LESSON 9: WASSCE DAFOREST — Writing to Argue ──────────────────────────
  {
    id: 'wassce-daforest',
    module: 'WASSCE',
    title: 'DAFOREST: Writing to Argue',
    description: 'Use the DAFOREST mnemonic to write powerful, structured persuasive essays.',
    xp: 450,
    status: 'locked',
    steps: [
      {
        type: 'learn',
        icon: 'learn',
        title: 'What is DAFOREST?',
        content:
          'DAFOREST is a mnemonic for techniques used in argumentative and persuasive writing. Each letter stands for a different device that makes your writing more powerful and convincing.',
        highlight: 'D A F O R E S T',
        bullets: [
          'D = Direct address', 'A = Alliteration', 'F = Fact', 'O = Opinion',
          'R = Rhetorical question', 'E = Emotive language', 'S = Statistics', 'T = Triad / Pattern of three',
        ],
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'D — Direct Address',
        content:
          'Direct address means you talk directly to your audience using "we", "you", or "us". It makes the reader feel personally involved and responsible.',
        highlight: 'Example: "You must agree that dumping your rubbish on the street is not good for our health."',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'A — Alliteration',
        content:
          'Alliteration is the repetition of the same consonant sound at the beginning of closely connected words. It makes phrases memorable and catchy.',
        highlight: 'Example: "prolific, professional, powerful criminals" or "safe, secure, sustainable streets".',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'F & O — Fact and Opinion',
        content:
          'FACT: Evidence that can be proven — statistics, research, documented events.\n\nOPINION: Something you believe or feel but cannot prove. Both are valuable in argument writing.',
        bullets: [
          'Fact: "70% of crimes in the city are committed by youths under 20."',
          'Opinion: "The government has failed our young people."',
        ],
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'R — Rhetorical Question',
        content:
          'A rhetorical question creates a dramatic effect and makes a point — but does NOT need an answer. It challenges the reader to think and implies an obvious answer.',
        highlight: 'Example: "Who on earth doesn\'t want to win some money?"',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'E — Emotive Language',
        content:
          'Emotive language uses words deliberately chosen to invoke strong feelings in your audience. Instead of a neutral word, choose one that triggers an emotional response.',
        bullets: [
          'Instead of "sad" → "devastated" or "heartbroken"',
          'Instead of "bad" → "catastrophic" or "appalling"',
          'Instead of "many" → "countless" or "an overwhelming flood of"',
        ],
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'S — Statistics',
        content:
          'Statistics are numbers and data based on facts and figures. They make your argument feel grounded in reality and are hard for the reader to dispute.',
        highlight: 'Example: "The Dept of Health\'s most recent publication recorded a 70% decline in air quality due to pollution."',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'T — Triad (Pattern of Three)',
        content:
          'A triad is the technique of closely grouping THREE words or phrases together to strengthen an idea. It creates rhythm and makes your point feel undeniable.',
        highlight: 'Example: "I came, I saw, I conquered." / "It is signed, sealed, delivered."',
        bullets: [
          '"It\'s shameful, it\'s appalling, it\'s outrageous!"',
          '"A society that cares, that is compassionate, and that believes in collective responsibility."',
        ],
      },
      {
        type: 'mcq',
        question: 'Which DAFOREST technique is used in: "It\'s shameful, it\'s appalling, it\'s outrageous!"',
        options: ['Alliteration', 'Rhetorical Question', 'Triad / Pattern of Three', 'Emotive Language'],
        correctIndex: 2,
        explanation: 'Three repeated structures ("it\'s ___") used together for emphasis = Triad / Pattern of Three (T).',
      },
      {
        type: 'mcq',
        question: 'Which technique is: "Who on earth doesn\'t want to win some money?"',
        options: ['Direct Address', 'Rhetorical Question', 'Statistics', 'Alliteration'],
        correctIndex: 1,
        explanation: 'This makes a point without needing an answer — the obvious answer is "everyone wants to win money." = Rhetorical Question (R).',
      },
      {
        type: 'mcq',
        question: 'Which technique is: "You must agree that dumping your rubbish on the street is not good for our health."',
        options: ['Fact', 'Alliteration', 'Rhetorical Question', 'Direct Address'],
        correctIndex: 3,
        explanation: '"You must agree" — talking directly to the audience using "you/our" = Direct Address (D).',
      },
      {
        type: 'mcq',
        question: 'Instead of writing "sad", a writer uses "devastated". Which DAFOREST technique is this?',
        options: ['Alliteration', 'Emotive Language', 'Statistics', 'Fact'],
        correctIndex: 1,
        explanation: 'Choosing "devastated" over "sad" deliberately invokes a stronger emotional response = Emotive Language (E).',
      },
      {
        type: 'learn',
        icon: 'learn',
        title: 'Essay Structure for Writing to Argue',
        content: 'Use this 6-paragraph structure for a WASSCE argumentative essay:',
        bullets: [
          'Paragraph 1 — INTRODUCTION: clear opening, state the issue and your position.',
          'Paragraph 2 — POINT 1 + counter-argument',
          'Paragraphs 3/4 — FURTHER POINTS with counter-arguments',
          'Paragraph 5 — FURTHER POINT (no counter-argument needed)',
          'Paragraph 6 — CONCLUSION: briefly summarise, come down firmly on one side.',
        ],
        highlight: 'Use connectives: firstly / however / in contrast / on the other hand / as a result / although',
      },
      {
        type: 'mcq',
        question: 'What is the purpose of a COUNTER-ARGUMENT in a persuasive essay?',
        options: [
          'To agree with the other side completely',
          'To acknowledge the opposing view and then refute or minimise it',
          'To end the essay with doubt',
          'To confuse the reader',
        ],
        correctIndex: 1,
        explanation: 'A counter-argument shows you have considered the other side — then you refute it, which actually strengthens your own position.',
      },
    ],
  },
];
