const TWO_LETTER_WORDS = [
    "am", "an", "as", "at", "be", "by", "do", "go", "he", "hi", "if", "in", "is", "it", "me", "my", "no", "of", "on", "or", "so", "to", "up", "us", "we",
    "ox", "ah", "ha", "eh", "oh", "yo", "lo", "pa", "ma", "ex", "pi", "mu", "xi", "nu", "qi"
];

const THREE_LETTER_WORDS = [
    "act", "add", "age", "ago", "aim", "air", "all", "and", "any", "arm", "art", "ask", "bad", "bag", "bar", "bat", "bed", "bee", "big", "bit", "box", "boy", "bus", "but", "buy", "can", "car", "cat", "cow", "cry", "cup", "cut", "dad", "day", "did", "die", "dog", "dry", "due", "ear", "eat", "egg", "end", "eye", "far", "fat", "few", "fix", "fly", "for", "fun", "fur", "gap", "gas", "get", "god", "got", "gum", "gun", "guy", "had", "has", "hat", "her", "hey", "him", "his", "hit", "hot", "how", "ice", "ill", "ink", "its", "jaw", "job", "joy", "key", "kid", "kit", "law", "lay", "leg", "let", "lid", "lie", "lip", "log", "low", "mad", "man", "map", "mat", "may", "mix", "mom", "mud", "mug", "net", "new", "not", "now", "nut", "odd", "off", "oil", "old", "one", "out", "owl", "own", "pan", "pay", "pen", "pet", "pie", "pig", "pin", "pit", "pot", "put", "ran", "rap", "rat", "raw", "red", "rib", "rid", "rig", "rim", "rip", "rob", "rod", "row", "rub", "rug", "run", "sad", "saw", "say", "sea", "see", "set", "she", "shy", "sin", "sit", "sky", "sly", "son", "spy", "sum", "sun", "tab", "tag", "tan", "tap", "tax", "tea", "ten", "the", "tie", "tin", "tip", "toe", "ton", "top", "toy", "try", "tub", "two", "use", "van", "war", "was", "way", "web", "wed", "wet", "who", "why", "win", "won", "yes", "yet", "you", "zip", "zoo",
    "ace", "ape", "arc", "axe", "bid", "bin", "bow", "bun", "cab", "cap", "cod", "cot", "cub", "dam", "den", "dim", "dip", "dot", "dub", "dug", "dye", "elf", "elk", "elm", "fan", "fax", "fed", "fig", "fin", "fog", "fox", "gel", "gem", "gig", "gin", "gym", "ham", "hay", "hem", "hen", "hip", "hog", "hop", "hub", "hug", "hum", "hut", "imp", "inn", "ion", "ire", "ivy", "jar", "jay", "jet", "jig", "jog", "jug", "lab", "lad", "lap", "lit", "lob", "lot", "lug", "mob", "mop", "mow", "nap", "nil", "nip", "nod", "nun", "oar", "oat", "ore", "pad", "pal", "paw", "pea", "peg", "pen", "pup", "rag", "ram", "ray", "rim", "rot", "rub", "rut", "rye", "sap", "sex", "sip", "sir", "sob", "sod", "sow", "soy", "spa", "sub", "sue", "sup", "tag", "tar", "tat", "tee", "tic", "tod", "tow", "tug", "urn", "vet", "via", "vow", "wax", "wig", "wit", "woe", "yak", "yam", "yap", "yew", "yin", "zip"
];

const CAPITAL_CONTENT = [
    // BASIC: Simple Capitalized Words
    { text: "Monday", difficulty: "basic" }, { text: "Tuesday", difficulty: "basic" }, { text: "Wednesday", difficulty: "basic" },
    { text: "Thursday", difficulty: "basic" }, { text: "Friday", difficulty: "basic" }, { text: "Saturday", difficulty: "basic" },
    { text: "Sunday", difficulty: "basic" }, { text: "January", difficulty: "basic" }, { text: "February", difficulty: "basic" },
    { text: "March", difficulty: "basic" }, { text: "April", difficulty: "basic" }, { text: "May", difficulty: "basic" },
    { text: "June", difficulty: "basic" }, { text: "July", difficulty: "basic" }, { text: "August", difficulty: "basic" },
    { text: "Alice", difficulty: "basic" }, { text: "Bob", difficulty: "basic" }, { text: "Charlie", difficulty: "basic" },
    { text: "David", difficulty: "basic" }, { text: "Eve", difficulty: "basic" }, { text: "Frank", difficulty: "basic" },

    // INTERMEDIATE: CamelCase Tech Terms & Cities
    { text: "React", difficulty: "intermediate" }, { text: "NodeJS", difficulty: "intermediate" }, { text: "Express", difficulty: "intermediate" },
    { text: "MongoDB", difficulty: "intermediate" }, { text: "JavaScript", difficulty: "intermediate" }, { text: "Python", difficulty: "intermediate" },
    { text: "New York", difficulty: "intermediate" }, { text: "London", difficulty: "intermediate" }, { text: "Paris", difficulty: "intermediate" },
    { text: "Tokyo", difficulty: "intermediate" }, { text: "Sydney", difficulty: "intermediate" }, { text: "Berlin", difficulty: "intermediate" },
    { text: "Toronto", difficulty: "intermediate" }, { text: "San Francisco", difficulty: "intermediate" },
    { text: "iPhone", difficulty: "intermediate" }, { text: "eBay", difficulty: "intermediate" }, { text: "YouTube", difficulty: "intermediate" },

    // ADVANCED: Sentences with Mixed Caps and Special Casing 
    { text: "The quick brown Fox jumps over the Lazy Dog.", difficulty: "advanced" },
    { text: "Pack my Box with five dozen Liquor Jugs.", difficulty: "advanced" },
    { text: "NASA", difficulty: "advanced" }, { text: "UNICEF", difficulty: "advanced" }, { text: "UNESCO", difficulty: "advanced" },
    { text: "XMLHttpRequest", difficulty: "advanced" }, { text: "innerHTML", difficulty: "advanced" }, { text: "querySelectorAll", difficulty: "advanced" },
    { text: "PhD", difficulty: "advanced" }, { text: "McDonald's", difficulty: "advanced" }, { text: "O'Reilly", difficulty: "advanced" },
    { text: "I am confident in my Ability to Type correctly.", difficulty: "advanced" },
    { text: "CamelCase is often used in Programming languages like Java and C#.", difficulty: "advanced" }
];

