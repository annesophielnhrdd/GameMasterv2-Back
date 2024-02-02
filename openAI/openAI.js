const OpenAI = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
// const openai = new OpenAI();

const model = 'gpt-3.5-turbo-1106';

async function charactersCreation(players) {
  const messages = [
    {
      role: 'system',
      content: `Tu es mon assistant game-master qui connaît sur le bout des doigts l'univers de donjon et dragon.`,
    },
    {
      role: 'user',
      content: `Pour chaque joueur de cette liste : ${players}, crée un fichier json avec un index partant de 0, un name: nom fourni dans la liste, un character: invente nom du personnage dans le jeu et une description: invente un résumée de ses caractéristiques.`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0];
    const characters = JSON.parse(response.message.content).joueurs;

    console.log('[BACKEND][OPENAI] created characters:', characters);
    return characters;
  } catch (error) {
    console.error('[BACKEND][OPENAI] create characters error:', error);
  }
}

/* 
Return example :
[
    {
        "index": 0,
        "name": "Jean",
        "character": "Eldrin le sorcier",
        "description": "Eldrin est un sorcier puissant, maître des éléments et manipulateur de la magie noire. Il est aussi connu pour son intelligence et sa ruse, ce qui en fait un redoutable adversaire dans les donjons."
    },
    {
        "index": 1,
        "name": "Viviane",
        "character": "Sylanna l'elfe archère",
        "description": "Sylanna est une archère agile et précise, capable de tirer des flèches mortelles à une distance impressionnante. Elle possède également une grande connaissance des plantes et des herbes, utile pour soigner ses compagnons."
    },
    {
        "index": 2,
        "name": "Marie",
        "character": "Gorim le guerrier nain",
        "description": "Gorim est un guerrier nain redoutable, armé d'une hache gigantesque et protégé par une armure indestructible. Sa force et sa résistance en font un combattant redoutable, prêt à affronter les dangers les plus mortels des donjons."
    }
]
*/

async function storyBeginningCreation(
  charactersDescription,
  univers,
  storyLength,
  round,
  style
) {
  const messages = [
    {
      role: 'system',
      content: `Tu es mon assistant game-master qui connaît sur le bout des doigts l'univers de donjon et dragon. Tu devras créer l'histoire du jeu de rôles en fonction des informations que je vais te fournir, cette histoire contiendra ${storyLength} phases de jeu et se déroulera plutôt en ${style}. Nous en sommes à la phase ${
        round + 1
      } du jeu. Chacune de ces phases contiendra un résumé de l'histoire en cours, posant le contexte pour les joueurs, et 3 choix que tu proposera à chaque joueur en fonction de leurs caractéristiques et de leur avancée dans le jeu. La description des personnages est : ${charactersDescription}.`,
    },
    {
      role: 'user',
      content: `Crée le début de l'histoire dans l'univers de la ${univers}. Tu renverras un json avec un title : le titre de l'histoire, un storyBeginning : le début de l'histoire assez détaillé, et des choices : 3 choix par joueur qui seront structurés comme ceci : "choices": {
        "Eldrin": {
            "choice1": "Lancer un sort d'illusion pour créer une diversion et désorienter l'ennemi.",
            "choice2": "Utiliser la magie noire pour invoquer des flammes dévastatrices et repousser l'ennemi.",
            "choice3": "Utiliser la magie des éléments pour créer un mur de glace et bloquer l'ennemi."
        }}. Sois inventif !`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: 'json_object' },
      max_tokens: 2000,
      temperature: 0.4,
    });

    const response = completion.choices[0];
    const storyBeginning = JSON.parse(response.message.content);

    console.log('[BACKEND][OPENAI] created story beginning:', storyBeginning);
    return storyBeginning;
  } catch (error) {
    console.error('[BACKEND][OPENAI] create story beginning error:', error);
  }
}

