import React, { useState } from "react";
import {
  Moon,
  Sun,
  Library,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import FeaturedCarousel from "./FeaturedCarousel";
import cover01 from "./images/front/1.webp";
import TrendingGrid from "./TrendingGrid";
import SearchSection from "./SearchSection";
import LibrarySection from "./LibrarySection";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("trending");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, this would update the theme in the document
    document.documentElement.classList.toggle("dark");
  };

  // Mock data for different time periods
  const getMangaByPeriod = (period: string) => {
    const baseMangas = [
      {
        id: "1",
        title: "My Life Turned Around: After Being Cheated on and Falsely Accused, I Ended up Being Adored by the Most Beautiful Girl in School",
        author: "3 Chapters",
        coverImage: cover01,
        rating: 8.58,
        genres: ["Romance", "Drama", "Tragedy", "School Life","Psychological"],
      },
      {
        id: "2",
        title: "Demon Slayer",
        author: "Koyoharu Gotouge",
        coverImage:
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
        rating: 4.7,
        genres: ["Action", "Supernatural"],
      },
      {
        id: "3",
        title: "Jujutsu Kaisen",
        author: "Gege Akutami",
        coverImage:
          "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&q=80",
        rating: 4.9,
        genres: ["Action", "Horror"],
      },
      {
        id: "4",
        title: "My Hero Academia",
        author: "Kohei Horikoshi",
        coverImage:
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80",
        rating: 4.6,
        genres: ["Superhero", "School"],
      },
      {
        id: "5",
        title: "Attack on Titan",
        author: "Hajime Isayama",
        coverImage:
          "https://images.unsplash.com/photo-1612036782180-6f0822045d55?w=400&q=80",
        rating: 4.9,
        genres: ["Dark Fantasy", "Post-Apocalyptic"],
      },
      {
        id: "6",
        title: "Chainsaw Man",
        author: "Tatsuki Fujimoto",
        coverImage:
          "https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400&q=80",
        rating: 4.8,
        genres: ["Action", "Horror"],
      },
      {
        id: "7",
        title: "Spy x Family",
        author: "Tatsuya Endo",
        coverImage:
          "https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&q=80",
        rating: 4.7,
        genres: ["Comedy", "Action"],
      },
      {
        id: "8",
        title: "Tokyo Revengers",
        author: "Ken Wakui",
        coverImage:
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
        rating: 4.5,
        genres: ["Action", "Drama"],
      },
      {
        id: "9",
        title: "Naruto",
        author: "Masashi Kishimoto",
        coverImage:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
        rating: 4.6,
        genres: ["Action", "Adventure"],
      },
      {
        id: "10",
        title: "Dragon Ball",
        author: "Akira Toriyama",
        coverImage:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80",
        rating: 4.8,
        genres: ["Action", "Adventure"],
      },
    ];

    // Simulate different popular manga for different periods
switch (period) {
  case "7d":
    return baseMangas.slice(1, 7);
  case "30d":
    return baseMangas.slice(1, 8);
  case "90d":
    return baseMangas.slice(1, 8);
  case "all":
    return baseMangas;
  default:
    return baseMangas.slice(1, 8);
}
  };

  return (
    <div
      className={`min-h-screen bg-background text-foreground dark ${isDarkMode ? "dark" : ""}`}
    >
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="text-2xl font-bold">MangaVerse</span>
            </div>

            {/* Navigation Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium"
                onClick={() => setActiveTab("trending")}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium"
                onClick={() => {
                  // Navigate to bookmarked section
                  const bookmarkedSection =
                    document.getElementById("library-section");
                  bookmarkedSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Bookmarked
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium"
                onClick={() => {
                  // Navigate to currently reading section
                  const librarySection =
                    document.getElementById("library-section");
                  librarySection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Currently Reading
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium"
                onClick={() => setActiveTab("all")}
              >
                All Mangas
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              {isDarkMode ? (
                <Sun className="h-5 w-5 transition-transform group-hover:rotate-180" />
              ) : (
                <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
              )}
            </Button>

            <div className="relative">
              <Avatar className="ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                  alt="User"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-foreground">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            </div>
          </div>
        </div>
      </header>
      <main className="container py-6 space-y-8">
        {/* Search Section */}
        <SearchSection />

        {/* Featured Carousel */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold">Featured Manga</h2>
          </div>
          <FeaturedCarousel />
        </section>

        {/* Manga Lists with Tabs */}
        <section>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold">Discover Manga</h2>
              </div>
              <TabsList className="grid w-full max-w-2xl grid-cols-6">
                <TabsTrigger
                  value="trending"
                  className="flex items-center gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Trending</span>
                </TabsTrigger>
                <TabsTrigger
                  value="today"
                  className="flex items-center gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Today</span>
                </TabsTrigger>
                <TabsTrigger
                  value="7d"
                  className="flex items-center gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">7d</span>
                </TabsTrigger>
                <TabsTrigger
                  value="30d"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  30d
                </TabsTrigger>
                <TabsTrigger
                  value="90d"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  90d
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="flex items-center gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">All</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="trending">
              <TrendingGrid
                title="Trending Now"
                items={getMangaByPeriod("trending")}
                showLoadMore={true}
              />
            </TabsContent>

            <TabsContent value="today">
              <TrendingGrid
                title="Popular Today"
                items={getMangaByPeriod("today")}
                showLoadMore={false}
              />
            </TabsContent>

            <TabsContent value="7d">
              <TrendingGrid
                title="Popular This Week"
                items={getMangaByPeriod("7d")}
                showLoadMore={false}
              />
            </TabsContent>

            <TabsContent value="30d">
              <TrendingGrid
                title="Popular This Month"
                items={getMangaByPeriod("30d")}
                showLoadMore={true}
              />
            </TabsContent>

            <TabsContent value="90d">
              <TrendingGrid
                title="Popular Last 90 Days"
                items={getMangaByPeriod("90d")}
                showLoadMore={true}
              />
            </TabsContent>

            <TabsContent value="all">
              <TrendingGrid
                title="All Time Popular"
                items={getMangaByPeriod("all")}
                showLoadMore={true}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Library Section */}
        <section id="library-section">
          <LibrarySection />
        </section>
      </main>
      {/* Footer */}
      <footer className="border-t border-border bg-gradient-to-r from-background to-muted/20 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm leading-loose text-muted-foreground">
              © 2024 MangaVerse. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Your manga library is stored locally and privately.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              Terms
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              Privacy
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
              Contact
            </Button>
            <Badge variant="outline" className="ml-2">
              No Login Required
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
