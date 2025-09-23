import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  Bookmark,
  Share2,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Star,
  Eye,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import cover01 from "./images/front/1.webp";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  saveReadingProgress,
  getReadingProgress,   // ⬅ add this
  addBookmark,
  getUserPreferences,
  saveUserPreferences,
  addToReadingHistory,
} from "@/lib/library";

// ----------------- Types -----------------
interface MangaPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: MangaPage[];
}

interface RelatedManga {
  id: string;
  title: string;
  coverImage: string;
  rating: number;
  status: string;
  author: string;
}

// ----------------- Local Images -----------------
// You can extend this object with more mangas & chapters
const modules = import.meta.glob(
  "/src/components/images/manga/My Life Turned Around After Being Cheated on and Falsely Accused/ch*/**/*.webp",
  { eager: true, import: "default" }
);

const mangaSources: Record<string, Record<number, string[]>> = {
  1: {}
};

Object.entries(modules).forEach(([path, mod]) => {
  const match = path.match(/ch(\d+)/); // find "ch1", "ch2", etc.
  if (match) {
    const chapter = parseInt(match[1]);
    if (!mangaSources[1][chapter]) {
      mangaSources[1][chapter] = [];
    }
    mangaSources[1][chapter].push(mod as string);
  }
});

// Sort each chapter’s images so 01.webp, 02.webp … are in correct order
Object.keys(mangaSources[1]).forEach(ch => {
  mangaSources[1][+ch].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
});




