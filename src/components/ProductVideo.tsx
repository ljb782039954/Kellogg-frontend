import React from 'react';
import { Play } from 'lucide-react';

interface ProductVideoProps {
  url: string;
}

export default function ProductVideo({ url }: ProductVideoProps) {
  // 解析视频平台
  const getEmbedUrl = (url: string) => {
    try {
      const videoUrl = new URL(url);
      
      // YouTube
      if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
        let videoId = '';
        if (videoUrl.hostname.includes('youtu.be')) {
          videoId = videoUrl.pathname.slice(1);
        } else {
          videoId = videoUrl.searchParams.get('v') || '';
        }
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // TikTok (TikTok embeds are more complex, usually require script, but we can try simple iframe if they provide dev portal urls)
      // Here we just handle YouTube as primary, others can be added similarly
      
      return url; // Fallback to raw url (might not work in iframe if not embed url)
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(url);
  const isYoutube = embedUrl.includes('youtube.com/embed/');

  if (isYoutube) {
    return (
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Product Video"
        />
      </div>
    );
  }

  // Generic video tag (if it's a direct mp4 link)
  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return (
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
        <video 
          src={url} 
          controls 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Fallback: Just a link with a play button placeholder
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative aspect-video rounded-3xl overflow-hidden bg-gray-900 flex flex-col items-center justify-center gap-4 transition-all hover:bg-black shadow-2xl"
    >
      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all border border-white/20">
        <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
      </div>
      <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{url.includes('tiktok') ? 'Watch on TikTok' : 'Watch Video'}</span>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </a>
  );
}
