import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Keep design-system font sizes separate from text-color utilities.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{
        text: [
          "display-xxl", "display-xl", "display-lg", "display-md", "display",
          "heading-lg", "heading-md", "heading-sm",
          "body-lg", "body-md", "body-strong", "body-sm",
          "button-lg", "button-md", "button-cap", "button-sm",
          "caption", "micro-cap", "page-heading", "section-heading",
          "subsection", "eyebrow", "headline-lg", "headline-md", "label-md", "label-sm",
        ],
      }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
