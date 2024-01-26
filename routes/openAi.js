var express = require('express');
var router = express.Router();
const OpenAI = require('openai');
const Story = require('../models/Story');
const User = require('../models/User');

const openai = new OpenAI();
const model = 'gpt-3.5-turbo-1106';

// Create player's characters
router.post('/characters', async (req, res) => {
  const players = req.body.players.join(',');
  const response = await charactersCreation(players);
  const characters = JSON.parse(response.message.content).joueurs;

  console.log('[BACKEND][OPENAI] created characters', characters);
  res.json(characters);
});

// Return example :
// [
//   {
//     index: 0,
//     name: 'Jean',
//     character: 'Gorim le Barbare',
//     description:
//       "Gorim est un guerrier redoutable, doté d'une force surhumaine et d'une endurance à toute épreuve. Il manie sa hache de guerre avec une maîtrise impressionnante et sait inspirer la peur à ses ennemis.",
//   },
//   {
//     index: 1,
//     name: 'Viviane',
//     character: "Elara l'Enchanteresse",
//     description:
//       "Elara est une puissante magicienne spécialisée dans les arcanes de l'illusion et de la manipulation mentale. Elle est aussi habile à manier ses sortilèges qu'à intriguer et manipuler ses adversaires.",
//   },
//   {
//     index: 2,
//     name: 'Marie',
//     character: "Thaliana l'Archer",
//     description:
//       'Thaliana est une archère hors pair, capable de décocher des flèches avec une précision mortelle. Elle est agile, rapide et sait se faufiler dans les ombres pour surprendre ses ennemis.',
//   },
// ];

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

  const completion = await openai.chat.completions.create({
    model,
    messages,
    response_format: { type: 'json_object' },
    max_tokens: 500,
    temperature: 0.7,
  });

  return completion.choices[0];
}

async function storyCreation(players, univers, storyLength, style) {
  const messages = [
    {
      role: 'system',
      content: `Tu es mon assistant game-master qui connaît sur le bout des doigts l'univers de donjon et dragon. Tu devras créer l'histoire du jeu de rôles en fonction des informations que je vais te fournir, cette histoire contiendra ${storyLength} phases de jeu et sera plutôt axée sur un mode "${style}". Chacune de ces phases contiendra un résuméde l'histoire en cours, posant le contexte pour les joueurs, et 3 choix que tu proposera à chaque joueur en fonction de leurs caractéristiques et de leur avancée dans le jeu.`,
    },
    {
      role: 'user',
      content: `Crée le début de l'histoire dans l'univers ${univers}. Il y a ${players.length} joueurs. La description des personnages est ${context.players}. Sois inventif !`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  });

  console.log(completion.choices[0]);
}

async function continueStory(context) {}

module.exports = router;