const PARAGRAPHS = [
    // BASIC (Short, simple sentences, common words)
    {
        id: 101,
        text: "The sun rises in the east and sets in the west. Birds sing in the morning light. It is a new day full of hope.",
        difficulty: "basic"
    },
    {
        id: 102,
        text: "Typing is a skill that improves with practice. Keep your hands relaxed and your eyes on the screen. Speed will come naturally over time.",
        difficulty: "basic"
    },
    {
        id: 103,
        text: "Apples are red, bananas are yellow. Fruits are good for your health. Eat one every day to stay strong.",
        difficulty: "basic"
    },
    {
        id: 104,
        text: "She walked to the park to meet her friends. They played ball and ran on the grass. It was a fun afternoon.",
        difficulty: "basic"
    },
    {
        id: 105,
        text: "Cats like to sleep in the warm sun. Dogs love to run and fetch sticks. Pets bring joy to our lives.",
        difficulty: "basic"
    },

    // INTERMEDIATE (Longer sentences, punctuation, mixed case)
    {
        id: 201,
        text: "The fundamental concept of touch typing is to keep your hands in a fixed position on the keyboard. This allows your fingers to hit the keys by memory, without looking at them.",
        difficulty: "intermediate"
    },
    {
        id: 202,
        text: "Technology evolves at a rapid pace. What was cutting-edge yesterday may be obsolete tomorrow. Staying current requires continuous learning and adaptation.",
        difficulty: "intermediate"
    },
    {
        id: 203,
        text: "A balanced diet involves eating the right amount of food for how active you are. If you eat more than your body needs, you will put on weight because the energy you do not use is stored as fat.",
        difficulty: "intermediate"
    },
    {
        id: 204,
        text: "Reading is a window to the world. Through books, we can travel to distant lands, meet interesting characters, and learn about different cultures without ever leaving our homes.",
        difficulty: "intermediate"
    },
    {
        id: 205,
        text: "Effective communication is not just about speaking clearly; it is also about listening actively. Understanding what others are saying is key to building strong relationships.",
        difficulty: "intermediate"
    },

    // ADVANCED (Complex vocabulary, long texts, symbols/numbers potentially)
    {
        id: 301,
        text: "In the realm of software engineering, 'clean code' is code that is easy to understand and easy to change. Writing clean code requires discipline and a commitment to continuous improvement. It involves meaningful naming conventions, small functions that do one thing well, and the avoidance of code duplication. As Robert C. Martin famously said, 'Clean code always looks like it was written by someone who cares.'",
        difficulty: "advanced"
    },
    {
        id: 302,
        text: "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy. There are two types of photosynthetic processes: oxygenic photosynthesis and anoxygenic photosynthesis. The general equation for photosynthesis involves carbon dioxide and water reacting in the presence of light energy to produce glucose and oxygen, which is essential for life on Earth.",
        difficulty: "advanced"
    },
    {
        id: 303,
        text: "The history of the internet begins with the development of electronic computers in the 1950s. Initial concepts of wide area networking originated in several computer science laboratories in the United States, United Kingdom, and France. The US Department of Defense awarded contracts as early as the 1960s, including for the development of the ARPANET project, directed by Robert Taylor and managed by Lawrence Roberts.",
        difficulty: "advanced"
    },
    {
        id: 304,
        text: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving. The ideal characteristic of artificial intelligence is its ability to rationalize and take actions that have the best chance of achieving a specific goal.",
        difficulty: "advanced"
    },
    {
        id: 305,
        text: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Unlike classical physics, the energy, momentum, angular momentum, and other quantities of a bound system are restricted to discrete values.",
        difficulty: "advanced"
    }
];

module.exports = {
    TWO_LETTER_WORDS,
    THREE_LETTER_WORDS,
    CAPITAL_CONTENT,
    PARAGRAPHS
};