// ----------------- Component -----------------
const MangaReaderPage = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterData, setCurrentChapterData] = useState<Chapter | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [readingMode, setReadingMode] = useState<
    "single" | "double" | "webtoon"
  >("single");
  const [readingDirection, setReadingDirection] = useState<"ltr" | "rtl">("ltr");
  const [autoScroll, setAutoScroll] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());
  const readerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Example static details (could be dynamic later)
  const mangaDetails = {
    id: id || "1",
    title:
      "My Life Turned Around: After Being Cheated on and Falsely Accused, I Ended up Being Adored by the Most Beautiful Girl in School",
    author: "D",
    coverImage: cover01,
    rating: 8.58,
    status: "Ongoing",
    totalChapters: 3,
  };

  const relatedSeries: RelatedManga[] = [
    {
      id: "2",
      title: "Demon Slayer",
      author: "Koyoharu Gotouge",
      coverImage:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80",
      rating: 4.7,
      status: "Completed",
    },
    {
      id: "3",
      title: "Chainsaw Man",
      author: "Tatsuki Fujimoto",
      coverImage:
        "https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400&q=80",
      rating: 4.8,
      status: "Ongoing",
    },
    {
      id: "4",
      title: "My Hero Academia",
      author: "Kohei Horikoshi",
      coverImage:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80",
      rating: 4.6,
      status: "Ongoing",
    },
    {
      id: "5",
      title: "Attack on Titan",
      author: "Hajime Isayama",
      coverImage:
        "https://images.unsplash.com/photo-1612036782180-6f0822045d55?w=400&q=80",
      rating: 4.9,
      status: "Completed",
    },
  ];


  useEffect(() => {
    const generateChapters = () => {
      const mockChapters: Chapter[] = [];
      const mangaKey = "1"; // Later can map this from `id`

      if (mangaSources[mangaKey]) {
        for (const [chapterNumber, imgs] of Object.entries(
          mangaSources[mangaKey]
        )) {
          const pages = imgs.map((img, index) => ({
            id: `page-${chapterNumber}-${index + 1}`,
            pageNumber: index + 1,
            imageUrl: img,
            width: 800,
            height: 1200,
          }));

          mockChapters.push({
            id: `chapter-${chapterNumber}`,
            number: Number(chapterNumber),
            title: `Chapter ${chapterNumber}`,
            pages,
          });
        }
      }
      return mockChapters;
    };


    const mockChapters = generateChapters();
    setChapters(mockChapters);
// After setting chapters
const savedProgress = getReadingProgress(id || "1");
if (savedProgress) {
  setCurrentChapter(savedProgress.currentChapter);
  setCurrentChapterData(mockChapters[savedProgress.currentChapter - 1]);
  setCurrentPage(savedProgress.currentPage);
}

    // Set initial chapter
    const initialChapter = parseInt(chapterId || "1");
    setCurrentChapter(initialChapter);
    setCurrentChapterData(mockChapters[initialChapter - 1] || mockChapters[0]);
    setIsLoading(false);

    // Load user preferences
    const prefs = getUserPreferences();
    setReadingMode(prefs.readingMode);
    setReadingDirection(prefs.readingDirection);
  }, [chapterId]);

  // Auto-load all pages when chapter changes
  useEffect(() => {
    if (currentChapterData) {
      const loadAllPages = async () => {
        const pageNumbers = currentChapterData.pages.map((p) => p.pageNumber);

        // Simulate loading all pages
        for (const pageNum of pageNumbers) {
          setTimeout(() => {
            setLoadedPages((prev) => new Set([...prev, pageNum]));
          }, pageNum * 0); // Stagger loading for visual effect
        }
      };

      setLoadedPages(new Set());
      loadAllPages();
    }
  }, [currentChapterData]);

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    if (showControls) {
      resetControlsTimeout();
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleChapterChange = (chapterNumber: number) => {
    const chapter = chapters.find((c) => c.number === chapterNumber);
    if (chapter) {
      setCurrentChapter(chapterNumber);
      setCurrentChapterData(chapter);
      setCurrentPage(1);
      setShowChapterList(false);

      // Update URL
      navigate(`/reader/${id}/${chapterNumber}`, { replace: true });

      // Save reading progress
      saveReadingProgress({
        mangaId: id || "1",
        currentChapter: chapterNumber,
        currentPage: 1,
        totalChapters: chapters.length,
        lastReadAt: new Date().toISOString(),
        readingTime: 0,
      });
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (
      currentChapterData &&
      pageNumber >= 1 &&
      pageNumber <= currentChapterData.pages.length
    ) {
      setCurrentPage(pageNumber);

      // Save reading progress
      saveReadingProgress({
        mangaId: id || "1",
        currentChapter,
        currentPage: pageNumber,
        totalChapters: chapters.length,
        lastReadAt: new Date().toISOString(),
        readingTime: 0,
      });
    }
  };

  const goToNextPage = () => {
    if (currentChapterData) {
      if (currentPage < currentChapterData.pages.length) {
        handlePageChange(currentPage + 1);
      } else if (currentChapter < chapters.length) {
        handleChapterChange(currentChapter + 1);
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    } else if (currentChapter > 1) {
      const prevChapter = chapters.find((c) => c.number === currentChapter - 1);
      if (prevChapter) {
        setCurrentChapter(currentChapter - 1);
        setCurrentChapterData(prevChapter);
        setCurrentPage(prevChapter.pages.length);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleBookmark = () => {
    addBookmark({
      mangaId: id || "1",
      chapterNumber: currentChapter,
      pageNumber: currentPage,
      note: `Chapter ${currentChapter}, Page ${currentPage}`,
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/reader/${id}/${currentChapter}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("Reader link copied to clipboard");
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const getCurrentPageProgress = () => {
    if (!currentChapterData) return 0;
    return (currentPage / currentChapterData.pages.length) * 100;
  };

  const getTotalProgress = () => {
    const totalPages = chapters.reduce(
      (sum, chapter) => sum + chapter.pages.length,
      0,
    );
    const currentTotalPages =
      chapters
        .slice(0, currentChapter - 1)
        .reduce((sum, chapter) => sum + chapter.pages.length, 0) + currentPage;
    return (currentTotalPages / totalPages) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading manga pages...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div
        ref={readerRef}
        className="min-h-screen bg-black text-white relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Top Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="text-white hover:bg-white/20"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>

                  <div className="text-white">
                    <h1 className="text-lg font-semibold">
                      {mangaDetails.title}
                    </h1>
                    <p className="text-sm text-white/70">
                      Chapter {currentChapter} - Page {currentPage} of{" "}
                      {currentChapterData?.pages.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Chapter Selector */}
                  <Sheet
                    open={showChapterList}
                    onOpenChange={setShowChapterList}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Menu className="mr-2 h-4 w-4" />
                        Chapters
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-80 bg-black/95 text-white border-white/20"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-white">Chapters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-2 max-h-[80vh] overflow-y-auto">
                        {chapters.map((chapter) => (
                          <Button
                            key={chapter.id}
                            variant={
                              chapter.number === currentChapter
                                ? "default"
                                : "ghost"
                            }
                            className={cn(
                              "w-full justify-start text-left",
                              chapter.number === currentChapter
                                ? "bg-primary text-primary-foreground"
                                : "text-white hover:bg-white/20",
                            )}
                            onClick={() => handleChapterChange(chapter.number)}
                          >
                            <div>
                              <div className="font-medium">{chapter.title}</div>
                              <div className="text-xs opacity-70">
                                {chapter.pages.length} pages
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Settings */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/95 text-white border-white/20">
                      <DropdownMenuItem onClick={handleBookmark}>
                        <Bookmark className="mr-2 h-4 w-4" /> Bookmark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleFullscreen}>
                        {isFullscreen ? (
                          <>
                            <Minimize className="mr-2 h-4 w-4" /> Exit
                            Fullscreen
                          </>
                        ) : (
                          <>
                            <Maximize className="mr-2 h-4 w-4" /> Fullscreen
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={() => {
                          console.log(`Downloading chapter ${currentChapter}`);
                          alert(
                            `Download started for Chapter ${currentChapter}`,
                          );
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Chapter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowControls(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Chapter Progress</span>
                  <span>{Math.round(getCurrentPageProgress())}%</span>
                </div>
                <Progress value={getCurrentPageProgress()} className="h-1" />

                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Total Progress</span>
                  <span>{Math.round(getTotalProgress())}%</span>
                </div>
                <Progress value={getTotalProgress()} className="h-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Reader Area */}
        <div className="flex-1 flex items-center justify-center min-h-screen p-4">
          {currentChapterData && (
            <div className="relative max-w-4xl mx-auto">
              {readingMode === "webtoon" ? (
                // Webtoon mode - show all pages vertically
                <div className="space-y-2">
                  {currentChapterData.pages.map((page) => (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: loadedPages.has(page.pageNumber) ? 1 : 0.3,
                        y: 0,
                      }}
                      className="relative"
                    >
                      <img
                        src={page.imageUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="w-full h-auto max-w-full"
                        style={{ transform: `scale(${zoom / 100})` }}
                        loading="lazy"
                      />
                      {!loadedPages.has(page.pageNumber) && (
                        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                          <div className="text-white text-sm">
                            Loading page {page.pageNumber}...
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                // Single/Double page mode
                <motion.div
                  key={`${currentChapter}-${currentPage}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {currentChapterData.pages[currentPage - 1] && (
                    <>
                      <img
                        src={currentChapterData.pages[currentPage - 1].imageUrl}
                        alt={`Page ${currentPage}`}
                        className="max-w-full max-h-[90vh] object-contain mx-auto"
                        style={{ transform: `scale(${zoom / 100})` }}
                      />
                      {!loadedPages.has(currentPage) && (
                        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                          <div className="text-white">
                            Loading page {currentPage}...
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <AnimatePresence>
          {showControls && readingMode !== "webtoon" && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-40"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={
                        readingDirection === "ltr"
                          ? goToPreviousPage
                          : goToNextPage
                      }
                      className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      disabled={
                        (readingDirection === "ltr" &&
                          currentChapter === 1 &&
                          currentPage === 1) ||
                        (readingDirection === "rtl" &&
                          currentChapter === chapters.length &&
                          currentPage ===
                            (currentChapterData?.pages.length || 0))
                      }
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {readingDirection === "ltr" ? "Previous Page" : "Next Page"}
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-40"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={
                        readingDirection === "ltr"
                          ? goToNextPage
                          : goToPreviousPage
                      }
                      className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      disabled={
                        (readingDirection === "ltr" &&
                          currentChapter === chapters.length &&
                          currentPage ===
                            (currentChapterData?.pages.length || 0)) ||
                        (readingDirection === "rtl" &&
                          currentChapter === 1 &&
                          currentPage === 1)
                      }
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {readingDirection === "ltr" ? "Next Page" : "Previous Page"}
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentChapter === 1 && currentPage === 1}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoom(Math.max(50, zoom - 25))}
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-white/70 min-w-[60px] text-center">
                      {zoom}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setZoom(Math.min(200, zoom + 25))}
                      className="text-white hover:bg-white/20"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Select
                    value={readingMode}
                    onValueChange={(value: any) => setReadingMode(value)}
                  >
                    <SelectTrigger className="w-32 bg-black/50 text-white border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 text-white border-white/20">
                      <SelectItem value="single">Single Page</SelectItem>
                      <SelectItem value="webtoon">All Pages/Webtoon</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={
                      currentChapter === chapters.length &&
                      currentPage === (currentChapterData?.pages.length || 0)
                    }
                    className="text-white hover:bg-white/20"
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Page Navigation Slider */}
              {readingMode !== "webtoon" && currentChapterData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>
                      Page {currentPage} of {currentChapterData.pages.length}
                    </span>
                    <span>
                      Chapter {currentChapter} of {chapters.length}
                    </span>
                  </div>
                  <Slider
                    value={[currentPage]}
                    onValueChange={([value]) => handlePageChange(value)}
                    max={currentChapterData.pages.length}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
};

export default MangaReaderPage;
