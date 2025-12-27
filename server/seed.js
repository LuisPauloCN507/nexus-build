// server/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Limpa o banco antes de começar para não duplicar
  await prisma.character.deleteMany();
  await prisma.game.deleteMany();

  console.log("Copiando novos dados para a Database...");

  // 1. UMA MUSUME
  await prisma.game.create({
    data: {
      name: 'Uma Musume',
      slug: 'uma-musume',
      logoUrl: 'https://img.game8.co/3391030/1f4095454b523f03d0023e3519f96b96.png/show',
      characters: {
        create: [
          {
            name: 'Gold Ship',
            tier: 'S',
            imageUrl: 'https://img.game8.co/3394857/d40599553655113709b1f76f768c8585.png/show',
            buildDetails: 'Focar em Stamina e Power. Melhor estratégia: Betweeners/Chaser em distâncias longas.',
            sourceName: 'Game8',
            sourceUrl: 'https://game8.co/games/Umamusume/archives/322301'
          },
          {
            name: 'Rice Shower',
            tier: 'A',
            imageUrl: 'https://img.game8.co/3394864/98a974b8686d67e562140f7d0c0082b2.png/show',
            buildDetails: 'Exige muito treino de Stamina. Ótima para Kyoto Ground e corridas de longa distância.',
            sourceName: 'Game8',
            sourceUrl: 'https://game8.co/games/Umamusume/archives/322306'
          }
        ]
      }
    }
  });

  // 2. GENSHIN IMPACT
  await prisma.game.create({
    data: {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      logoUrl: 'https://img.game8.co/3313271/5bc121508201594191d4e0e41766a276.png/show',
      characters: {
        create: [
          {
            name: 'Raiden Shogun',
            tier: 'SS',
            imageUrl: 'https://img.game8.co/3421731/8786411784f18b628352b95b76d0f62d.png/show',
            buildDetails: 'Main DPS / Sub-DPS. Focar em Emblem of Severed Fate e recarga de energia.',
            sourceName: 'Game8',
            sourceUrl: 'https://game8.co/games/Genshin-Impact/archives/336332'
          }
        ]
      }
    }
  });

  // 3. BLUE ARCHIVE
  await prisma.game.create({
    data: {
      name: 'Blue Archive',
      slug: 'blue-archive',
      logoUrl: 'https://img.game8.co/3455799/31b8a531f8681283286134b281f2518e.png/show',
      characters: {
        create: [
          {
            name: 'Shiroko',
            tier: 'S',
            imageUrl: 'https://img.game8.co/3457597/95932594e9f90656a81b2414777a8289.png/show',
            buildDetails: 'Atacante explosiva de custo baixo. Excelente para rotação rápida de skills.',
            sourceName: 'Game8',
            sourceUrl: 'https://game8.co/games/Blue-Archive/archives/318182'
          }
        ]
      }
    }
  });

  console.log("✅ Database Populada com 3 Jogos e várias Waifus!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());