import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Calendar, ArrowLeft, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) {
    return { title: 'Berita Tidak Ditemukan' };
  }

  return {
    title: `${post.title} | Berita ASCA`,
    description: post.content.substring(0, 160),
    openGraph: {
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export default async function ReadPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] pt-32 pb-24 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-orange-500 dark:hover:text-orange-400 font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </Link>

        <article className="bg-white dark:bg-slate-900 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 dark:shadow-none overflow-hidden">
          {post.imageUrl && (
            <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 font-bold text-sm">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <Calendar className="h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm">
                <UserCircle className="h-4 w-4" />
                Admin {post.institution}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 dark:text-white leading-tight mb-8">
              {post.title}
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-blue-950 dark:prose-headings:text-white prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-img:rounded-2xl">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
