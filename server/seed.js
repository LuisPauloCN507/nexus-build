// server/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.character.deleteMany();
  await prisma.game.deleteMany();

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
            buildDetails: 'Focar em Stamina e Power para distâncias longas (Long Distance Chaser).',
            sourceName: 'Game8',
            sourceUrl: 'https://game8.co/games/Umamusume/archives/322301'
          }
        ]
      }
    }
  });
  console.log("✅ Banco de dados populado com sucesso!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());