import React from 'react';
import ProductVideo from '../ProductVideo';

interface VideoSectionProps {
  t: (obj: { zh: string; en: string }) => string;
  props: {
    title?: { zh: string; en: string };
    description?: { zh: string; en: string };
    videoUrl?: string;
    aspectRatio?: 'video' | 'square' | 'wide';
  };
}

export default function VideoSection({ t, props }: VideoSectionProps) {
  if (!props.videoUrl) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {(props.title || props.description) && (
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              {props.title && (
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                  {t(props.title)}
                </h2>
              )}
              {props.description && (
                <p className="text-lg text-gray-500 font-light leading-relaxed">
                  {t(props.description)}
                </p>
              )}
              <div className="w-12 h-1 bg-gray-900 mx-auto rounded-full mt-6" />
            </div>
          )}
          
          <div className="shadow-2xl rounded-[40px] overflow-hidden">
             <ProductVideo url={props.videoUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
