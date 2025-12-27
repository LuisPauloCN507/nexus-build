import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota inicial para não dar "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🚀 Nexus API Online - Port 3001');
});

// LISTAR JOGOS
app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany();
  res.json(games);
});

// LISTAR PERSONAGENS DE UM JOGO ESPECÍFICO
app.get('/characters/:slug', async (req, res) => {
  const { slug } = req.params;
  const characters = await prisma.character.findMany({
    where: { game: { slug: slug } }
  });
  res.json(characters);
});

// --- ROTAS DO DIA 4 (CADASTRO) ---

// CRIAR NOVO JOGO
app.post('/games', async (req, res) => {
  const { name, slug, logoUrl } = req.body;
  try {
    const newGame = await prisma.game.create({
      data: { name, slug, logoUrl }
    });
    res.json(newGame);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar jogo" });
  }
});

// CRIAR NOVO PERSONAGEM
app.post('/characters', async (req, res) => {
  const { name, tier, imageUrl, buildDetails, sourceName, sourceUrl, gameId } = req.body;
  try {
    const newChar = await prisma.character.create({
      data: { name, tier, imageUrl, buildDetails, sourceName, sourceUrl, gameId }
    });
    res.json(newChar);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar personagem" });
  }
});

app.listen(3001, () => console.log("🔥 Server rodando em http://localhost:3001"));