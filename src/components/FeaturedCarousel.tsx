import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import cover02 from "./images/front/2.webp";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface MangaItem {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  genres: string[];
  rating: number;
}

interface FeaturedCarouselProps {
  items?: MangaItem[];
}

const FeaturedCarousel = ({ items = defaultItems }: FeaturedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[450px] bg-card overflow-hidden rounded-lg border">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${items[currentIndex].coverImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white z-10">
            <div className="flex gap-2 mb-4">
              {items[currentIndex].genres.slice(0, 3).map((genre, idx) => (
                <Badge key={idx} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">
              {items[currentIndex].title}
            </h2>
            <p className="text-base md:text-lg max-w-2xl mb-8 line-clamp-3 text-gray-300">
              {items[currentIndex].description}
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() =>
                  (window.location.href = `/manga/${items[currentIndex].id}`)
                }
              >
                Read Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white/50 hover:bg-white/10"
                onClick={() => {
                  // Import the library functions
                  import("@/lib/library").then(({ saveMangaToLibrary }) => {
                    const success = saveMangaToLibrary({
                      id: items[currentIndex].id,
                      title: items[currentIndex].title,
                      author: "Featured Author",
                      coverImage: items[currentIndex].coverImage,
                      rating: items[currentIndex].rating,
                      genres: items[currentIndex].genres,
                    });
                    if (success) {
                      console.log(
                        "Added to library:",
                        items[currentIndex].title,
                      );
                    }
                  });
                }}
              >
                Add to Library
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full z-20 h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full z-20 h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-white"
                : "w-3 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Default items for the carousel
const defaultItems: MangaItem[] = [
  {
    id: "1",
    title: "My Life Turned Around: After Being Cheated on and Falsely Accused, I Ended up Being Adored by the Most Beautiful Girl in School",
    description:
      "At the end of summer, Eiji Aono witnesses his childhood friend and girlfriend, Miyuki Amada, cheating on him with Kondo, the ace of the soccer team. Betrayed by her and emotionally shattered, Eiji becomes the target of baseless slander and harassment. Cornered and with nowhere to turn, he escapes to the school rooftop—where he meets a mysterious girl...",
    coverImage: cover02,
    genres: ["Romance", "Drama", "School Life", "Drama","Psychological"],
    rating: 9.58,
  },
  {
    id: "2",
    title: "One Piece",
    description:
      'Follow Monkey D. Luffy and his pirate crew in their search for the ultimate treasure, the "One Piece", as they journey across a fantastic world of islands and seas.',
    coverImage:
      "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1200&q=80",
    genres: ["Adventure", "Fantasy", "Comedy"],
    rating: 4.9,
  },
  {
    id: "3",
    title: "Attack on Titan",
    description:
      "In a world where humanity lives within cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.",
    coverImage:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1200&q=80",
    genres: ["Action", "Drama", "Horror"],
    rating: 4.7,
  },
  {
    id: "4",
    title: "My Hero Academia",
    description:
      'In a world where people with superpowers known as "Quirks" are the norm, a boy without powers dreams of becoming a superhero himself.',
    coverImage:
      "https://images.unsplash.com/photo-1612036782180-6f0822045d55?w=1200&q=80",
    genres: ["Action", "Superhero", "School"],
    rating: 4.6,
  },
];

export default FeaturedCarousel;
