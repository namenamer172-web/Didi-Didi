import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  ArrowLeft, 
  Check, 
  Sliders, 
  Image as ImageIcon,
  MapPin,
  Tag,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Post, User, FilterPreset } from '../../types/instagram';
import { FILTER_PRESETS } from '../../data/mockData';
import coffeeImg from '@/src/assets/images/insta_coffee_latte_1791025654758.jpg';
import archImg from '@/src/assets/images/insta_architecture_1791025672754.jpg';
import fashionImg from '@/src/assets/images/insta_streetwear_1791025690553.jpg';
import natureImg from '@/src/assets/images/insta_nature_peaks_1791025702742.jpg';
import foodImg from '@/src/assets/images/insta_culinary_pasta_1791025715633.jpg';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onCreatePost: (newPost: Post) => void;
}

type Step = 'upload' | 'filter' | 'caption';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  onClose,
  onCreatePost,
}) => {
  const [step, setStep] = useState<Step>('upload');
  const [selectedImage, setSelectedImage] = useState<string>(coffeeImg);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '16:9'>('1:1');
  const [activeFilter, setActiveFilter] = useState<FilterPreset>(FILTER_PRESETS[0]);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturate, setSaturate] = useState<number>(100);
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [tagPeople, setTagPeople] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    { label: 'Morning Coffee', url: coffeeImg },
    { label: 'Modern Concrete', url: archImg },
    { label: 'Street Tailoring', url: fashionImg },
    { label: 'Alpine Peaks', url: natureImg },
    { label: 'Artisan Pasta', url: foodImg },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setStep('filter');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getComputedFilterString = () => {
    const baseFilter = activeFilter.filterValue !== 'none' ? `${activeFilter.filterValue} ` : '';
    const adjustments = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
    return `${baseFilter}${adjustments}`.trim();
  };

  const handleShare = () => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: currentUser,
      media: [
        {
          url: selectedImage,
          type: 'image',
          filter: getComputedFilterString(),
          aspectRatio,
          brightness,
          contrast,
          saturate,
        },
      ],
      caption: caption || 'Moments captured in frame ✨',
      location: location || undefined,
      tags: tagPeople ? tagPeople.split(',').map(t => t.trim()) : undefined,
      likesCount: 1,
      isLiked: true,
      isSaved: false,
      comments: [],
      createdAt: 'Just now',
    };

    onCreatePost(newPost);

    // Celebratory confetti pop!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 md:p-6">
      {/* Outer Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-black/40 hover:bg-black/60 z-50 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="bg-white dark:bg-black w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-neutral-200 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-white dark:bg-black">
          {step !== 'upload' ? (
            <button
              onClick={() => {
                if (step === 'caption') setStep('filter');
                else if (step === 'filter') setStep('upload');
              }}
              className="p-1 text-neutral-800 dark:text-neutral-200 hover:opacity-70"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {step === 'upload' && 'Create new post'}
            {step === 'filter' && 'Edit & Apply Filters'}
            {step === 'caption' && 'Post details'}
          </h3>

          <div>
            {step === 'filter' && (
              <button
                onClick={() => setStep('caption')}
                className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400 px-2 py-1"
              >
                Next
              </button>
            )}
            {step === 'caption' && (
              <button
                onClick={handleShare}
                className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400 px-2 py-1 flex items-center gap-1"
              >
                <Check className="w-4 h-4" /> Share
              </button>
            )}
            {step === 'upload' && <div className="w-5" />}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* STEP 1: Upload or Choose Sample */}
          {step === 'upload' && (
            <div className="w-full p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <ImageIcon className="w-10 h-10 stroke-[1.5]" />
              </div>

              <div>
                <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  Drag photos and videos here
                </h4>
                <p className="text-xs text-neutral-500">
                  Select a photo from your computer or choose from high-res templates
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  Select from computer
                </button>
              </div>

              <div className="w-full max-w-md pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-xs font-semibold text-neutral-500 block mb-3">
                  Or pick a photo preset:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(s.url);
                        setStep('filter');
                      }}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 hover:ring-2 hover:ring-sky-500 transition-all"
                    >
                      <img
                        src={s.url}
                        alt={s.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white py-0.5 truncate px-1">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Filter & Adjustments */}
          {step === 'filter' && (
            <>
              {/* Media Preview on Left */}
              <div className="relative md:w-3/5 bg-black flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[480px]">
                <div 
                  className={`w-full max-w-[480px] overflow-hidden transition-all ${
                    aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '4:5' ? 'aspect-4/5' : 'aspect-video'
                  }`}
                >
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{ filter: getComputedFilterString() }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Aspect Ratio Selector pills */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-lg">
                  {(['1:1', '4:5', '16:9'] as const).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                        aspectRatio === ratio ? 'bg-white text-black font-semibold' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Controls on Right */}
              <div className="md:w-2/5 p-4 overflow-y-auto flex flex-col justify-between space-y-6 bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Filters
                  </h4>

                  {/* Filter thumbnail grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {FILTER_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => setActiveFilter(preset)}
                        className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                          activeFilter.name === preset.name 
                            ? 'ring-2 ring-sky-500 bg-sky-500/10' 
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-200">
                          <img
                            src={selectedImage}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                            style={{ filter: preset.filterValue }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 truncate">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Adjustments Sliders */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Adjustments
                  </h4>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      <span>Brightness</span>
                      <span>{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={140}
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      <span>Contrast</span>
                      <span>{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={150}
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                      <span>Saturation</span>
                      <span>{saturate}%</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={180}
                      value={saturate}
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Caption, Location, & Publish */}
          {step === 'caption' && (
            <>
              {/* Media preview */}
              <div className="relative md:w-3/5 bg-black flex items-center justify-center p-4">
                <img
                  src={selectedImage}
                  alt="Post preview"
                  className="max-h-[380px] w-auto object-contain rounded-lg"
                  style={{ filter: getComputedFilterString() }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Form details */}
              <div className="md:w-2/5 p-4 flex flex-col justify-between space-y-4 bg-white dark:bg-black border-l border-neutral-200 dark:border-neutral-800">
                <div className="space-y-4">
                  {/* User snippet */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {currentUser.username}
                    </span>
                  </div>

                  {/* Caption input */}
                  <div>
                    <textarea
                      rows={5}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption... (use #hashtags to categorize)"
                      className="w-full text-xs p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                    />
                    <div className="text-right text-[10px] text-neutral-400 mt-1">
                      {caption.length}/2,200
                    </div>
                  </div>

                  {/* Location input */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location (e.g. San Francisco, CA)"
                      className="w-full text-xs bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                    />
                  </div>

                  {/* Tag people input */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Tag className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={tagPeople}
                      onChange={(e) => setTagPeople(e.target.value)}
                      placeholder="Tag people (e.g. @elena.design, @kai_minimal)"
                      className="w-full text-xs bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Final Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs rounded-xl shadow-md transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Share to Feed
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
