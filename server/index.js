// server/index.js
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany();
  res.json(games);
});

app.get('/characters/:gameSlug', async (req, res) => {
  const { gameSlug } = req.params;
  const characters = await prisma.character.findMany({
    where: { game: { slug: gameSlug } },
    include: { game: true }
  });
  res.json(characters);
});

app.listen(3001, () => console.log('🚀 API rodando em http://localhost:3001'));