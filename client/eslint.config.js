import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('🚀 Nexus API Online'));

// LISTAR JOGOS
app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany();
  res.json(games);
});

// LISTAR PERSONAGENS
app.get('/characters/:slug', async (req, res) => {
  const { slug } = req.params;
  const characters = await prisma.character.findMany({
    where: { game: { slug: slug } }
  });
  res.json(characters);
});

// CRIAR JOGO
app.post('/games', async (req, res) => {
  const { name, slug, logoUrl } = req.body;
  try {
    const newGame = await prisma.game.create({ data: { name, slug, logoUrl } });
    res.json(newGame);
  } catch (error) { res.status(400).json({ error }); }
});

// CRIAR PERSONAGEM
app.post('/characters', async (req, res) => {
  try {
    const newChar = await prisma.character.create({ data: req.body });
    res.json(newChar);
  } catch (error) { res.status(400).json({ error }); }
});

// --- NOVO: APAGAR PERSONAGEM ---
app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.character.delete({ where: { id: id } });
    res.json({ message: "Apagado!" });
  } catch (error) { res.status(400).json({ error }); }
});

// --- NOVO: APAGAR JOGO (E OS SEUS PERSONAGENS) ---
app.delete('/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Primeiro apagamos os personagens do jogo (regra do Prisma/SQLite)
    await prisma.character.deleteMany({ where: { gameId: id } });
    await prisma.game.delete({ where: { id: id } });
    res.json({ message: "Jogo removido!" });
  } catch (error) { res.status(400).json({ error }); }
});

app.listen(3001, () => console.log("🔥 Server em http://localhost:3001"));