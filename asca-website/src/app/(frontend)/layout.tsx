import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import prisma from "@/lib/prisma";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsDb = await prisma.siteSetting.findMany({
    where: { group: 'GLOBAL' }
  });
  
  const logoUrl = settingsDb.find(s => s.key === 'GLOBAL_LOGO')?.value || "";
  
  const navMenuRaw = settingsDb.find(s => s.key === 'GLOBAL_NAV_MENU')?.value || "Beranda|/\nTentang|/#tentang\nLembaga|/#lembaga\nBerita|/berita\nKontak|/#kontak";
  const menuItems = navMenuRaw.split('\n').filter(Boolean).map(line => {
    const [label, href] = line.split('|');
    return { label: label?.trim() || '', href: href?.trim() || '/' };
  });

  const getGlobalSetting = (key: string, defaultValue: string) => {
    const record = settingsDb.find(s => s.key === key);
    return record ? record.value : defaultValue;
  };

  const socialLinks = {
    ig: getGlobalSetting('GLOBAL_IG', 'https://instagram.com/asca'),
    fb: getGlobalSetting('GLOBAL_FB', 'https://facebook.com/asca'),
    youtube: getGlobalSetting('GLOBAL_YOUTUBE', 'https://youtube.com/@asca'),
    tiktok: getGlobalSetting('GLOBAL_TIKTOK', 'https://tiktok.com/@asca'),
    wa: getGlobalSetting('GLOBAL_WA_LINK', 'https://wa.me/6281234567890'),
  };

  return (
    <>
      <Navbar logoUrl={logoUrl} menuItems={menuItems} socialLinks={socialLinks} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
