type Author = {
  name: string;
  image: string;
  designation: string;
};

export type Blog = {
  id: number;
  title: string;
  paragraph: string;
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
  datePublished?: string; // ISO 8601 format for structured data
  dateModified?: string; // ISO 8601 format for structured data
  url?: string; // Full URL to blog post
};
