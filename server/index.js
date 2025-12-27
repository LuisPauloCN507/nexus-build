import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota para verificar se a API está viva
app.get('/', (req, res) => res.send("UMA-API está online!"));

// Listar personagens
app.get('/characters/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const characters = await prisma.character.findMany({
      where: { game: { slug: slug } }
    });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// Listar jogos
app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany();
  res.json(games);
});

// Cadastrar personagem
app.post('/characters', async (req, res) => {
  const { 
    name, tier, imageUrl, buildDetails, strategy, 
    speed, stamina, power, guts, wisdom, 
    recommendedSkills, skillIcons, supportCards, cardIcons, 
    sourceName, sourceUrl, gameId 
  } = req.body;

  try {
    const newChar = await prisma.character.create({
      data: { 
        name, tier, imageUrl, buildDetails, strategy,
        speed, stamina, power, guts, wisdom,
        recommendedSkills, skillIcons, supportCards, cardIcons,
        sourceName, sourceUrl, gameId 
      }
    });
    res.json(newChar);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar" });
  }
});

// Apagar personagem
app.delete('/characters/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.character.delete({ where: { id } });
    res.json({ message: "Removido" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao remover" });
  }
});

// MODIFICAÇÃO PARA O RENDER: Usar porta dinâmica e 0.0.0.0
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 UMA-API Online na porta ${PORT}`);
});