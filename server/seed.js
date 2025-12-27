import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Limpeza total para evitar duplicatas ou erros de integridade
  await prisma.character.deleteMany();
  await prisma.game.deleteMany();

  // 2. Criar o registro do jogo (Necessário para a relação no Prisma)
  const uma = await prisma.game.create({
    data: {
      name: 'Uma Musume Global',
      slug: 'uma-musume',
      logoUrl: 'https://img.game8.co/3391030/1f4095454b523f03d0023e3519f96b96.png/show',
    }
  });

  // 3. Cadastrar Special Week com dados reais do Game8 (Build de Elite)
  await prisma.character.create({
    data: {
      name: 'Special Week',
      tier: 'A',
      strategy: 'Leader',
      speed: 'High',
      stamina: 'High',
      power: 'Mid',
      guts: 'Low',
      wisdom: 'Mid',
      imageUrl: 'https://img.game8.co/3394854/6620786930062a74c264250269f8c67c.png/show',
      
      // SKILLS: Nomes e Ícones (separados por vírgula na mesma ordem)
      recommendedSkills: 'Shooting Star,Nutritionist,Corner Recovery',
      skillIcons: 'https://img.game8.co/3391637/29d2b9d42858b76b29f03028d7a315b7.png/show,https://img.game8.co/3391645/643b9e4a3b680c410972688029676991.png/show,https://img.game8.co/3391644/0f171059f0f971b9c7924719e710b651.png/show',
      
      // CARDS: Nomes e Ícones (separados por vírgula na mesma ordem)
      supportCards: 'Super Creek (SSR),Fine Motion (SSR),Hayakawa Tazuna (SSR)',
      cardIcons: 'https://img.game8.co/3391216/2e0617300f968600f68d669df073b64c.png/show,https://img.game8.co/3391223/84993883a3160e1814619711681283d6.png/show,https://img.game8.co/3391222/296d9969608468b44618e0018447814b.png/show',
      
      buildDetails: 'Focar principalmente em Speed e Stamina. Como Leader em distâncias médias, Special Week precisa de skills de recuperação (Blue Skills) para manter a performance até a reta final. Shooting Star é sua habilidade única essencial para vitória.',
      sourceName: 'Game8',
      sourceUrl: 'https://game8.co/games/Umamusume/archives/322294',
      gameId: uma.id
    }
  });

  console.log("✅ UMA-DATABASE: Special Week (Global) cadastrada com ícones reais!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });