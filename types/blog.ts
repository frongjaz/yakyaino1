type Author = {
  name: string;
  image: string;
  designation: string;
};

export type Blog = {
  id: number;
  title: string;
  paragraph: string;
  content?: string; // HTML content for blog details
  image: string;
  author: Author;
  tags: string[];
  publishDate: string;
  datePublished?: string; // ISO 8601 format for structured data
  dateModified?: string; // ISO 8601 format for structured data
  url?: string; // Full URL to blog post
};
