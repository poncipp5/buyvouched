import React, { useState } from "react";
import cover01 from "./images/front/1.webp";
import { getReadingProgress } from "@/lib/library";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Download,
  BookOpen,
  Calendar,
  User,
  Eye,
  Clock,
  Tag,
  Building,
  UserCheck,
  ChevronRight,
  Play,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  number: number;
  title: string;
  releaseDate: string;
  pages: number;
  isRead: boolean;
}

interface RelatedManga {
  id: string;
  title: string;
  coverImage: string;
  rating: number;
  status: string;
  type: string;
}

const MangaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState("chapters");
const [readingProgress, setReadingProgress] = useState(0);

useEffect(() => {
  const savedProgress = getReadingProgress(id || "1");
  if (savedProgress) {
    // Calculate percent across chapters
    const percent = Math.round(
      (savedProgress.currentChapter / savedProgress.totalChapters) * 100
    );
    setReadingProgress(percent);
  }
}, [id]);

  // Mock data - in a real app, this would be fetched based on the ID
  const mangaDetails = {
    id: id || "1",
    title: "Jinsei Gyakuten - Uwaki sare, Enzai wo Kiserareta Ore ga, Gakuen Ichi no Bishoujo ni Natsukareru",
    description:
      "At the end of summer, Eiji Aono witnesses his childhood friend and girlfriend, Miyuki Amada, cheating on him with Kondo, the ace of the soccer team. Betrayed by her and emotionally shattered, Eiji becomes the target of baseless slander and harassment. Cornered and with nowhere to turn, he escapes to the school rooftop—where he meets a mysterious girl...",
    coverImage: cover01,
    bannerImage: cover01,
    rating: 8.58,
    status: "Ongoing",
    type: "Manga",
    released: "2025",
    author: "D",
    artist: "IKAGUCHI Ei, Higeneko",
    serialization: "Comic",
    postedBy: "Admin",
    postedOn: "June 15, 2025",
    updatedOn: "June 15, 2025",
    views: "2.4K",
    genres: ["Romance", "Drama", "School Life", "Psychological"],
    totalChapters: 3,
    currentChapter: 3,
  };

