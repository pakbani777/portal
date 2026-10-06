const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Update SiteSettings Keys
    const settings = await prisma.siteSetting.findMany({
        where: {
            key: {
                contains: 'SDQA'
            }
        }
    });

    for (const setting of settings) {
        const newKey = setting.key.replace('SDQA', 'SDQu');
        await prisma.siteSetting.update({
            where: { id: setting.id },
            data: { key: newKey }
        });
        console.log(`Updated setting key ${setting.key} to ${newKey}`);
    }

    // 2. Update SiteSettings Groups
    const groupSettings = await prisma.siteSetting.findMany({
        where: {
            group: 'SDQA'
        }
    });

    for (const setting of groupSettings) {
        await prisma.siteSetting.update({
            where: { id: setting.id },
            data: { group: 'SDQu' }
        });
        console.log(`Updated setting group for ${setting.key}`);
    }

    // 3. Update other models with institution='SDQA'
    const models = ['post', 'teacher', 'testimonial', 'registration'];
    for (const model of models) {
        try {
            const count = await prisma[model].updateMany({
                where: { institution: 'SDQA' },
                data: { institution: 'SDQu' }
            });
            console.log(`Updated ${count.count} records in ${model}`);
        } catch (e) {
            console.log(`Skipped ${model} or error:`, e.message);
        }
    }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