/* 
Return example :
{
    "title": "Les Montagnes Maudites",
    "storyBeginning": "Les Montagnes Maudites s'élèvent majestueusement devant vous, leurs sommets enneigés cachant d'anciens donjons et des créatures redoutables. Vous avez été recrutés pour explorer ces terres dangereuses et récupérer un artefact magique convoité par de nombreux aventuriers. Alors que vous vous approchez des montagnes, un blizzard féroce se lève, obscurcissant le ciel et rendant la visibilité presque nulle. Vous entendez des grondements sinistres provenant des profondeurs des montagnes, signe que de redoutables créatures rôdent dans les sombres cavernes. Vous savez que l'artefact se trouve quelque part au cœur de ces montagnes, mais pour y parvenir, vous devrez affronter des dangers inimaginables.",
    "choices": {
        "Eldrin": {
            "choice1": "Utiliser vos pouvoirs magiques pour créer un bouclier de protection contre le blizzard et les éléments déchaînés.",
            "choice2": "Lancer un sort de détection pour repérer d'éventuels pièges magiques ou des créatures cachées dans les environs.",
            "choice3": "Invoquer les éléments pour tenter de calmer le blizzard et ouvrir un chemin sûr à travers les montagnes."
        },
        "Sylanna": {
            "choice1": "Utiliser vos compétences en survie pour trouver un abri temporaire et protéger le groupe du blizzard.",
            "choice2": "Utiliser vos connaissances des plantes pour trouver des herbes médicinales capables de soigner les effets du froid extrême sur le groupe.",
            "choice3": "Utiliser votre arc pour repérer d'éventuelles menaces cachées dans le blizzard et prévenir le groupe de tout danger imminent."
        },
        "Gorim": {
            "choice1": "Utiliser votre force pour ouvrir un passage à travers la neige et le vent, créant un chemin sûr pour le groupe.",
            "choice2": "Inspecter les environs à la recherche de traces de créatures dangereuses et préparer le groupe à toute éventualité.",
            "choice3": "Utiliser votre hache pour couper du bois et construire un abri solide pour protéger le groupe du blizzard."
        }
    }
}
*/

async function summaryLastPhase(
  context,
  charactersDescription,
  lastChoises,
  storyLength,
  round,
  style
) {
  const messages = [
    {
      role: 'system',
      content: `Tu es mon assistant game-master qui connaît sur le bout des doigts l'univers de donjon et dragon. Tu devras créer l'histoire du jeu de rôles en fonction des informations que je vais te fournir, cette histoire contiendra ${storyLength} phases de jeu et se déroulera plutôt en ${style}. Nous en sommes à la phase ${
        round + 1
      } du jeu. Chacune de ces phases contiendra un résumé de l'histoire en cours, posant le contexte pour les joueurs, et 3 choix que tu proposera à chaque joueur en fonction de leurs caractéristiques et de leur avancée dans le jeu. La description des personnages est : ${charactersDescription}. Le contexte de l'histoire est : ${context}. Les choix des joueurs pour la phase précédente sont : ${lastChoises}`,
    },
    {
      role: 'user',
      content: `Crée un résumé de l'histoire après que chaque joueur ait fait son choix. Tu renverras un json avec une summaryStory : le résumé de l'histoire assez détaillé suite aux choix des joueurs. Sois inventif !`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: 'json_object' },
      // max_tokens: 2000,
      temperature: 0.4,
    });

    const response = completion.choices[0];
    const storyBeginning = JSON.parse(response.message.content);

    console.log('[BACKEND][OPENAI] created story beginning:', storyBeginning);
    return storyBeginning;
  } catch (error) {
    console.error('[BACKEND][OPENAI] create story beginning error:', error);
  }
}

/* 
Return example :
{
    "summaryStory": "Après avoir utilisé ses pouvoirs magiques pour créer un bouclier de protection contre le blizzard et les éléments déchaînés, Eldrin parvient à protéger le groupe des rafales glaciales qui menaçaient de les emporter. Grâce à ses connaissances des plantes, Sylanna parvient à trouver des herbes médicinales capables de soigner les effets du froid extrême sur le groupe, apaisant ainsi les engelures et les symptômes de gelure. Pendant ce temps, Gorim utilise sa hache pour couper du bois et construire un abri solide pour protéger le groupe du blizzard, assurant ainsi leur survie pendant la tempête. Après avoir surmonté cette épreuve, le groupe se sent prêt à affronter les dangers des Montagnes Maudites et à poursuivre sa quête pour retrouver l'artefact magique convoité."
}
*/