const chapters: Chapter[] = [
  {
    id: "chapter-1",
    number: 1,
    title: "Chapter 1",
    releaseDate: "2025/06/06",
    pages: 58, // set manually
    isRead: true,
  },
  {
    id: "chapter-2",
    number: 2,
    title: "Chapter 2",
    releaseDate: "2025/07/04",
    pages: 35,
    isRead: true,
  },
  {
    id: "chapter-3",
    number: 3,
    title: "Chapter 3",
    releaseDate: "2025/08/01",
    pages: 31,
    isRead: true,
  },
];



  const relatedSeries: RelatedManga[] = [
    {
      id: "2",
      title: "Demon Slayer",
      coverImage:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
      rating: 4.7,
      status: "Completed",
      type: "Manga",
    },
    {
      id: "3",
      title: "Chainsaw Man",
      coverImage:
        "https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400&q=80",
      rating: 4.8,
      status: "Ongoing",
      type: "Manga",
    },
    {
      id: "4",
      title: "My Hero Academia",
      coverImage:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80",
      rating: 4.6,
      status: "Ongoing",
      type: "Manga",
    },
    {
      id: "5",
      title: "Attack on Titan",
      coverImage:
        "https://images.unsplash.com/photo-1612036782180-6f0822045d55?w=400&q=80",
      rating: 4.9,
      status: "Completed",
      type: "Manga",
    },
  ];

  const handleAddToLibrary = () => {
    setIsInLibrary(!isInLibrary);
  };

  const handleReadChapter = (chapterNumber: number) => {
    console.log(`Reading chapter ${chapterNumber}`);
    // Navigate to the manga reader page
    navigate(`/reader/${mangaDetails.id}/${chapterNumber}`);
  };

  const handleContinueReading = () => {
    console.log(`Continue reading from chapter ${mangaDetails.currentChapter}`);
    // Navigate to the manga reader page
    navigate(`/reader/${mangaDetails.id}/${mangaDetails.currentChapter}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TooltipProvider>
        {/* Header with Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${mangaDetails.bannerImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>

          {/* Navigation */}
          <div className="relative z-10 p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>

          {/* Manga Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <img
                    src={mangaDetails.coverImage}
                    alt={mangaDetails.title}
                    className="w-32 md:w-48 h-48 md:h-72 object-cover rounded-lg shadow-2xl border-2 border-white/20"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                </motion.div>

                <div className="flex-1 text-white">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg text-white"
                  >
                    {mangaDetails.title}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 mb-4"
                  >
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-white">
                        {mangaDetails.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <BookOpen className="h-4 w-4 text-white" />
                      <span className="text-white font-medium">
                        {mangaDetails.totalChapters} chapters
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      {mangaDetails.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/30 text-white"
                    >
                      {mangaDetails.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Eye className="h-4 w-4 text-white" />
                      <span className="text-white">{mangaDetails.views}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 mb-4"
                  >
                    {mangaDetails.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-3"
                  >
                    <Button
                      onClick={handleContinueReading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Continue Reading
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAddToLibrary}
                      className={cn(
                        "border-white/30 text-white hover:bg-white/10",
                        isInLibrary &&
                          "bg-red-500/20 border-red-400 text-red-100",
                      )}
                    >
                      <Heart
                        className={cn(
                          "mr-2 h-4 w-4",
                          isInLibrary && "fill-current",
                        )}
                      />
                      {isInLibrary ? "In Library" : "Add to Library"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reading Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Reading Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Chapter {mangaDetails.currentChapter} of{" "}
                        {mangaDetails.totalChapters}
                      </span>
                      <span>{readingProgress}%</span>
                    </div>
                    <Progress value={readingProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {mangaDetails.description}
                  </p>
                </CardContent>
              </Card>

              {/* Tabs for Chapters and Related */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chapters">Chapters</TabsTrigger>
                  <TabsTrigger value="related">Related Series</TabsTrigger>
                </TabsList>

                <TabsContent value="chapters" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Chapters ({chapters.length})</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              Mark all as read
                            </DropdownMenuItem>
                            <DropdownMenuItem>Download all</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Sort by newest</DropdownMenuItem>
                            <DropdownMenuItem>Sort by oldest</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {chapters.map((chapter, index) => (
                          <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                              "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0",
                              chapter.isRead && "opacity-60",
                            )}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    chapter.isRead
                                      ? "bg-green-500"
                                      : "bg-blue-500",
                                  )}
                                />
                                <div>
                                  <h4 className="font-medium">
                                    {chapter.title}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {chapter.releaseDate}
                                    </span>
                                    <span>{chapter.pages} pages</span>
                                    {chapter.isRead && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Read
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Bookmark className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Bookmark</TooltipContent>
                              </Tooltip>
                              <Button
                                onClick={() =>
                                  handleReadChapter(chapter.number)
                                }
                                size="sm"
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                Read
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="related" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Related Series</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedSeries.map((manga) => (
                          <motion.div
                            key={manga.id}
                            whileHover={{ y: -2 }}
                            className="flex gap-3 p-3 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                            onClick={() => navigate(`/manga/${manga.id}`)}
                          >
                            <img
                              src={manga.coverImage}
                              alt={manga.title}
                              className="w-16 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium line-clamp-1">
                                {manga.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">
                                    {manga.rating}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {manga.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {manga.type}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Manga Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.status}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.type}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Released</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.released}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Author</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.author}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Artist</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.artist}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Serialization</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.serialization}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Posted By</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.postedBy}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Posted On</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.postedOn}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Updated On</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.updatedOn}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Views</p>
                        <p className="text-sm text-muted-foreground">
                          {mangaDetails.views}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={handleContinueReading}>
                    <Play className="mr-2 h-4 w-4" />
                    Continue Reading
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddToLibrary}
                  >
                    <Heart
                      className={cn(
                        "mr-2 h-4 w-4",
                        isInLibrary && "fill-current text-red-500",
                      )}
                    />
                    {isInLibrary ? "Remove from Library" : "Add to Library"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default MangaDetailsPage;
