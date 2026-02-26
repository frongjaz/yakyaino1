import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { getImagePath, IMAGE_PLACEHOLDER } from "@/lib/utils";

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { id, title, image, paragraph, author, tags, publishDate, datePublished, url } = blog;
  const blogUrl = url || `/blog-details/${id}`;
  
  return (
    <>
      <div
        className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
      >
        <Link
          href={blogUrl}
          className="relative block aspect-[37/22] w-full overflow-hidden"
        >
          {tags && tags.length > 0 && (
            <span className="absolute right-4 top-4 z-20 inline-flex items-center justify-center rounded-full bg-[#EF4444] px-4 py-2 text-sm font-semibold capitalize text-white">
              {tags[0]}
            </span>
          )}
          <Image 
            src={getImagePath(image)} 
            alt="image" 
            fill 
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
            }}
          />
        </Link>
        <div className="p-6">
          <h3>
            <Link
              href={blogUrl}
              className="mb-4 block text-xl font-bold text-gray-900 transition-colors hover:text-[#EF4444] sm:text-2xl"
            >
              {title}
            </Link>
          </h3>
          <p className="mb-6 border-b border-gray-200 pb-6 text-base font-medium text-gray-600">
            {paragraph}
          </p>
          <div className="flex items-center">
            <div className="mr-5 flex items-center border-r border-gray-200 pr-5">
              {author.image && (
                <div className="mr-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={getImagePath(author.image)} alt={author.name || "author"} fill className="object-cover" onError={(e) => { const t = e.target as HTMLImageElement; if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER; }} />
                  </div>
                </div>
              )}
              <div className="w-full">
                <h4 className="mb-1 text-sm font-medium text-gray-900">
                  By {author.name}
                </h4>
                <p className="text-xs text-gray-500">{author.designation}</p>
              </div>
            </div>
            <div className="inline-block">
              <h4 className="mb-1 text-sm font-medium text-gray-900">
                Date
              </h4>
              <p className="text-xs text-gray-500">{publishDate}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
