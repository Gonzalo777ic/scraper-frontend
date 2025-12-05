"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductImageDialogProps {
  imageUrl: string | null;
  productName: string;
}

    export function ProductImageDialog({ imageUrl, productName }: ProductImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);


  if (!imageUrl) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-muted/50 text-xs text-muted-foreground">
        N/A
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="group relative h-12 w-12 overflow-hidden rounded-md border border-border bg-white transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1 focus:outline-none focus:ring-2 focus:ring-primary">
          <img
            src={imageUrl}
            alt={productName}
            className="h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="sr-only">View larger image</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none sm:max-w-3xl">
        <div className="relative flex flex-col items-center justify-center">
          {}
          <DialogTitle className="sr-only">{productName}</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute -right-4 -top-4 z-50 h-8 w-8 rounded-full border shadow-md sm:-right-10 sm:-top-10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          
          {}
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow-2xl">
            <img
              src={imageUrl}
              alt={productName}
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />
            <p className="mt-2 text-center text-sm font-medium text-muted-foreground">
              {productName}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}