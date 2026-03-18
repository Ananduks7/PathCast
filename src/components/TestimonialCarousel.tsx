import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  authorName: string;
  designation?: string;
  institution: string;
  country: string;
  authorImageSrc?: string;
  authorImageAlt?: string;
};

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
  className?: string;
};

const initialsFromName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

const TestimonialCarousel = ({
  testimonials,
  className,
}: TestimonialCarouselProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(testimonials?.length ?? 0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());

    setSnapCount(api.scrollSnapList().length);
    onSelect();

    api.on("select", onSelect);
    api.on("reInit", () => {
      setSnapCount(api.scrollSnapList().length);
      onSelect();
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: testimonials.length > 1 }}
        className="relative overflow-hidden min-h-[420px] md:min-h-[380px]"
      >
        <CarouselContent>
          {testimonials.map((t, idx) => (
            <CarouselItem key={`${t.authorName}-${idx}`} className="basis-full">
              <Card className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left content */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                  <Quote className="w-12 h-12 text-primary/30 dark:text-[#01B2EA]/40 mb-6" />
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8">
                    {t.quote}
                  </p>
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      {t.authorName}
                    </p>
                    {t.designation && (
                      <p className="text-sm text-primary dark:text-[#01B2EA] font-medium mt-0.5">
                        {t.designation}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t.institution}, {t.country}
                    </p>
                  </div>
                </div>

                {/* Right image panel */}
                <div className="w-full md:w-[320px] lg:w-[380px] flex-shrink-0 bg-muted">
                  <div className="relative w-full h-64 md:h-full flex items-center justify-center bg-accent overflow-hidden">
                    {t.authorImageSrc ? (
                      <img
                        src={t.authorImageSrc}
                        alt={t.authorImageAlt ?? t.authorName}
                        className="absolute inset-0 h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-muted-foreground/40">
                        {initialsFromName(t.authorName)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Bottom nav */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => api?.scrollPrev()}
            disabled={!api?.canScrollPrev()}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Testimonials">
            {Array.from({ length: snapCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === activeIndex}
              />
            ))}
          </div>

          <button
            type="button"
            className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => api?.scrollNext()}
            disabled={!api?.canScrollNext()}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
