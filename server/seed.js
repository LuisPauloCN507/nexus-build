import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Limpa o banco para evitar duplicados
  await prisma.character.deleteMany();
  await prisma.game.deleteMany();

  // Cria o jogo base
  const uma = await prisma.game.create({
    data: {
      name: 'Uma Musume Global',
      slug: 'uma-musume',
      logoUrl: 'https://img.game8.co/3391030/1f4095454b523f03d0023e3519f96b96.png/show',
    }
  });

  // Insere as personagens com os novos campos
  await prisma.character.createMany({
    data: [
      {
        name: 'Special Week',
        tier: 'A',
        strategy: 'Leader',
        speed: 'High', stamina: 'High', power: 'Mid', guts: 'Low', wisdom: 'Mid',
        recommendedSkills: 'Shooting Star, Nutritionist, Corner Recovery',
        supportCards: 'Super Creek (SSR), Fine Motion (SSR), Hayakawa Tazuna (SSR)',
        imageUrl: 'https://img.game8.co/3394854/6620786930062a74c264250269f8c67c.png/show',
        buildDetails: 'Equilibrada. Focar em Speed e Stamina para distâncias médias.',
        sourceName: 'Game8', sourceUrl: 'https://game8.co/games/Umamusume/archives/322294',
        gameId: uma.id
      },
      {
        name: 'Silence Suzuka',
        tier: 'S',
        strategy: 'Runner',
        speed: 'Max', stamina: 'Mid', power: 'Mid', guts: 'Low', wisdom: 'Low',
        recommendedSkills: 'Leading Fortune, Escape Artist, Concentration',
        supportCards: 'Twin Turbo (SSR), Maruzensky (SSR), Tokai Teio (SSR)',
        imageUrl: 'https://img.game8.co/3394855/354d7285514f7773292305a2ef185590.png/show',
        buildDetails: 'A rainha da fuga. Speed total (Max) é prioridade absoluta.',
        sourceName: 'Game8', sourceUrl: 'https://game8.co/games/Umamusume/archives/322297',
        gameId: uma.id
      },
      {
        name: 'Tokai Teio',
        tier: 'S',
        strategy: 'Leader',
        speed: 'High', stamina: 'Low', power: 'High', guts: 'Low', wisdom: 'Mid',
        recommendedSkills: 'Ultimate Teio Step, Position Sense, Lightning Step',
        supportCards: 'Fine Motion (SSR), Tokai Teio (SSR), Kitasan Black (SSR)',
        imageUrl: 'https://img.game8.co/3394856/80829870104332822a16f9f36f987f73.png/show',
        buildDetails: 'Excelente aceleração. Focar em Speed e Power.',
        sourceName: 'Game8', sourceUrl: 'https://game8.co/games/Umamusume/archives/322300',
        gameId: uma.id
      }
    ]
  });

  console.log("✅ UMA-DATABASE repopulada com sucesso!");
}

main().finally(() => prisma.$disconnect());