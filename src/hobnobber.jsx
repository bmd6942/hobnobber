import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════
//  DATA: HOBBIES, DRILLDOWN, HELPERS
// ═══════════════════════════════════════════════════════

const HOBBIES = {
  Fitness: [
    { name:"Rock Climbing",emoji:"🧗",tags:["Active","Social","Adventurous"],why:"Full-body workout that doubles as a puzzle. Every route is a new problem to solve.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Social"},
    { name:"Yoga & Meditation",emoji:"🧘",tags:["Mindful","Flexible","Low-impact"],why:"Build strength and flexibility while finding inner calm. Great at any age or level.",budgetMin:0,ageAppeal:{"21-30":3,"31-40":5,"41-50":5,"60+":5},socialType:"Solo"},
    { name:"Trail Running",emoji:"🏃",tags:["Outdoor","Endurance","Solo-friendly"],why:"Explore nature while pushing your limits. All you need is a pair of shoes.",budgetMin:0,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Solo"},
    { name:"Martial Arts",emoji:"🥋",tags:["Discipline","Self-defense","Community"],why:"Learn self-defense, build confidence, and join a tight-knit community.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Social"},
    { name:"Swimming",emoji:"🏊",tags:["Low-impact","Full-body","Refreshing"],why:"Easy on joints, amazing for cardio, and perfect for all fitness levels.",budgetMin:20,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Either"},
    { name:"Dance Fitness",emoji:"💃",tags:["Fun","Social","Cardio"],why:"Get your heart pumping while learning killer moves. No wallflowers allowed.",budgetMin:20,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":3},genderBoost:{Female:1},socialType:"Social"},
    { name:"Cycling",emoji:"🚴",tags:["Outdoor","Endurance","Exploratory"],why:"Cover serious ground while staying fit. Perfect blend of exercise and adventure.",budgetMin:100,ageAppeal:{"21-30":4,"31-40":5,"41-50":5,"60+":4},socialType:"Either"},
  ],
  Music: [
    { name:"Guitar",emoji:"🎸",tags:["Creative","Solo or Band","Timeless"],why:"From campfire strumming to shredding solos — infinite ceiling, easy floor.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":4,"41-50":4,"60+":3},socialType:"Either"},
    { name:"Music Production",emoji:"🎛️",tags:["Digital","Creative","Unlimited"],why:"Create beats, mix tracks, and produce songs from your laptop. Modern magic.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Solo"},
    { name:"Piano",emoji:"🎹",tags:["Classical","Versatile","Meditative"],why:"The king of instruments. Beautiful alone, essential in any ensemble.",budgetMin:30,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Solo"},
    { name:"Singing / Choir",emoji:"🎤",tags:["Social","Expressive","Free"],why:"Your voice is the one instrument you always carry. Join a choir or go solo.",budgetMin:0,ageAppeal:{"21-30":3,"31-40":4,"41-50":4,"60+":5},socialType:"Social"},
    { name:"DJing",emoji:"🎧",tags:["Social","Nightlife","Creative"],why:"Curate vibes and control the energy of any room. Modern-day conductor.",budgetMin:100,ageAppeal:{"21-30":5,"31-40":4,"41-50":2,"60+":1},socialType:"Social"},
    { name:"Vinyl Collecting",emoji:"📀",tags:["Curation","Community","Nostalgic"],why:"Hunt for rare records, build a collection, and hear music as it was meant to be.",budgetMin:30,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Solo"},
  ],
  Reading: [
    { name:"Book Club",emoji:"📖",tags:["Social","Intellectual","Affordable"],why:"Read great books and discuss them with curious minds. Instant community.",budgetMin:0,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Social"},
    { name:"Creative Writing",emoji:"✍️",tags:["Solo","Expressive","Limitless"],why:"Build worlds with words. Short stories, poetry, novels — whatever sparks you.",budgetMin:0,ageAppeal:{"21-30":4,"31-40":5,"41-50":4,"60+":4},socialType:"Solo"},
    { name:"Journaling & Sketching",emoji:"📓",tags:["Reflective","Portable","Therapeutic"],why:"Capture your thoughts, ideas, and observations. A daily creative ritual.",budgetMin:0,ageAppeal:{"21-30":4,"31-40":4,"41-50":4,"60+":5},socialType:"Solo"},
    { name:"Language Learning",emoji:"🌍",tags:["Intellectual","Practical","Challenging"],why:"Unlock entire cultures by learning a new language. Incredibly rewarding.",budgetMin:0,ageAppeal:{"21-30":5,"31-40":4,"41-50":4,"60+":4},socialType:"Either"},
    { name:"Calligraphy",emoji:"🖊️",tags:["Artistic","Meditative","Elegant"],why:"Transform letters into art. A slow, beautiful craft that sharpens focus.",budgetMin:20,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Solo"},
  ],
  Movies: [
    { name:"Filmmaking",emoji:"🎥",tags:["Creative","Team","Technical"],why:"Tell stories through video. Smartphones have made this more accessible than ever.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Social"},
    { name:"Film Criticism & Blogging",emoji:"🍿",tags:["Analytical","Writing","Community"],why:"Watch deeply, think critically, and share your takes with the world.",budgetMin:0,ageAppeal:{"21-30":4,"31-40":5,"41-50":4,"60+":4},socialType:"Solo"},
    { name:"Photography",emoji:"📸",tags:["Visual","Exploratory","Artistic"],why:"Train your eye to see the extraordinary in the ordinary. Art meets tech.",budgetMin:30,ageAppeal:{"21-30":5,"31-40":5,"41-50":4,"60+":4},socialType:"Solo"},
    { name:"Animation & Motion Design",emoji:"🎨",tags:["Digital","Creative","Technical"],why:"Bring drawings and designs to life. From hand-drawn to 3D, the medium is booming.",budgetMin:0,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Solo"},
    { name:"Screenwriting",emoji:"📝",tags:["Storytelling","Solo","Intellectual"],why:"Craft the stories that become the movies you love. Pen, paper, imagination.",budgetMin:0,ageAppeal:{"21-30":4,"31-40":5,"41-50":4,"60+":3},socialType:"Solo"},
    { name:"Home Theater Setup",emoji:"🎬",tags:["Tech","Immersive","Social"],why:"Build the ultimate movie-watching experience in your own home.",budgetMin:200,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":4},socialType:"Social"},
  ],
  Traveling: [
    { name:"Backpacking",emoji:"🎒",tags:["Adventure","Budget","Independence"],why:"See the world on a shoestring. Every trip is a crash course in living.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Either"},
    { name:"Travel Photography",emoji:"📷",tags:["Visual","Cultural","Exploratory"],why:"Document your journeys through a lens. Every destination becomes a gallery.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":5,"41-50":4,"60+":4},socialType:"Solo"},
    { name:"Cooking World Cuisines",emoji:"👨‍🍳",tags:["Cultural","Delicious","Creative"],why:"Travel through your taste buds. Master dishes from every continent.",budgetMin:30,ageAppeal:{"21-30":4,"31-40":5,"41-50":5,"60+":5},socialType:"Either"},
    { name:"Scuba Diving",emoji:"🤿",tags:["Underwater","Adventure","Certification"],why:"Explore a whole other world beneath the waves. Truly life-changing.",budgetMin:200,ageAppeal:{"21-30":5,"31-40":4,"41-50":3,"60+":2},socialType:"Social"},
    { name:"Urban Sketching",emoji:"✏️",tags:["Artistic","Portable","Observational"],why:"Sketch the places you visit. A meditative way to truly see a destination.",budgetMin:0,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Solo"},
    { name:"Geocaching",emoji:"🗺️",tags:["Outdoor","Treasure Hunting","Community"],why:"A real-world treasure hunt that takes you to places you'd never otherwise go.",budgetMin:0,ageAppeal:{"21-30":4,"31-40":4,"41-50":4,"60+":4},socialType:"Either"},
    { name:"Camping & Overlanding",emoji:"⛺",tags:["Nature","DIY","Freedom"],why:"Disconnect from screens and reconnect with nature. The original adventure.",budgetMin:50,ageAppeal:{"21-30":5,"31-40":5,"41-50":4,"60+":3},socialType:"Either"},
  ],
  Plants: [
    { name:"Indoor Gardening",emoji:"🪴",tags:["Home","Low-cost","Relaxing"],why:"Transform your living space into a lush oasis. Every new leaf feels like a little victory.",budgetMin:0,ageAppeal:{"21-30":4,"31-40":5,"41-50":5,"60+":5},socialType:"Solo"},
    { name:"Community Gardening",emoji:"🏡",tags:["Social","Outdoor","Sustainable"],why:"Grow food and flowers alongside your neighbors. Fresh produce and fresh friendships.",budgetMin:0,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Social"},
    { name:"Terrariums & Miniature Gardens",emoji:"🫧",tags:["Creative","Compact","Artistic"],why:"Build tiny living worlds in glass. Part art, part science, fully mesmerizing.",budgetMin:20,ageAppeal:{"21-30":5,"31-40":4,"41-50":4,"60+":3},socialType:"Solo"},
    { name:"Vegetable Gardening",emoji:"🥕",tags:["Productive","Outdoor","Rewarding"],why:"Grow your own food from seed to plate. Nothing tastes better than something you grew yourself.",budgetMin:20,ageAppeal:{"21-30":3,"31-40":5,"41-50":5,"60+":5},socialType:"Solo"},
    { name:"Plant Propagation & Trading",emoji:"🌱",tags:["Social","Affordable","Addictive"],why:"Turn one plant into dozens and trade cuttings with fellow plant lovers. The hobby that multiplies.",budgetMin:0,ageAppeal:{"21-30":5,"31-40":5,"41-50":4,"60+":4},socialType:"Social"},
    { name:"Botanical Illustration",emoji:"🎨",tags:["Artistic","Meditative","Detailed"],why:"Draw and paint plants with scientific beauty. Where art meets botany.",budgetMin:10,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},socialType:"Solo"},
    { name:"Flower Arranging",emoji:"💐",tags:["Creative","Social","Elegant"],why:"Design stunning floral displays. A living art form that brightens any room.",budgetMin:30,ageAppeal:{"21-30":3,"31-40":4,"41-50":5,"60+":5},genderBoost:{Female:1},socialType:"Either"},
  ]
};

const DRILLDOWN = {
  "Rock Climbing":{questions:[{q:"What draws you more?",icon:"🧠",options:["Problem-solving","Physical challenge","Heights & views"]},{q:"Prefer indoors or outdoors?",icon:"🏔️",options:["Indoor gym","Outdoor crags","Both equally"]},{q:"Solo or social?",icon:"👥",options:["Just me & the wall","With a crew","Competitive"]}],subs:[{name:"Bouldering",emoji:"🪨",vibe:"The Puzzle Solver",desc:"Short, intense routes without ropes. Pure problem-solving on the wall — think chess with your body.",tags:["No ropes","Indoor-friendly","Technical"],match:{"Problem-solving":3,"Indoor gym":2,"Just me & the wall":1}},{name:"Sport Climbing",emoji:"⛰️",vibe:"The Endurance Artist",desc:"Longer routes with bolted anchors. Build stamina, trust your gear, and push your vertical limits.",tags:["Roped","Outdoor","Endurance"],match:{"Physical challenge":3,"Outdoor crags":2,"With a crew":1}},{name:"Competition Climbing",emoji:"🏆",vibe:"The Competitor",desc:"Test your skills against others in speed, lead, and boulder comps. The Olympics called — they want you.",tags:["Competitive","Events","High-energy"],match:{"Physical challenge":2,"Competitive":3,"Heights & views":1}}]},
  "Yoga & Meditation":{questions:[{q:"What's your main goal?",icon:"🎯",options:["Flexibility","Stress relief","Spiritual growth"]},{q:"How intense do you like it?",icon:"🔥",options:["Gentle & slow","Moderate flow","Break a sweat"]},{q:"Your ideal setting?",icon:"🌿",options:["Home alone","Studio class","Outdoors"]}],subs:[{name:"Vinyasa Flow",emoji:"🌊",vibe:"The Moving Meditation",desc:"Fluid sequences linking breath to movement. Dynamic, creative, and never the same class twice.",tags:["Cardio","Creative","All levels"],match:{"Flexibility":1,"Moderate flow":3,"Studio class":2}},{name:"Yin Yoga",emoji:"🕯️",vibe:"The Deep Release",desc:"Hold poses for minutes at a time, melting into deep connective tissue stretches. Profoundly calming.",tags:["Slow","Meditative","Restorative"],match:{"Stress relief":3,"Gentle & slow":3,"Home alone":1}},{name:"Hot Power Yoga",emoji:"🔥",vibe:"The Sweat Session",desc:"Intense poses in a heated room. You'll drip, shake, and leave feeling like a new person.",tags:["Intense","Detox","Challenging"],match:{"Spiritual growth":1,"Break a sweat":3,"Studio class":2}}]},
  "Trail Running":{questions:[{q:"What excites you most?",icon:"⚡",options:["Speed & racing","Exploring nature","Meditative solitude"]},{q:"Preferred terrain?",icon:"🏞️",options:["Forest trails","Mountain ridges","Desert & canyons"]},{q:"Distance preference?",icon:"📏",options:["Short & fast","Half marathon","Ultra distance"]}],subs:[{name:"Trail Racing",emoji:"🏁",vibe:"The Competitor",desc:"Organized trail races from 5K to 50K. Goals, bibs, finisher medals, and personal bests.",tags:["Competitive","Goals","Community"],match:{"Speed & racing":3,"Short & fast":2,"Mountain ridges":1}},{name:"Fastpacking",emoji:"🎒",vibe:"The Adventurer",desc:"Cover multi-day backpacking routes at running pace with ultralight gear. Adventure meets endurance.",tags:["Multi-day","Ultralight","Wilderness"],match:{"Exploring nature":3,"Ultra distance":2,"Mountain ridges":1}},{name:"Mindful Trail Jogging",emoji:"🌲",vibe:"The Forest Bather",desc:"Slow, intentional runs through nature. No watch, no pace — just you and the trail.",tags:["Meditative","Low-pressure","Nature"],match:{"Meditative solitude":3,"Forest trails":2,"Short & fast":1}}]},
  "Martial Arts":{questions:[{q:"What's your motivation?",icon:"💪",options:["Self-defense","Fitness & discipline","Competition"]},{q:"Striking or grappling?",icon:"🥊",options:["Striking","Grappling","Both / MMA"]},{q:"Philosophy matters?",icon:"☯️",options:["Yes, deeply","Somewhat","Just want to train"]}],subs:[{name:"Brazilian Jiu-Jitsu",emoji:"🤼",vibe:"The Human Chess",desc:"Ground-based grappling that rewards technique over strength. Addictively strategic.",tags:["Grappling","Strategy","Community"],match:{"Self-defense":2,"Grappling":3,"Just want to train":1}},{name:"Muay Thai",emoji:"🥊",vibe:"The Art of Eight Limbs",desc:"Devastating striking using fists, elbows, knees, and shins. Beautiful and brutal.",tags:["Striking","Cardio","Intense"],match:{"Fitness & discipline":2,"Striking":3,"Somewhat":1}},{name:"Aikido",emoji:"☯️",vibe:"The Peaceful Warrior",desc:"Redirect an attacker's energy against them. A deeply philosophical approach to conflict.",tags:["Defensive","Philosophical","Graceful"],match:{"Self-defense":2,"Yes, deeply":3,"Grappling":1}}]},
  "Swimming":{questions:[{q:"What draws you to water?",icon:"🌊",options:["Fitness laps","Relaxation","Open water adventure"]},{q:"How competitive are you?",icon:"🏅",options:["Not at all","Friendly races","Want to compete"]},{q:"Pool or open water?",icon:"🏊",options:["Pool","Ocean / lake","Either"]}],subs:[{name:"Masters Swimming",emoji:"🏊‍♂️",vibe:"The Lap Legend",desc:"Structured pool workouts with coached technique. Meet swimmers of all levels in organized clubs.",tags:["Coached","Social","Structured"],match:{"Fitness laps":3,"Want to compete":2,"Pool":1}},{name:"Open Water Swimming",emoji:"🌊",vibe:"The Wild Swimmer",desc:"Lakes, rivers, oceans — swim in nature with nothing but a wetsuit and courage.",tags:["Adventure","Nature","Challenge"],match:{"Open water adventure":3,"Ocean / lake":2,"Friendly races":1}},{name:"Aqua Fitness",emoji:"🤽",vibe:"The Social Splasher",desc:"High-energy water sports that build fitness through play. Fun first, workout second.",tags:["Social","Playful","Low-impact"],match:{"Relaxation":2,"Not at all":2,"Either":2}}]},
  "Dance Fitness":{questions:[{q:"What's your vibe?",icon:"🎶",options:["Latin & spicy","High-energy cardio","Graceful & expressive"]},{q:"How social do you want it?",icon:"💃",options:["Big group energy","Partner dancing","Solo expression"]},{q:"Your fitness priority?",icon:"🏋️",options:["Burn calories","Build strength","Improve flexibility"]}],subs:[{name:"Zumba",emoji:"🪩",vibe:"The Party Workout",desc:"Latin-inspired dance party disguised as a workout. You'll be having too much fun to notice the burn.",tags:["Group","Cardio","Beginner-friendly"],match:{"Latin & spicy":2,"Big group energy":3,"Burn calories":2}},{name:"Pole Dancing",emoji:"🩰",vibe:"The Strength Artist",desc:"Acrobatic, empowering, and seriously strong. Builds core and upper body like nothing else.",tags:["Strength","Confidence","Athletic"],match:{"Graceful & expressive":2,"Solo expression":2,"Build strength":3}},{name:"Salsa & Bachata",emoji:"💃",vibe:"The Social Dancer",desc:"Partner dances with infectious rhythms. Learn the steps, hit the socials, and never sit one out.",tags:["Partner","Latin","Social nights"],match:{"Latin & spicy":3,"Partner dancing":3,"Improve flexibility":1}}]},
  "Cycling":{questions:[{q:"What excites you?",icon:"🚴",options:["Speed on roads","Off-road trails","Long-distance touring"]},{q:"Your riding style?",icon:"⚡",options:["Casual & scenic","Intense training","Commuting"]},{q:"Ride alone or in groups?",icon:"👥",options:["Solo rides","Group rides","Mix of both"]}],subs:[{name:"Road Cycling",emoji:"🚲",vibe:"The Speed Demon",desc:"Sleek bikes, long routes, and the thrill of the open road. Pure endurance and speed.",tags:["Speed","Endurance","Road"],match:{"Speed on roads":3,"Intense training":2,"Group rides":1}},{name:"Mountain Biking",emoji:"🚵",vibe:"The Trail Shredder",desc:"Technical trails, jumps, and descents through forests and mountains. Adrenaline on two wheels.",tags:["Off-road","Technical","Adventure"],match:{"Off-road trails":3,"Intense training":1,"Solo rides":2}},{name:"Bikepacking",emoji:"🏕️",vibe:"The Nomad",desc:"Multi-day cycling adventures with camping gear strapped to your bike. Freedom and exploration.",tags:["Touring","Camping","Self-supported"],match:{"Long-distance touring":3,"Casual & scenic":2,"Solo rides":1}}]},
  "Guitar":{questions:[{q:"What style speaks to you?",icon:"🎵",options:["Rock & blues","Acoustic & folk","Classical & fingerstyle"]},{q:"Play alone or with others?",icon:"🎸",options:["Solo performer","Start a band","Jam sessions"]},{q:"Your learning style?",icon:"📖",options:["YouTube self-taught","Formal lessons","Learn by ear"]}],subs:[{name:"Electric Blues Guitar",emoji:"🎸",vibe:"The Soulful Shredder",desc:"Bend strings and pour emotion into every note. Blues is the foundation of all modern guitar.",tags:["Electric","Expressive","Improvisation"],match:{"Rock & blues":3,"Jam sessions":2,"Learn by ear":1}},{name:"Fingerstyle Acoustic",emoji:"🪕",vibe:"The One-Person Orchestra",desc:"Play melody, bass, and percussion all at once. Mesmerizing and meditative.",tags:["Solo","Technical","Beautiful"],match:{"Classical & fingerstyle":3,"Solo performer":2,"Formal lessons":1}},{name:"Campfire Guitar & Songwriting",emoji:"🔥",vibe:"The Storyteller",desc:"Learn chords, write songs, and become the person everyone wants at the bonfire.",tags:["Chords","Singing","Social"],match:{"Acoustic & folk":3,"Start a band":1,"YouTube self-taught":2}}]},
  "Music Production":{questions:[{q:"What genre pulls you?",icon:"🎧",options:["Electronic / EDM","Hip-hop / beats","Ambient / cinematic"]},{q:"Hardware or software?",icon:"🖥️",options:["All laptop","Hardware synths","Hybrid setup"]},{q:"Your goal?",icon:"🎯",options:["Release tracks","Score for media","Just explore"]}],subs:[{name:"Beat Making",emoji:"🥁",vibe:"The Rhythm Architect",desc:"Chop samples, program drums, and craft beats that make heads nod.",tags:["Hip-hop","Sampling","MPC-style"],match:{"Hip-hop / beats":3,"All laptop":2,"Release tracks":1}},{name:"Synthesis & Sound Design",emoji:"🎛️",vibe:"The Sonic Sculptor",desc:"Design sounds from scratch using oscillators and filters. Create textures no one's heard before.",tags:["Sound design","Experimental","Technical"],match:{"Electronic / EDM":2,"Hardware synths":3,"Just explore":2}},{name:"Film & Game Scoring",emoji:"🎬",vibe:"The Storyteller in Sound",desc:"Compose music that enhances visuals and narrative. Emotion meets technology.",tags:["Cinematic","Orchestral","Narrative"],match:{"Ambient / cinematic":3,"Score for media":3,"Hybrid setup":1}}]},
  "Piano":{questions:[{q:"What style attracts you?",icon:"🎹",options:["Classical","Jazz & improv","Pop & songwriter"]},{q:"Your experience level?",icon:"📊",options:["Complete beginner","Played as a kid","Intermediate+"]},{q:"Acoustic or digital?",icon:"🎵",options:["Acoustic piano","Digital keyboard","Whatever works"]}],subs:[{name:"Classical Piano",emoji:"🏛️",vibe:"The Timeless Virtuoso",desc:"From Bach to Chopin — master centuries of musical genius. Discipline meets transcendence.",tags:["Classical","Technique","Repertoire"],match:{"Classical":3,"Intermediate+":2,"Acoustic piano":1}},{name:"Jazz Piano & Improv",emoji:"🎷",vibe:"The Spontaneous Storyteller",desc:"Chord voicings, scales, and making it up on the spot. Freedom at the keys.",tags:["Jazz","Improvisation","Theory"],match:{"Jazz & improv":3,"Played as a kid":1,"Whatever works":1}},{name:"Keys & Songwriting",emoji:"🎤",vibe:"The Singer's Companion",desc:"Accompany yourself, write progressions, play at open mics. Find your sound.",tags:["Pop","Songwriting","Accompany"],match:{"Pop & songwriter":3,"Complete beginner":2,"Digital keyboard":1}}]},
  "Singing / Choir":{questions:[{q:"What kind of singing?",icon:"🎤",options:["Solo performance","Group / choral","Casual & fun"]},{q:"Genre preference?",icon:"🎵",options:["Pop & contemporary","Classical & opera","Gospel & soul"]},{q:"Performance comfort?",icon:"🎭",options:["Love the spotlight","Prefer background","Warming up to it"]}],subs:[{name:"Community Choir",emoji:"🎶",vibe:"The Harmony Finder",desc:"Sing in four-part harmony with a group. No auditions, just the joy of voices blending.",tags:["Group","Welcoming","Weekly"],match:{"Group / choral":3,"Classical & opera":1,"Prefer background":2}},{name:"Vocal Coaching & Solo",emoji:"🌟",vibe:"The Stage Star",desc:"Work with a coach to develop your unique voice. Open mics and real performance skills.",tags:["Solo","Training","Performance"],match:{"Solo performance":3,"Pop & contemporary":2,"Love the spotlight":2}},{name:"Karaoke & Social Singing",emoji:"🎉",vibe:"The Life of the Party",desc:"No training needed — just pick a song and belt it out. Maximum fun, zero pressure.",tags:["Casual","Social","No pressure"],match:{"Casual & fun":3,"Gospel & soul":1,"Warming up to it":2}}]},
  "DJing":{questions:[{q:"Your scene?",icon:"🪩",options:["Club / festival","House parties","Online streaming"]},{q:"Genre focus?",icon:"🎵",options:["House & techno","Hip-hop & open format","Experimental"]},{q:"Vinyl or digital?",icon:"💿",options:["CDJs / USB","Vinyl turntables","Controller + laptop"]}],subs:[{name:"Club DJing",emoji:"🪩",vibe:"The Floor Commander",desc:"Read the crowd, build energy, drop the right track at the right moment. Pure crowd alchemy.",tags:["Live","Club","High-energy"],match:{"Club / festival":3,"House & techno":2,"CDJs / USB":1}},{name:"Turntablism",emoji:"📀",vibe:"The Vinyl Virtuoso",desc:"Scratching, beat juggling, turntable tricks. The DJ setup becomes a musical instrument.",tags:["Vinyl","Skills","Hip-hop"],match:{"Hip-hop & open format":2,"Vinyl turntables":3,"House parties":1}},{name:"Streaming DJ",emoji:"📡",vibe:"The Digital Curator",desc:"Build an audience through online sets and curated mixes. No venue needed.",tags:["Online","Curated","Flexible"],match:{"Online streaming":3,"Experimental":2,"Controller + laptop":2}}]},
  "Vinyl Collecting":{questions:[{q:"What era draws you?",icon:"📅",options:["60s–70s classics","80s–90s gems","Modern pressings"]},{q:"Your hunting style?",icon:"🔍",options:["Crate digging in shops","Online hunting","Flea markets"]},{q:"Listen or display?",icon:"👂",options:["All about the sound","Art & collectibility","Both equally"]}],subs:[{name:"Audiophile Listening",emoji:"🎧",vibe:"The Sound Purist",desc:"Invest in great turntables, preamps, and speakers. Chase the warmest, most faithful sound.",tags:["Hi-fi","Quality","Ritual"],match:{"All about the sound":3,"60s–70s classics":2,"Online hunting":1}},{name:"Rare Record Hunting",emoji:"🕵️",vibe:"The Treasure Hunter",desc:"Track down first pressings, limited editions, and forgotten gems. The thrill is in the hunt.",tags:["Rare","Valuable","Detective work"],match:{"Crate digging in shops":3,"Art & collectibility":2,"80s–90s gems":1}},{name:"Label Curation",emoji:"🏷️",vibe:"The Tastemaker",desc:"Collect by label, genre, or theme. Build a curated library that tells a story.",tags:["Curated","Thematic","Knowledge"],match:{"Both equally":2,"Modern pressings":2,"Flea markets":2}}]},
  "Book Club":{questions:[{q:"What do you love reading?",icon:"📚",options:["Literary fiction","Non-fiction","Genre fiction (sci-fi, mystery)"]},{q:"Discussion style?",icon:"💬",options:["Deep analytical dives","Casual & social","Debate & challenge"]},{q:"Meeting preference?",icon:"📍",options:["In-person","Virtual / online","Hybrid"]}],subs:[{name:"Literary Salon",emoji:"🕯️",vibe:"The Deep Thinker",desc:"Small-group deep dives into literary works. Ideas, wine, and big questions.",tags:["Intimate","Analytical","Curated"],match:{"Literary fiction":3,"Deep analytical dives":3,"In-person":1}},{name:"Genre Reading Circle",emoji:"🚀",vibe:"The Enthusiast",desc:"Find your people — mystery buffs, sci-fi nerds, romance lovers. Niche is where the passion lives.",tags:["Genre-focused","Passionate","Fun"],match:{"Genre fiction (sci-fi, mystery)":3,"Casual & social":2,"Hybrid":1}},{name:"Online Book Community",emoji:"🌐",vibe:"The Connected Reader",desc:"Join Goodreads groups, BookTok, or Discord servers. Global discussions on your schedule.",tags:["Flexible","Global","Digital"],match:{"Non-fiction":1,"Debate & challenge":2,"Virtual / online":3}}]},
  "Creative Writing":{questions:[{q:"What do you want to write?",icon:"✍️",options:["Short stories","Poetry","Novels & long-form"]},{q:"Your writing energy?",icon:"⚡",options:["Daily discipline","Bursts of inspiration","Weekend deep dives"]},{q:"Feedback preference?",icon:"📝",options:["Workshop with peers","Solo & private","Publish & see"]}],subs:[{name:"Flash Fiction",emoji:"⚡",vibe:"The Sharp Storyteller",desc:"Complete stories in under 1,000 words. Every word earns its place. Addictively tight.",tags:["Short","Challenging","Quick wins"],match:{"Short stories":3,"Bursts of inspiration":2,"Publish & see":1}},{name:"Poetry Practice",emoji:"🌹",vibe:"The Word Artist",desc:"From haiku to free verse. Poetry sharpens your ear for language like nothing else.",tags:["Lyrical","Expressive","Compact"],match:{"Poetry":3,"Solo & private":2,"Daily discipline":1}},{name:"Novel Writing",emoji:"📕",vibe:"The World Builder",desc:"Commit to a novel — 50,000 words or at your own pace. Epic and rewarding.",tags:["Long-form","Ambitious","Community"],match:{"Novels & long-form":3,"Weekend deep dives":2,"Workshop with peers":2}}]},
  "Journaling & Sketching":{questions:[{q:"Words or visuals?",icon:"🎨",options:["Mostly writing","Mostly drawing","Both together"]},{q:"Your purpose?",icon:"🎯",options:["Self-reflection","Creative outlet","Memory keeping"]},{q:"Structure level?",icon:"📐",options:["Freeform & messy","Guided prompts","Structured & organized"]}],subs:[{name:"Bullet Journaling",emoji:"📓",vibe:"The Organized Creative",desc:"A customizable system for tracking, planning, and reflecting. Part planner, part diary, part art.",tags:["Organized","Customizable","Visual"],match:{"Both together":2,"Memory keeping":2,"Structured & organized":3}},{name:"Morning Pages",emoji:"☀️",vibe:"The Daily Excavator",desc:"Three pages of stream-of-consciousness every morning. Clears mental fog and unlocks creativity.",tags:["Freeform","Daily","Therapeutic"],match:{"Mostly writing":3,"Self-reflection":3,"Freeform & messy":1}},{name:"Sketchbook Practice",emoji:"✏️",vibe:"The Visual Thinker",desc:"Carry a sketchbook everywhere. Draw what you see, imagine, and feel. No rules.",tags:["Drawing","Portable","Observational"],match:{"Mostly drawing":3,"Creative outlet":2,"Guided prompts":1}}]},
  "Language Learning":{questions:[{q:"Why learn a language?",icon:"🌍",options:["Travel prep","Career advantage","Cultural passion"]},{q:"Learning style?",icon:"📚",options:["Apps & self-paced","Classes & tutors","Immersion / conversation"]},{q:"Time daily?",icon:"⏰",options:["15 minutes","30–60 minutes","1 hour+"]}],subs:[{name:"Language Exchange",emoji:"🗣️",vibe:"The Conversationalist",desc:"Partner with native speakers who want to learn your language. Real conversation from day one.",tags:["Social","Free","Immersive"],match:{"Cultural passion":2,"Immersion / conversation":3,"30–60 minutes":1}},{name:"Polyglot Challenge",emoji:"🏆",vibe:"The Collector",desc:"Learn multiple languages simultaneously or sequentially. Build a multilingual brain.",tags:["Ambitious","Systematic","Long-term"],match:{"Career advantage":2,"Apps & self-paced":2,"1 hour+":3}},{name:"Cultural Immersion Study",emoji:"📺",vibe:"The Deep Diver",desc:"Learn through movies, music, books, and cooking from your target culture.",tags:["Cultural","Fun","Contextual"],match:{"Travel prep":2,"Cultural passion":3,"15 minutes":1}}]},
  "Calligraphy":{questions:[{q:"What style?",icon:"🖊️",options:["Modern brush lettering","Traditional / gothic","East Asian"]},{q:"Your tools?",icon:"🛠️",options:["Brush pens","Dip pen & ink","Digital tablet"]},{q:"Purpose?",icon:"🎯",options:["Personal relaxation","Create gifts & cards","Sell work"]}],subs:[{name:"Brush Lettering",emoji:"🖌️",vibe:"The Modern Artist",desc:"Flowing, expressive letterforms using brush pens. Instagram-worthy and deeply satisfying.",tags:["Modern","Accessible","Expressive"],match:{"Modern brush lettering":3,"Brush pens":2,"Create gifts & cards":1}},{name:"Copperplate Script",emoji:"🪶",vibe:"The Classical Scribe",desc:"Elegant, formal scripts using pointed pen and ink. Beautiful handwriting at its peak.",tags:["Classical","Precise","Elegant"],match:{"Traditional / gothic":3,"Dip pen & ink":2,"Personal relaxation":1}},{name:"East Asian Brush",emoji:"🎋",vibe:"The Zen Practitioner",desc:"Meditative brush strokes rooted in centuries of tradition. Where writing becomes painting.",tags:["Meditative","Cultural","Zen"],match:{"East Asian":3,"Personal relaxation":2,"Dip pen & ink":1}}]},
  "Filmmaking":{questions:[{q:"What do you want to make?",icon:"🎬",options:["Short films","Documentaries","YouTube / social"]},{q:"Your role preference?",icon:"🎭",options:["Director","Cinematographer","Editor"]},{q:"Equipment?",icon:"📱",options:["Smartphone only","Budget DSLR","Full kit"]}],subs:[{name:"Mobile Filmmaking",emoji:"📱",vibe:"The Pocket Director",desc:"Shoot cinematic content with just your phone. Constraints breed creativity.",tags:["Accessible","Creative","Modern"],match:{"YouTube / social":2,"Director":1,"Smartphone only":3}},{name:"Short Film Festivals",emoji:"🏆",vibe:"The Festival Circuit",desc:"Write, shoot, and submit to film festivals. The indie path to storytelling glory.",tags:["Narrative","Competitive","Community"],match:{"Short films":3,"Director":2,"Budget DSLR":1}},{name:"Documentary Making",emoji:"🎞️",vibe:"The Truth Seeker",desc:"Tell real stories that matter. Interview, observe, and craft narratives from reality.",tags:["Non-fiction","Impactful","Research"],match:{"Documentaries":3,"Cinematographer":1,"Full kit":1}}]},
  "Film Criticism & Blogging":{questions:[{q:"Your approach?",icon:"🍿",options:["Deep analysis","Casual reviews","Video essays"]},{q:"Favorite film era?",icon:"📽️",options:["Classic Hollywood","Modern blockbusters","World / arthouse"]},{q:"Platform?",icon:"📱",options:["Written blog","YouTube channel","Social (Letterboxd etc.)"]}],subs:[{name:"Video Essay Creation",emoji:"🎬",vibe:"The Visual Essayist",desc:"Combine film clips, narration, and insight into compelling video essays.",tags:["Video","Analytical","Creative"],match:{"Video essays":3,"Modern blockbusters":1,"YouTube channel":3}},{name:"Letterboxd & Film Logging",emoji:"⭐",vibe:"The Watchlist Curator",desc:"Rate, review, and track every film. Build your cinematic autobiography.",tags:["Social","Quick","Community"],match:{"Casual reviews":3,"World / arthouse":1,"Social (Letterboxd etc.)":3}},{name:"Long-form Film Writing",emoji:"📝",vibe:"The Critic's Critic",desc:"In-depth essays that dig into theme, technique, and cultural impact.",tags:["Analytical","Written","In-depth"],match:{"Deep analysis":3,"Classic Hollywood":2,"Written blog":2}}]},
  "Photography":{questions:[{q:"What do you love shooting?",icon:"📸",options:["People & portraits","Landscapes & nature","Street & urban"]},{q:"Camera preference?",icon:"📷",options:["Smartphone","Mirrorless / DSLR","Film camera"]},{q:"Post-processing?",icon:"🖥️",options:["Minimal editing","Love Lightroom","Straight out of camera"]}],subs:[{name:"Street Photography",emoji:"🏙️",vibe:"The Urban Observer",desc:"Capture candid moments in public spaces. A split-second art form that rewards patience.",tags:["Candid","Urban","Documentary"],match:{"Street & urban":3,"Minimal editing":1,"Mirrorless / DSLR":1}},{name:"Film Photography",emoji:"🎞️",vibe:"The Analog Purist",desc:"36 exposures, no chimping. Every frame counts. Beautifully intentional.",tags:["Analog","Tactile","Nostalgic"],match:{"Landscapes & nature":1,"Film camera":3,"Straight out of camera":2}},{name:"Portrait Photography",emoji:"🖼️",vibe:"The People Person",desc:"Learn lighting, posing, and connection. Capture people at their most authentic.",tags:["People","Lighting","Studio"],match:{"People & portraits":3,"Love Lightroom":2,"Smartphone":1}}]},
  "Animation & Motion Design":{questions:[{q:"What style?",icon:"🎨",options:["2D hand-drawn","3D modeling","Motion graphics"]},{q:"Purpose?",icon:"🎯",options:["Tell stories","Make cool visuals","Career skill"]},{q:"Tools?",icon:"🖥️",options:["iPad & Procreate","After Effects / Blender","Free & open source"]}],subs:[{name:"2D Character Animation",emoji:"✏️",vibe:"The Cartoon Creator",desc:"Bring characters to life frame by frame. Classic skills that never go out of style.",tags:["Hand-drawn","Storytelling","Classic"],match:{"2D hand-drawn":3,"Tell stories":2,"iPad & Procreate":1}},{name:"3D Modeling & Rendering",emoji:"🧊",vibe:"The Digital Sculptor",desc:"Build 3D worlds and characters. From Blender tutorials to photorealistic renders.",tags:["3D","Technical","Impressive"],match:{"3D modeling":3,"Career skill":2,"Free & open source":1}},{name:"Motion Graphics",emoji:"✨",vibe:"The Visual Communicator",desc:"Animate text, shapes, and data into slick explainer videos and visual stories.",tags:["Typography","Data-viz","Professional"],match:{"Motion graphics":3,"Make cool visuals":2,"After Effects / Blender":2}}]},
  "Screenwriting":{questions:[{q:"What format?",icon:"📝",options:["Feature film","TV series / pilot","Short scripts"]},{q:"Genre love?",icon:"🎭",options:["Drama","Comedy","Sci-fi & thriller"]},{q:"Your approach?",icon:"⚙️",options:["Outline everything","Discovery write","Adapt from source"]}],subs:[{name:"Short Script Comps",emoji:"🏆",vibe:"The Sharp Storyteller",desc:"Write 5–15 page scripts for competitions and festivals. Tight deadlines, tight stories.",tags:["Short-form","Competitive","Portfolio"],match:{"Short scripts":3,"Drama":1,"Outline everything":1}},{name:"TV Spec Writing",emoji:"📺",vibe:"The Series Architect",desc:"Write pilots and spec episodes. Build worlds that unfold over seasons.",tags:["Episodic","World-building","Industry"],match:{"TV series / pilot":3,"Comedy":1,"Discovery write":1}},{name:"Screenplay Adaptation",emoji:"📚",vibe:"The Translator",desc:"Turn books and true stories into scripts. Making one medium speak another's language.",tags:["Adaptation","Research","Layered"],match:{"Feature film":2,"Sci-fi & thriller":1,"Adapt from source":3}}]},
  "Home Theater Setup":{questions:[{q:"What's your priority?",icon:"🎬",options:["Picture quality","Sound system","Full experience"]},{q:"Budget approach?",icon:"💰",options:["Best bang for buck","Mid-range","Go all out"]},{q:"Room situation?",icon:"🏠",options:["Dedicated room","Living room","Small space"]}],subs:[{name:"Projector Cinema Room",emoji:"📽️",vibe:"The Big Screen Builder",desc:"100+ inch projected image, blackout curtains, the real cinema experience at home.",tags:["Projector","Immersive","Dedicated"],match:{"Picture quality":2,"Go all out":2,"Dedicated room":3}},{name:"Hi-Fi Audio Setup",emoji:"🔊",vibe:"The Sound Perfectionist",desc:"Surround sound, subwoofers, acoustic treatment. Feel every explosion and whispered line.",tags:["Audio","Surround","Technical"],match:{"Sound system":3,"Mid-range":2,"Living room":1}},{name:"Smart Streaming Hub",emoji:"📱",vibe:"The Convenience King",desc:"4K TV, soundbar, smart lighting, one-touch automation. Movie night made effortless.",tags:["Smart home","Compact","Modern"],match:{"Full experience":2,"Best bang for buck":2,"Small space":3}}]},
  "Backpacking":{questions:[{q:"What type of travel?",icon:"🌍",options:["Hostel hopping","Wilderness trekking","Cultural immersion"]},{q:"Solo or group?",icon:"👥",options:["Solo adventurer","With friends","Meet people on the way"]},{q:"Comfort level?",icon:"🏕️",options:["Roughing it","Basic comfort","Flashpacking"]}],subs:[{name:"Thru-Hiking",emoji:"🥾",vibe:"The Long-Distance Walker",desc:"Famous trails end-to-end — the AT, PCT, Camino. Months of walking, a lifetime of stories.",tags:["Wilderness","Multi-month","Life-changing"],match:{"Wilderness trekking":3,"Solo adventurer":2,"Roughing it":2}},{name:"Budget Hostel Travel",emoji:"🛏️",vibe:"The Social Nomad",desc:"Hop between cities, meet travelers from everywhere, stretch your budget to the max.",tags:["Social","Urban","Budget"],match:{"Hostel hopping":3,"Meet people on the way":3,"Basic comfort":1}},{name:"Voluntourism",emoji:"🤝",vibe:"The Purposeful Traveler",desc:"Work on farms, teach, or help communities in exchange for room and board. Travel with meaning.",tags:["Cultural","Meaningful","Extended"],match:{"Cultural immersion":3,"With friends":1,"Flashpacking":1}}]},
  "Travel Photography":{questions:[{q:"Your subject focus?",icon:"📷",options:["Landscapes","People & culture","Food & street life"]},{q:"Sharing approach?",icon:"📱",options:["Instagram / social","Print & gallery","Personal archive"]},{q:"Gear level?",icon:"🎒",options:["Phone only","Compact camera","Full kit"]}],subs:[{name:"Landscape & Adventure",emoji:"🏔️",vibe:"The Vista Chaser",desc:"Chase golden hours, dramatic weather, and epic viewpoints. Nature as your canvas.",tags:["Landscape","Golden hour","Epic"],match:{"Landscapes":3,"Print & gallery":2,"Full kit":1}},{name:"Travel Content Creation",emoji:"📱",vibe:"The Digital Storyteller",desc:"Build a following sharing journeys through photos and reels. Turn trips into content.",tags:["Social media","Storytelling","Brand"],match:{"Food & street life":1,"Instagram / social":3,"Phone only":2}},{name:"Documentary Travel Photo",emoji:"🌍",vibe:"The Cultural Chronicler",desc:"Photograph people, traditions, and daily life with depth and respect.",tags:["Cultural","Intimate","Meaningful"],match:{"People & culture":3,"Personal archive":2,"Compact camera":1}}]},
  "Cooking World Cuisines":{questions:[{q:"Your flavor profile?",icon:"🌶️",options:["Asian cuisines","Mediterranean & Middle Eastern","Latin American"]},{q:"Cooking style?",icon:"👨‍🍳",options:["Quick weeknight meals","Weekend projects","All-day feasts"]},{q:"Learning method?",icon:"📖",options:["YouTube & recipes","Cooking classes","Travel & eat"]}],subs:[{name:"Asian Cooking Mastery",emoji:"🍜",vibe:"The Wok Warrior",desc:"Master stir-fries, curries, sushi, and dumplings. A lifetime of flavors to explore.",tags:["Diverse","Umami","Technique"],match:{"Asian cuisines":3,"Quick weeknight meals":1,"YouTube & recipes":1}},{name:"Bread & Fermentation",emoji:"🍞",vibe:"The Patient Alchemist",desc:"Sourdough, kimchi, miso, kombucha. Slow food that transforms simple ingredients into magic.",tags:["Fermented","Patient","Science"],match:{"Mediterranean & Middle Eastern":1,"Weekend projects":3,"Cooking classes":1}},{name:"Supper Club Hosting",emoji:"🍽️",vibe:"The Gathering Creator",desc:"Cook multi-course themed dinners for friends. Part chef, part host, part experience designer.",tags:["Social","Themed","Impressive"],match:{"Latin American":1,"All-day feasts":3,"Travel & eat":2}}]},
  "Scuba Diving":{questions:[{q:"What attracts you?",icon:"🤿",options:["Marine life","Underwater exploration","Thrill / adrenaline"]},{q:"Commitment level?",icon:"📋",options:["Try it once","Get certified","Make it a lifestyle"]},{q:"Water preference?",icon:"🌊",options:["Warm tropical","Cold water","Wherever"]}],subs:[{name:"Reef & Marine Life Diving",emoji:"🐠",vibe:"The Ocean Observer",desc:"Explore coral reefs and encounter turtles, mantas, and reef sharks. Underwater safari.",tags:["Tropical","Wildlife","Colorful"],match:{"Marine life":3,"Get certified":2,"Warm tropical":2}},{name:"Wreck & Cave Diving",emoji:"🚢",vibe:"The Deep Explorer",desc:"Descend into shipwrecks and underwater caves. History and mystery beneath the surface.",tags:["Advanced","Exploration","Technical"],match:{"Underwater exploration":3,"Make it a lifestyle":2,"Cold water":1}},{name:"Freediving",emoji:"🧘‍♂️",vibe:"The Breath Artist",desc:"Dive on a single breath. Minimalist, meditative, and incredibly connected to the water.",tags:["No tanks","Meditative","Athletic"],match:{"Thrill / adrenaline":2,"Try it once":1,"Wherever":2}}]},
  "Urban Sketching":{questions:[{q:"Your subject?",icon:"✏️",options:["Architecture","People & cafés","Nature in the city"]},{q:"Media preference?",icon:"🎨",options:["Pen & ink","Watercolor & ink","Mixed media"]},{q:"Sketch pace?",icon:"⏱️",options:["Quick 5-min sketches","Detailed 30-min","All-afternoon sessions"]}],subs:[{name:"Architectural Sketching",emoji:"🏛️",vibe:"The Perspective Master",desc:"Capture buildings, doorways, and cityscapes with precision and character.",tags:["Architecture","Perspective","Detail"],match:{"Architecture":3,"Pen & ink":2,"Detailed 30-min":2}},{name:"Watercolor Travel Journal",emoji:"🎨",vibe:"The Color Storyteller",desc:"Paint loose, colorful scenes in a travel journal. Each page a memory in watercolor.",tags:["Watercolor","Loose","Colorful"],match:{"Nature in the city":2,"Watercolor & ink":3,"All-afternoon sessions":1}},{name:"Café Sketching",emoji:"☕",vibe:"The People Watcher",desc:"Sit in cafés and sketch the world going by. Quick gesture drawings that capture personality.",tags:["People","Quick","Observational"],match:{"People & cafés":3,"Mixed media":1,"Quick 5-min sketches":3}}]},
  "Geocaching":{questions:[{q:"What type of adventure?",icon:"🗺️",options:["Urban treasure hunts","Wilderness hikes","Puzzle challenges"]},{q:"Who with?",icon:"👥",options:["Solo missions","Family activity","With friends"]},{q:"Excitement level?",icon:"⚡",options:["Casual explorer","Completionist","Hide my own caches"]}],subs:[{name:"Puzzle Cache Solving",emoji:"🧩",vibe:"The Code Breaker",desc:"Decrypt clues, solve riddles, and crack codes to find hidden caches.",tags:["Puzzles","Mental","Challenging"],match:{"Puzzle challenges":3,"Solo missions":2,"Completionist":1}},{name:"Family Geocaching",emoji:"👨‍👩‍👧‍👦",vibe:"The Family Explorer",desc:"Turn any walk into a treasure hunt. Kids love it, everyone gets outdoors.",tags:["Family","Outdoor","Educational"],match:{"Urban treasure hunts":1,"Family activity":3,"Casual explorer":2}},{name:"Cache Building",emoji:"🔨",vibe:"The Game Master",desc:"Design and hide your own caches. Create themed trails and multi-step adventures.",tags:["Creative","Community","Building"],match:{"Wilderness hikes":1,"With friends":1,"Hide my own caches":3}}]},
  "Camping & Overlanding":{questions:[{q:"Camping style?",icon:"⛺",options:["Tent & backpack","Car camping","Van / overlanding rig"]},{q:"What's the draw?",icon:"🌲",options:["Wilderness solitude","Campfire social time","DIY & gear building"]},{q:"Duration?",icon:"📅",options:["Weekend trips","Week-long","Extended road trips"]}],subs:[{name:"Ultralight Backpacking",emoji:"🎒",vibe:"The Gram Counter",desc:"Strip your pack to the essentials and go further, faster. Minimalism meets wilderness.",tags:["Lightweight","Wilderness","Minimalist"],match:{"Tent & backpack":3,"Wilderness solitude":2,"Weekend trips":1}},{name:"Van Life",emoji:"🚐",vibe:"The Rolling Nomad",desc:"Build out a van and hit the road indefinitely. Home is wherever you park it.",tags:["Vehicle","Freedom","DIY build"],match:{"Van / overlanding rig":3,"DIY & gear building":2,"Extended road trips":2}},{name:"Bushcraft",emoji:"🪓",vibe:"The Wilderness Expert",desc:"Master fire-making, shelter building, foraging, and outdoor cooking. Primal and satisfying.",tags:["Skills","Primitive","Self-reliant"],match:{"Car camping":1,"Campfire social time":1,"Week-long":2}}]},
  "Indoor Gardening":{questions:[{q:"What do you want to grow?",icon:"🪴",options:["Tropical houseplants","Succulents & cacti","Herbs & edibles"]},{q:"Your light situation?",icon:"☀️",options:["Bright sunny windows","Low-light rooms","I'll add grow lights"]},{q:"Care commitment?",icon:"⏰",options:["Low-maintenance only","Happy to fuss daily","Somewhere in between"]}],subs:[{name:"Rare Houseplant Collecting",emoji:"🌿",vibe:"The Collector",desc:"Hunt down variegated monstera, pink princess philodendrons, and other coveted specimens.",tags:["Rare","Collectible","Investment"],match:{"Tropical houseplants":3,"I'll add grow lights":2,"Happy to fuss daily":2}},{name:"Desert & Succulent Garden",emoji:"🌵",vibe:"The Minimalist Gardener",desc:"Build a stunning low-water collection of succulents, cacti, and desert plants.",tags:["Low-water","Architectural","Easy"],match:{"Succulents & cacti":3,"Bright sunny windows":2,"Low-maintenance only":2}},{name:"Indoor Kitchen Garden",emoji:"🌿",vibe:"The Home Grower",desc:"Grow fresh herbs, microgreens, and small veggies on your windowsill.",tags:["Edible","Practical","Fresh"],match:{"Herbs & edibles":3,"Low-light rooms":1,"Somewhere in between":2}}]},
  "Community Gardening":{questions:[{q:"What motivates you?",icon:"🌱",options:["Growing food together","Beautifying the neighborhood","Meeting new people"]},{q:"Your experience level?",icon:"📊",options:["Total beginner","Some garden experience","Experienced grower"]},{q:"Time commitment?",icon:"⏰",options:["A few hours weekly","Full weekends","As much as possible"]}],subs:[{name:"Allotment Gardening",emoji:"🥬",vibe:"The Plot Keeper",desc:"Rent your own growing plot and cultivate a productive food garden.",tags:["Productive","Seasonal","Outdoor"],match:{"Growing food together":3,"Experienced grower":2,"Full weekends":2}},{name:"Garden Club & Workshops",emoji:"🌸",vibe:"The Learner",desc:"Join local garden clubs, attend workshops, and learn alongside fellow enthusiasts.",tags:["Educational","Social","Beginner-friendly"],match:{"Meeting new people":3,"Total beginner":2,"A few hours weekly":2}},{name:"Neighborhood Beautification",emoji:"🌻",vibe:"The Street Gardener",desc:"Guerrilla gardening, street planters, and public space greening. Make your block bloom.",tags:["Community","Impact","Creative"],match:{"Beautifying the neighborhood":3,"Some garden experience":1,"As much as possible":2}}]},
  "Terrariums & Miniature Gardens":{questions:[{q:"What scale?",icon:"🫧",options:["Tiny sealed terrariums","Open dish gardens","Fairy garden scenes"]},{q:"Style preference?",icon:"🎨",options:["Natural & wild","Geometric & modern","Fantasy & whimsical"]},{q:"Your goal?",icon:"🎯",options:["Home décor","Gifts for others","Sell at markets"]}],subs:[{name:"Closed Terrarium Building",emoji:"🏺",vibe:"The Ecosystem Architect",desc:"Build self-sustaining glass ecosystems that water themselves. Living snow globes.",tags:["Self-sustaining","Scientific","Glass"],match:{"Tiny sealed terrariums":3,"Natural & wild":2,"Home décor":1}},{name:"Fairy & Miniature Gardens",emoji:"🧚",vibe:"The World Builder",desc:"Create tiny enchanted landscapes with miniature furniture, pathways, and living plants.",tags:["Whimsical","Detailed","Fun"],match:{"Fairy garden scenes":3,"Fantasy & whimsical":2,"Gifts for others":1}},{name:"Modern Terrarium Design",emoji:"💎",vibe:"The Design Purist",desc:"Geometric glass vessels, curated plants, and clean aesthetics. Minimalist living art.",tags:["Modern","Geometric","Stylish"],match:{"Open dish gardens":2,"Geometric & modern":3,"Sell at markets":2}}]},
  "Vegetable Gardening":{questions:[{q:"Growing space?",icon:"🏡",options:["Backyard plot","Raised beds / containers","Balcony / patio"]},{q:"What do you want to grow?",icon:"🥕",options:["Salad greens & herbs","Tomatoes & peppers","Root veggies & squash"]},{q:"Your approach?",icon:"🌿",options:["Organic & natural","Maximum yield","Experimental / unusual varieties"]}],subs:[{name:"Square Foot Gardening",emoji:"📐",vibe:"The Efficient Grower",desc:"Maximize yield in minimal space with organized raised beds.",tags:["Efficient","Organized","High-yield"],match:{"Raised beds / containers":3,"Maximum yield":2,"Tomatoes & peppers":1}},{name:"Permaculture & No-Dig",emoji:"🌎",vibe:"The Earth Steward",desc:"Work with nature, not against it. Build living soil and a self-sustaining food ecosystem.",tags:["Sustainable","Organic","Long-term"],match:{"Backyard plot":2,"Organic & natural":3,"Root veggies & squash":1}},{name:"Container & Balcony Veg",emoji:"🪴",vibe:"The Urban Farmer",desc:"Grow surprisingly productive gardens in pots on your balcony or patio.",tags:["Small-space","Accessible","Urban"],match:{"Balcony / patio":3,"Salad greens & herbs":2,"Experimental / unusual varieties":1}}]},
  "Plant Propagation & Trading":{questions:[{q:"Your propagation style?",icon:"✂️",options:["Water propagation","Soil & moss methods","Division & air layering"]},{q:"Trading preference?",icon:"🔄",options:["Local plant swaps","Online communities","Both"]},{q:"What excites you most?",icon:"⚡",options:["Growing my collection","Sharing with others","Breeding new varieties"]}],subs:[{name:"Propagation Station",emoji:"🧪",vibe:"The Plant Multiplier",desc:"Turn one plant into dozens with cuttings, division, and layering.",tags:["Cuttings","Water props","Addictive"],match:{"Water propagation":3,"Growing my collection":2,"Online communities":1}},{name:"Plant Swap Community",emoji:"🤝",vibe:"The Trader",desc:"Join local and online plant swaps. Trade extras for wishlist plants.",tags:["Social","Trading","Community"],match:{"Local plant swaps":2,"Sharing with others":3,"Both":2}},{name:"Hybridization & Breeding",emoji:"🧬",vibe:"The Plant Scientist",desc:"Cross-pollinate plants to create new varieties. Patient and experimental.",tags:["Advanced","Scientific","Creative"],match:{"Division & air layering":2,"Breeding new varieties":3,"Online communities":1}}]},
  "Botanical Illustration":{questions:[{q:"Your medium?",icon:"🎨",options:["Watercolor","Pencil & ink","Digital"]},{q:"Subject preference?",icon:"🌺",options:["Flowers & blooms","Leaves & ferns","Whole plant studies"]},{q:"Purpose?",icon:"🎯",options:["Personal journal","Wall art & prints","Scientific accuracy"]}],subs:[{name:"Watercolor Botanicals",emoji:"🖌️",vibe:"The Nature Painter",desc:"Paint delicate, luminous botanical studies in watercolor. Classic and deeply calming.",tags:["Watercolor","Luminous","Traditional"],match:{"Watercolor":3,"Flowers & blooms":2,"Wall art & prints":1}},{name:"Scientific Botanical Drawing",emoji:"🔬",vibe:"The Precision Artist",desc:"Detailed pencil and ink illustrations with scientific accuracy. Art meets biology.",tags:["Precise","Scientific","Detailed"],match:{"Pencil & ink":3,"Whole plant studies":2,"Scientific accuracy":2}},{name:"Digital Plant Art",emoji:"💻",vibe:"The Modern Botanist",desc:"Create botanical illustrations on iPad or tablet. Undo, layers, infinite colors.",tags:["Digital","Modern","Flexible"],match:{"Digital":3,"Leaves & ferns":1,"Personal journal":2}}]},
  "Flower Arranging":{questions:[{q:"Your style?",icon:"💐",options:["Wild & natural","Structured & formal","Minimalist Japanese"]},{q:"Flower source?",icon:"🌷",options:["Grow my own","Buy from markets","Forage & wildflowers"]},{q:"Your goal?",icon:"🎯",options:["Home decoration","Events & gifts","Start a side business"]}],subs:[{name:"Ikebana (Japanese Arranging)",emoji:"🎋",vibe:"The Zen Arranger",desc:"Minimalist Japanese floral art emphasizing line, space, and seasonal beauty.",tags:["Minimalist","Meditative","Cultural"],match:{"Minimalist Japanese":3,"Forage & wildflowers":1,"Home decoration":2}},{name:"Garden-to-Vase Arranging",emoji:"🌸",vibe:"The Cottage Florist",desc:"Grow a cutting garden and create abundant, romantic arrangements from your own blooms.",tags:["Homegrown","Romantic","Seasonal"],match:{"Wild & natural":2,"Grow my own":3,"Events & gifts":1}},{name:"Event & Wedding Floristry",emoji:"🌹",vibe:"The Floral Designer",desc:"Design arrangements for weddings, parties, and special occasions.",tags:["Professional","Events","Design"],match:{"Structured & formal":3,"Buy from markets":2,"Start a side business":2}}]}
};

const allHobbiesFlat = Object.values(HOBBIES).flat();
const findHobbyData = (name) => allHobbiesFlat.find(h => h.name === name);

function getBudgetCeiling(b) {
  if (b === "<$50") return 50;
  if (b === "<$200") return 200;
  return 9999;
}

function computeTop3(gender, age, budget, socialPref, interests) {
  const ceil = getBudgetCeiling(budget);
  let candidates = [];
  interests.forEach(cat => {
    (HOBBIES[cat] || []).forEach(h => {
      if (h.budgetMin <= ceil) {
        let score = h.ageAppeal[age] || 3;
        if (h.genderBoost?.[gender]) score += h.genderBoost[gender];
        if (ceil > h.budgetMin + 100) score += 0.5;
        if (socialPref !== "Either") {
          if (h.socialType === socialPref) score += 2;
          else if (h.socialType === "Either") score += 1;
        }
        candidates.push({ ...h, score, interest: cat });
      }
    });
  });
  candidates.sort((a, b) => b.score - a.score);
  const seen = new Set();
  const top = [];
  for (const c of candidates) {
    if (!seen.has(c.name)) { seen.add(c.name); top.push(c); }
    if (top.length === 3) break;
  }
  return top;
}

function computeSubHobbies(hobbyName, answers) {
  const data = DRILLDOWN[hobbyName];
  if (!data) return [];
  return data.subs.map(sub => {
    let score = 0;
    answers.forEach(a => { score += (sub.match[a] || 0); });
    return { ...sub, score };
  }).sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════
//  STORAGE WRAPPER
// ═══════════════════════════════════════════════════════

const memStore = {};
const storage = {
  async get(k, shared) {
    try { if (window.storage) return await window.storage.get(k, shared); } catch {}
    if (memStore[k]) return { key: k, value: memStore[k], shared };
    throw new Error("Not found");
  },
  async set(k, v, shared) {
    try { if (window.storage) return await window.storage.set(k, v, shared); } catch {}
    memStore[k] = v;
    return { key: k, value: v, shared };
  },
  async list(prefix, shared) {
    try { if (window.storage) return await window.storage.list(prefix, shared); } catch {}
    return { keys: Object.keys(memStore).filter(k => k.startsWith(prefix)), prefix, shared };
  },
  async del(k, shared) {
    try { if (window.storage) return await window.storage.delete(k, shared); } catch {}
    delete memStore[k];
    return { key: k, deleted: true, shared };
  }
};

// ═══════════════════════════════════════════════════════
//  STYLES (CSS-in-JS via <style> tag approach in Tailwind env)
// ═══════════════════════════════════════════════════════

const S = {
  bg: "#0E0E12", surface: "#18181F", surfaceHover: "#222230",
  accent: "#E8FF47", text: "#F0EDE6", muted: "#8A8A9A",
  coral: "#FF6B6B", sky: "#6BC5FF", mint: "#6BFFC5", violet: "#B18CFF",
};

const rankColors = [S.accent, S.sky, S.coral];
const subRankColors = [S.violet, S.mint, S.sky];
const pqBgs = ["rgba(232,255,71,0.15)", "rgba(107,197,255,0.15)", "rgba(255,107,107,0.15)"];

// ═══════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════

export default function Hobnobber() {
  const [screen, setScreen] = useState("auth");
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const emailRef = useRef(); const passRef = useRef(); const nameRef = useRef();

  // Quiz state
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);
  const [budget, setBudget] = useState(null);
  const [socialPref, setSocialPref] = useState(null);
  const [interests, setInterests] = useState([]);

  // Results
  const [top3, setTop3] = useState([]);
  const [interestLabels, setInterestLabels] = useState([]);
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [pqAnswers, setPqAnswers] = useState([null, null, null]);
  const [subResults, setSubResults] = useState([]);
  const [saved, setSaved] = useState(false);

  // Profile / Matches
  const [matches, setMatches] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);

  const quizValid = gender && age && budget && socialPref && interests.length > 0;
  const pqValid = pqAnswers.every(a => a !== null);

  const toggleInterest = (v) => {
    setInterests(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  // AUTH
  const handleAuth = async () => {
    const email = emailRef.current?.value?.trim().toLowerCase();
    const pass = passRef.current?.value;
    const name = nameRef.current?.value?.trim();
    setAuthErr("");
    if (!email || !pass) { setAuthErr("Please fill in all fields"); return; }
    if (isSignUp && !name) { setAuthErr("Please enter a display name"); return; }
    const key = "hobnobber-user:" + email.replace(/[^a-z0-9]/g, "_");
    try {
      if (isSignUp) {
        let exists = false;
        try { const r = await storage.get(key, true); if (r?.value) exists = true; } catch {}
        if (exists) { setAuthErr("Account already exists"); return; }
        const ud = { email, name, pass, hobbies: [], createdAt: Date.now() };
        await storage.set(key, JSON.stringify(ud), true);
        setUser({ ...ud, _key: key });
      } else {
        let ud;
        try { const r = await storage.get(key, true); ud = JSON.parse(r.value); } catch {}
        if (!ud) { setAuthErr("No account found"); return; }
        if (ud.pass !== pass) { setAuthErr("Incorrect password"); return; }
        setUser({ ...ud, _key: key });
      }
      setScreen("quiz");
    } catch (e) { setAuthErr("Something went wrong"); }
  };

  const logout = () => { setUser(null); resetQuiz(); setScreen("auth"); };
  const skip = () => { setScreen("quiz"); };

  const resetQuiz = () => {
    setGender(null); setAge(null); setBudget(null); setSocialPref(null);
    setInterests([]); setTop3([]); setSelectedHobby(null);
    setPqAnswers([null, null, null]); setSubResults([]); setSaved(false);
  };

  const runQuiz = () => {
    const results = computeTop3(gender, age, budget, socialPref, interests);
    setTop3(results); setInterestLabels([...interests]); setSaved(false); setScreen("results");
  };

  const drillIn = (hobbyName) => {
    setSelectedHobby(hobbyName); setPqAnswers([null, null, null]); setScreen("drill");
  };

  const runDrill = () => {
    const subs = computeSubHobbies(selectedHobby, pqAnswers.filter(Boolean));
    setSubResults(subs); setScreen("subs");
  };

  const saveResults = async () => {
    if (!user || top3.length === 0) return;
    const newH = [...new Set([...user.hobbies, ...top3.map(h => h.name)])];
    const updated = { ...user, hobbies: newH };
    setUser(updated);
    try { await storage.set(user._key, JSON.stringify({ email: updated.email, name: updated.name, pass: updated.pass, hobbies: updated.hobbies, createdAt: updated.createdAt }), true); } catch {}
    setSaved(true);
  };

  const removeHobby = async (name) => {
    if (!user) return;
    const newH = user.hobbies.filter(h => h !== name);
    const updated = { ...user, hobbies: newH };
    setUser(updated);
    try { await storage.set(user._key, JSON.stringify({ email: updated.email, name: updated.name, pass: updated.pass, hobbies: updated.hobbies, createdAt: updated.createdAt }), true); } catch {}
  };

  const loadMatches = async () => {
    if (!user?.hobbies?.length) { setMatches([]); return; }
    setMatchLoading(true);
    try {
      const res = await storage.list("hobnobber-user:", true);
      const m = [];
      for (const k of (res?.keys || [])) {
        if (k === user._key) continue;
        try {
          const r = await storage.get(k, true);
          const u = JSON.parse(r.value);
          if (!u.hobbies?.length) continue;
          const shared = u.hobbies.filter(h => user.hobbies.includes(h));
          if (shared.length > 0) m.push({ name: u.name, email: u.email, shared });
        } catch {}
      }
      m.sort((a, b) => b.shared.length - a.shared.length);
      setMatches(m);
    } catch {}
    setMatchLoading(false);
  };

  useEffect(() => { if (screen === "match") loadMatches(); }, [screen]);

  // ─── CHIP COMPONENT ───
  const Chip = ({ selected, onClick, icon, children }) => (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8, padding: "12px 20px",
      background: selected ? "rgba(232,255,71,0.1)" : S.surface,
      border: `1.5px solid ${selected ? S.accent : "transparent"}`,
      borderRadius: 10, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "0.95rem",
      color: selected ? S.accent : S.text, cursor: "pointer", transition: "all 0.2s",
      boxShadow: selected ? "0 0 20px rgba(232,255,71,0.08)" : "none",
    }}>
      {icon && <span style={{ fontSize: "1.15rem" }}>{icon}</span>}
      {children}
    </button>
  );

  const PqChip = ({ selected, onClick, children }) => (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6, padding: "10px 18px",
      background: selected ? "rgba(177,140,255,0.12)" : S.surface,
      border: `1.5px solid ${selected ? S.violet : "transparent"}`,
      borderRadius: 10, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "0.9rem",
      color: selected ? S.violet : S.text, cursor: "pointer", transition: "all 0.2s",
      boxShadow: selected ? "0 0 20px rgba(177,140,255,0.08)" : "none",
    }}>
      {children}
    </button>
  );

  const NavBtn = ({ onClick, children }) => (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, background: "none",
      border: "1.5px solid #333", color: S.muted, fontFamily: "'Bricolage Grotesque',sans-serif",
      fontSize: "0.9rem", fontWeight: 600, padding: "12px 28px", borderRadius: 100,
      cursor: "pointer", transition: "all 0.2s",
    }}>{children}</button>
  );

  const CtaBtn = ({ onClick, disabled, bg, color, children }) => (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 48px",
      background: bg || S.accent, color: color || S.bg,
      fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "1.1rem", fontWeight: 800,
      border: "none", borderRadius: 100, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, transition: "all 0.3s",
    }}>{children}</button>
  );

  // ─── TOP BAR ───
  const TopBar = () => {
    if (!user) return screen !== "auth" ? (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "12px 16px", background: S.surface, borderRadius: 10, border: "1px solid #2a2a35" }}>
        <span style={{ color: S.muted, fontSize: "0.88rem" }}>🔒 Not logged in</span>
        <NavBtn onClick={() => setScreen("auth")}>Log In / Sign Up</NavBtn>
      </div>
    ) : null;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, padding: "12px 16px", background: S.surface, borderRadius: 10, border: "1px solid #2a2a35", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: S.muted }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: S.accent, color: S.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem" }}>
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          {user.name || user.email}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <NavBtn onClick={() => { resetQuiz(); setScreen("quiz"); }}>Quiz</NavBtn>
          <NavBtn onClick={() => setScreen("profile")}>My Profile</NavBtn>
          <NavBtn onClick={() => setScreen("match")}>Find Hobnobbers</NavBtn>
          <NavBtn onClick={logout}>Log Out</NavBtn>
        </div>
      </div>
    );
  };

  // ─── SCREENS ───
  return (
    <div style={{ background: S.bg, color: S.text, fontFamily: "'Bricolage Grotesque',sans-serif", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: S.accent, top: -100, right: -100, filter: "blur(100px)", opacity: 0.12, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", width: 300, height: 300, borderRadius: "50%", background: S.coral, bottom: "10%", left: -80, filter: "blur(100px)", opacity: 0.12, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <header style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: S.accent, color: S.bg, fontWeight: 800, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 24 }}>
            ⭐ Hobby Finder
          </div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(3.2rem,8vw,5.5rem)", fontWeight: 400, lineHeight: 1, letterSpacing: -2, marginBottom: 12 }}>
            Hob<em style={{ fontStyle: "italic", color: S.accent }}>nobber</em>
          </h1>
          <p style={{ fontSize: "1.05rem", color: S.muted, maxWidth: 380, margin: "0 auto", lineHeight: 1.5 }}>
            Answer a few quick questions and we'll match you with your next obsession.
          </p>
        </header>

        {screen !== "auth" && <TopBar />}

        {/* AUTH */}
        {screen === "auth" && (
          <div style={{ maxWidth: 400, margin: "0 auto", background: S.surface, borderRadius: 16, padding: "40px 32px", border: "1px solid #2a2a35" }}>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.8rem", fontWeight: 400, marginBottom: 6 }}>{isSignUp ? "Create an account" : "Welcome back"}</h2>
            <p style={{ color: S.muted, fontSize: "0.9rem", marginBottom: 24 }}>{isSignUp ? "Sign up to save hobbies and find matches" : "Log in to save results and find matches"}</p>
            {isSignUp && <input ref={nameRef} placeholder="Display name" style={{ width: "100%", padding: "14px 18px", background: S.bg, border: "1.5px solid #333", borderRadius: 10, color: S.text, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "0.95rem", marginBottom: 12, outline: "none" }} />}
            <input ref={emailRef} type="email" placeholder="Email address" style={{ width: "100%", padding: "14px 18px", background: S.bg, border: "1.5px solid #333", borderRadius: 10, color: S.text, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "0.95rem", marginBottom: 12, outline: "none" }} onKeyDown={e => e.key === "Enter" && handleAuth()} />
            <input ref={passRef} type="password" placeholder="Password" style={{ width: "100%", padding: "14px 18px", background: S.bg, border: "1.5px solid #333", borderRadius: 10, color: S.text, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "0.95rem", marginBottom: 12, outline: "none" }} onKeyDown={e => e.key === "Enter" && handleAuth()} />
            {authErr && <p style={{ color: S.coral, fontSize: "0.82rem", marginTop: 8 }}>{authErr}</p>}
            <button onClick={handleAuth} style={{ width: "100%", padding: 14, background: S.accent, color: S.bg, fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "1rem", fontWeight: 800, border: "none", borderRadius: 100, cursor: "pointer", marginTop: 8 }}>{isSignUp ? "Sign Up" : "Log In"}</button>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.85rem", color: S.muted }}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <a onClick={() => { setIsSignUp(!isSignUp); setAuthErr(""); }} style={{ color: S.accent, cursor: "pointer", fontWeight: 600 }}>{isSignUp ? "Log in" : "Sign up"}</a>
            </p>
            <p style={{ textAlign: "center", marginTop: 12 }}>
              <a onClick={skip} style={{ color: S.muted, cursor: "pointer", fontSize: "0.82rem" }}>Skip for now — browse without saving</a>
            </p>
          </div>
        )}

        {/* QUIZ */}
        {screen === "quiz" && (
          <div>
            {[
              { num: 1, title: "What's your gender?", options: [{ v: "Male", icon: "♂" }, { v: "Female", icon: "♀" }], val: gender, set: setGender },
              { num: 2, title: "What's your age range?", options: [{ v: "21-30" }, { v: "31-40" }, { v: "41-50" }, { v: "60+" }], val: age, set: setAge },
              { num: 3, title: "Monthly hobby budget?", options: [{ v: "<$50", icon: "💰", label: "Under $50" }, { v: "<$200", icon: "💵", label: "Under $200" }, { v: ">$300", icon: "💎", label: "$300+" }], val: budget, set: setBudget },
            ].map(step => (
              <div key={step.num} style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.surface, border: "1.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: S.muted }}>{step.num}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{step.title}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {step.options.map(o => <Chip key={o.v} selected={step.val === o.v} onClick={() => step.set(o.v)} icon={o.icon}>{o.label || o.v}</Chip>)}
                </div>
              </div>
            ))}

            {/* Interests */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.surface, border: "1.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: S.muted }}>4</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>Pick your interests</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[{ v: "Fitness", icon: "🏋️" }, { v: "Music", icon: "🎵" }, { v: "Reading", icon: "📚" }, { v: "Movies", icon: "🎬" }, { v: "Traveling", icon: "✈️" }, { v: "Plants", icon: "🌿" }].map(o => (
                  <Chip key={o.v} selected={interests.includes(o.v)} onClick={() => toggleInterest(o.v)} icon={o.icon}>{o.v}</Chip>
                ))}
              </div>
            </div>

            {/* Social pref */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.surface, border: "1.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: S.muted }}>5</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>Social or solo hobby?</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[{ v: "Social", icon: "👥" }, { v: "Solo", icon: "🧘" }, { v: "Either", icon: "🤷" }].map(o => (
                  <Chip key={o.v} selected={socialPref === o.v} onClick={() => setSocialPref(o.v)} icon={o.icon}>{o.v}</Chip>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 48 }}>
              <CtaBtn onClick={runQuiz} disabled={!quizValid}>Find My Hobbies →</CtaBtn>
              <p style={{ marginTop: 12, fontSize: "0.82rem", color: S.muted }}>Select at least one option from each category</p>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {screen === "results" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 400, letterSpacing: -1, marginBottom: 6 }}>Your perfect hobbies ✨</h2>
              <p style={{ color: S.muted, fontSize: "0.95rem" }}>Based on your love of {interestLabels.join(" & ")}</p>
            </div>
            {top3.map((h, i) => (
              <div key={h.name} onClick={() => drillIn(h.name)} style={{ position: "relative", background: S.surface, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 16, border: "1px solid #2a2a35", cursor: "pointer", transition: "transform 0.25s, box-shadow 0.25s" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", borderBottomLeftRadius: 16, background: rankColors[i], color: S.bg }}>#{i + 1}</div>
                <span style={{ fontSize: "2.2rem", display: "block", marginBottom: 12 }}>{h.emoji}</span>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: 6 }}>{h.name}</div>
                <div style={{ color: S.muted, fontSize: "0.9rem", lineHeight: 1.55, marginBottom: 16 }}>{h.why}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {h.tags.map(t => <span key={t} style={{ fontSize: "0.75rem", fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: S.muted }}>{t}</span>)}
                </div>
              </div>
            ))}
            <p style={{ textAlign: "center", color: S.muted, fontSize: "0.82rem", marginBottom: 24 }}>Click a hobby to dig deeper</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {user && (
                <button onClick={saveResults} disabled={saved} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px",
                  background: saved ? "#333" : S.mint, color: saved ? S.muted : S.bg,
                  fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "0.95rem", fontWeight: 800,
                  border: "none", borderRadius: 100, cursor: saved ? "not-allowed" : "pointer", opacity: saved ? 0.7 : 1,
                }}>{saved ? "✓ Saved to Profile" : "💾 Save to My Profile"}</button>
              )}
              <NavBtn onClick={() => { resetQuiz(); setScreen("quiz"); }}>Start Over</NavBtn>
            </div>
          </div>
        )}

        {/* DRILL-DOWN */}
        {screen === "drill" && selectedHobby && DRILLDOWN[selectedHobby] && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{ fontSize: "3.5rem", display: "block", marginBottom: 12 }}>{findHobbyData(selectedHobby)?.emoji || "🎯"}</span>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.8rem,4.5vw,2.4rem)", fontWeight: 400, letterSpacing: -1, marginBottom: 8 }}>
                Let's dial in your <em style={{ fontStyle: "italic", color: S.violet }}>{selectedHobby}</em>
              </h2>
              <p style={{ color: S.muted, fontSize: "0.95rem" }}>Answer 3 quick personality questions to find your perfect flavor.</p>
            </div>
            {DRILLDOWN[selectedHobby].questions.map((q, qi) => (
              <div key={qi} style={{ marginBottom: 32 }}>
                <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: pqBgs[qi], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>{q.icon}</span>
                  {q.q}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {q.options.map(opt => (
                    <PqChip key={opt} selected={pqAnswers[qi] === opt} onClick={() => setPqAnswers(prev => { const n = [...prev]; n[qi] = opt; return n; })}>{opt}</PqChip>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <CtaBtn onClick={runDrill} disabled={!pqValid} bg={S.violet} color="#fff">Show Me Specifics →</CtaBtn>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
              <NavBtn onClick={() => setScreen("results")}>← Back to results</NavBtn>
            </div>
          </div>
        )}

        {/* SUB-HOBBY RESULTS */}
        {screen === "subs" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(1.8rem,4.5vw,2.4rem)", fontWeight: 400, letterSpacing: -1, marginBottom: 6 }}>
                {findHobbyData(selectedHobby)?.emoji || "🎯"} Your {selectedHobby} flavor
              </h2>
              <p style={{ color: S.muted, fontSize: "0.95rem" }}>Here's where to start based on your personality</p>
            </div>
            {subResults.map((s, i) => (
              <div key={s.name} style={{ position: "relative", background: S.surface, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 16, border: "1px solid #2a2a35" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, borderBottomLeftRadius: 16, background: subRankColors[i], color: i === 0 ? "#fff" : S.bg }}>#{i + 1}</div>
                <span style={{ fontSize: "2.2rem", display: "block", marginBottom: 12 }}>{s.emoji}</span>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: S.violet, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{s.vibe}</div>
                <div style={{ color: S.muted, fontSize: "0.9rem", lineHeight: 1.55, marginBottom: 14 }}>{s.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.tags.map(t => <span key={t} style={{ fontSize: "0.75rem", fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.06)", color: S.muted }}>{t}</span>)}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
              <NavBtn onClick={() => setScreen("drill")}>← Back to questions</NavBtn>
              <NavBtn onClick={() => setScreen("results")}>← Back to results</NavBtn>
              <NavBtn onClick={() => { resetQuiz(); setScreen("quiz"); }}>Start Over</NavBtn>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {screen === "profile" && user && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 400, letterSpacing: -1, marginBottom: 6 }}>My Hobby Profile</h2>
              <p style={{ color: S.muted, fontSize: "0.95rem" }}>{user.email}</p>
            </div>
            {!user.hobbies?.length ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: S.muted }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🎯</span>
                <p>No hobbies saved yet. Take the quiz and save your results!</p>
              </div>
            ) : (
              <div>
                {user.hobbies.map(name => {
                  const hd = findHobbyData(name);
                  return (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: S.surface, border: "1px solid #2a2a35", borderRadius: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: "1.5rem" }}>{hd?.emoji || "🎯"}</span>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem", flex: 1 }}>{name}</span>
                      <button onClick={() => removeHobby(name)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: "0.8rem", padding: "4px 8px", borderRadius: 100 }}>✕ Remove</button>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32 }}>
              <NavBtn onClick={() => { resetQuiz(); setScreen("quiz"); }}>Take Quiz Again</NavBtn>
            </div>
          </div>
        )}

        {/* FIND HOBNOBBERS */}
        {screen === "match" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 400, letterSpacing: -1, marginBottom: 6 }}>Find Hobnobbers 🤝</h2>
              <p style={{ color: S.muted, fontSize: "0.95rem" }}>People who share your hobby matches</p>
            </div>
            {!user?.hobbies?.length ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: S.muted }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🤝</span>
                <p>Save some hobbies first, then come back to find matches!</p>
              </div>
            ) : matchLoading ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: S.muted }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🔍</span>
                <p>Searching for hobby matches...</p>
              </div>
            ) : matches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: S.muted }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🌍</span>
                <p>No matches yet — share Hobnobber to grow the community!</p>
              </div>
            ) : (
              <div>
                {matches.map((m, i) => {
                  const colors = [S.violet, S.sky, S.coral, S.mint, S.accent, "#FF9F6B"];
                  return (
                    <div key={i} style={{ background: S.surface, border: "1px solid #2a2a35", borderRadius: 16, padding: "20px 24px", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: colors[i % colors.length], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem" }}>{m.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "1rem" }}>{m.name}</div>
                          <div style={{ color: S.muted, fontSize: "0.8rem" }}>{m.shared.length} shared {m.shared.length === 1 ? "hobby" : "hobbies"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {m.shared.map(h => {
                          const hd = findHobbyData(h);
                          return <span key={h} style={{ fontSize: "0.78rem", fontWeight: 600, padding: "5px 14px", borderRadius: 100, background: "rgba(177,140,255,0.12)", color: S.violet }}>{hd?.emoji || "🎯"} {h}</span>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 32 }}>
              <NavBtn onClick={() => { resetQuiz(); setScreen("quiz"); }}>Take Quiz</NavBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
