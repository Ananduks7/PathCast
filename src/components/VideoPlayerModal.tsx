import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Lecture } from "@/data/lectures";

interface VideoPlayerModalProps {
  lecture: Lecture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoPlayerModal = ({
  lecture,
  open,
  onOpenChange,
}: VideoPlayerModalProps) => {
  const embedUrl = lecture?.youtubeId
    ? `https://www.youtube.com/embed/${lecture.youtubeId}?autoplay=1&rel=0&enablejsapi=1`
    : "";

  return (
    <Dialog open={open && !!lecture} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-border overflow-hidden">
        <DialogTitle className="sr-only">
          {lecture?.title ?? "Video"}
        </DialogTitle>
        <div className="aspect-video w-full">
          {embedUrl && (
            <iframe
              key={lecture?.youtubeId}
              src={embedUrl}
              title={lecture?.title ?? "Video"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