async function continueStory(
  context,
  charactersDescription,
  storyLength,
  round,
  style
) {
  const messages = [
    {
      role: 'system',
      content: `Tu es mon assistant game-master qui connaît sur le bout des doigts l'univers de donjon et dragon. Tu devras créer l'histoire du jeu de rôles en fonction des informations que je vais te fournir, cette histoire contiendra ${storyLength} phases de jeu et se déroulera plutôt en ${style}. Nous en sommes à la phase ${
        round + 1
      } du jeu. Chacune de ces phases contiendra un résumé de l'histoire en cours, posant le contexte pour les joueurs, et 3 choix que tu proposera à chaque joueur en fonction de leurs caractéristiques et de leur avancée dans le jeu. La description des personnages est : ${charactersDescription}. Le contexte de l'histoire est : ${context}.`,
    },
    {
      role: 'user',
      content: `Crée la suite de l'histoire en te basant sur le contexte de l'histoire en cours, les caractéristiques des personnages et les précèdants choix des joueurs. Tu renverras un json avec une continuationStory : la suite de l'histoire très détaillée, et des choices : 3 choix par joueur qui seront structurés comme ceci : "choices": {
        "Eldrin": {
            "choice1": "Lancer un sort d'illusion pour créer une diversion et désorienter l'ennemi.",
            "choice2": "Utiliser la magie noire pour invoquer des flammes dévastatrices et repousser l'ennemi.",
            "choice3": "Utiliser la magie des éléments pour créer un mur de glace et bloquer l'ennemi."
        }}. Sois inventif !`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: 'json_object' },
      // max_tokens: 2000,
      temperature: 0.4,
    });

    const response = completion.choices[0];
    const storyBeginning = JSON.parse(response.message.content);

    console.log('[BACKEND][OPENAI] created story beginning:', storyBeginning);
    return storyBeginning;
  } catch (error) {
    console.error('[BACKEND][OPENAI] create story beginning error:', error);
  }
}

/* 
Return example :
{
    "continuationStory": "Alors que le groupe s'aventure plus profondément dans les Montagnes Maudites, les parois des cavernes deviennent de plus en plus étroites et sinueuses. Soudain, des grondements sourds résonnent dans les tunnels, annonçant l'arrivée imminente de créatures redoutables. Des yeux luisants émergent des ténèbres, révélant la présence de redoutables loups des neiges, prêts à fondre sur le groupe avec férocité. Les crocs acérés des bêtes brillent d'une lueur menaçante, et leur souffle chaud se mêle à l'air glacial de la montagne. Le groupe se prépare à affronter cette nouvelle menace, sachant que leur agilité et leur force seront mises à rude épreuve dans ce combat impitoyable.",
    "choices": {
        "Eldrin": {
            "choice1": "Lancer un sort d'illusion pour créer une diversion et désorienter les loups des neiges.",
            "choice2": "Utiliser la magie noire pour invoquer des flammes dévastatrices et repousser les loups des neiges.",
            "choice3": "Utiliser la magie des éléments pour créer un mur de glace et bloquer les loups des neiges."
        },
        "Sylanna": {
            "choice1": "Viser avec précision les yeux des loups des neiges pour les aveugler temporairement.",
            "choice2": "Utiliser des flèches empoisonnées pour affaiblir les loups des neiges.",
            "choice3": "Créer des pièges naturels avec des plantes pour ralentir et piéger les loups des neiges."
        },
        "Gorim": {
            "choice1": "Se positionner en première ligne et utiliser sa hache pour repousser les loups des neiges.",
            "choice2": "Utiliser sa force pour créer un bouclier protecteur et protéger le groupe des attaques des loups des neiges.",
            "choice3": "Faire résonner un puissant cri de guerre pour intimider les loups des neiges et les ralentir dans leur attaque."
        }
    }
}
*/

module.exports = {
  charactersCreation,
  storyBeginningCreation,
  summaryLastPhase,
  continueStory,
};
