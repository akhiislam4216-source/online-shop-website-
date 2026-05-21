import { useState } from 'react';
import { Calendar, User, ArrowLeft, Clock, Grid } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogProps {
  blogs: BlogPost[];
}

export default function Blog({ blogs }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-left space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => setSelectedPost(null)}
          className="text-xs text-indigo-605 font-black uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer select-none"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-indigo-650" />
          ← Back to Creative Logs
        </button>

        {/* Hero image overlay */}
        <div className="aspect-[21/9] bg-slate-100 rounded-[32px] overflow-hidden shadow-xl">
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header fields */}
        <div className="space-y-4">
          <span className="text-[10px] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest w-fit">
            Store Editorial
          </span>
          
          <h1 className="font-display font-black text-2xl sm:text-3.5xl text-slate-905 dark:text-white uppercase leading-tight tracking-tight">
            {selectedPost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 border-y border-slate-100 dark:border-slate-800 py-3 select-none">
            <span className="flex items-center gap-1.5 capitalize">
              <User className="h-4 w-4" />
              {selectedPost.author}
            </span>
            <span>|</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {selectedPost.date}
            </span>
            <span>|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {selectedPost.readTime} read time
            </span>
          </div>
        </div>

        {/* Interactive paragraphs details */}
        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 space-y-6 leading-relaxed font-sans max-w-2xl">
          <p className="font-semibold text-slate-900 dark:text-white first-letter:text-5xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
            We hold daily interactions with material compositions. Selecting accessories for spaces, materials for garments, or elements for skin care holds the visual and physical signatures of daily habits. Here, our creative curation directors speak directly about standard values, ergonomics, and material selections.
          </p>
          <p>
            {selectedPost.excerpt}
          </p>
          <p>
            The transition from cold department retail chains to friendly curations is more than mere marketing jargon. By hosting tactile textures — like high molecular weight heavy loops, native walnut hardwood accents, and organic botanic clean cosmetic oils — we align our mental focus with beautiful visual designs. Our studio maintains rigid standards: sustainable carbon-neutral logistical steps, verified animal cruelty-free practices, and fair compensation lines for all family workshops.
          </p>
          <p className="border-l-4 border-indigo-500 pl-6 my-8 italic font-semibold text-slate-700 dark:text-slate-400 text-xs text-medium">
            "Design is not merely how a particular object appears. True design is how the physical and mental handshake operates when the user interacts with the everyday functional tool."
          </p>
          <p>
            We hope to construct long-lasting bonds with modern creators, designers, and curators. Keep an eye out for our upcoming seasonal collaborations and exclusive workspace drops by subscribing to our Friendly Newsletter list today!
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 text-left space-y-12">
      
      {/* Slogans Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
          Creative logs
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-905 dark:text-white uppercase tracking-tight">
          The Friendly Editorial
        </h1>
        <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-sans">
          Discover material breakdowns, ergonomic spacing insights, daily skincare routines, and creative workspace inspiration columns.
        </p>
      </section>

      {/* Grid displays line items listing blogs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <article 
            key={blog.id}
            onClick={() => setSelectedPost(blog)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-left hover:translate-y-[-4px]"
          >
            {/* Visual thumb */}
            <div className="aspect-[16/10] bg-slate-50 overflow-hidden relative">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider text-slate-800 uppercase shadow-md">
                {blog.readTime} Column
              </span>
            </div>

            {/* Info details */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-5">
              
              <div className="space-y-2.5">
                {/* Meta details */}
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {blog.author}
                  </span>
                  <span>|</span>
                  <span>{blog.date}</span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-6500 transition-colors">
                  {blog.title}
                </h3>

                <p className="text-xs text-slate-505 dark:text-slate-450 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <span className="text-[10px] font-bold text-indigo-650 tracking-wider uppercase border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-1 group-hover:underline">
                Read Full Column Article
                <Clock className="h-4 w-4" />
              </span>

            </div>

          </article>
        ))}
      </div>

    </div>
  );
}
