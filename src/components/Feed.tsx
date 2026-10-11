import { memo } from "react";
import { competencyLabel } from "../competencies";
import type { Post } from "../types";
import { HEADING, PANEL } from "./ui";

// Statische JSX buiten het component zodat het niet per render wordt
// aangemaakt (rendering-hoist-jsx).
const emptyFeed = (
  <p className="border border-dashed border-black p-3">
    [leeg] Nog geen posts. Schrijf hierboven wat je vandaag hebt gedaan.
  </p>
);

type PostCardProps = {
  post: Post;
};

// Memo: de feed groeit terwijl elke toetsaanslag in de composer App
// opnieuw rendert — kaarten met ongewijzigde props slaan dat over (rerender-memo).
export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  return (
    <li className="border-2 border-black bg-white p-2 [content-visibility:auto] [contain-intrinsic-size:auto_120px]">
      <div className="mb-1.5 flex justify-between border-b border-black pb-1 text-xs">
        <span>{post.createdAt.toLocaleString("nl-NL")}</span>
      </div>
      <p className="m-0 break-words whitespace-pre-wrap">{post.text}</p>
      {post.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-black pt-1.5">
          {post.tags.map((slug) => (
            <span key={slug} className="border border-black px-1 text-xs">
              [{competencyLabel(slug)}]
            </span>
          ))}
        </div>
      ) : null}
    </li>
  );
});

type FeedProps = {
  posts: Post[];
};

export function Feed({ posts }: FeedProps) {
  return (
    <section className={PANEL} aria-labelledby="pde-feed-titel">
      <h2 id="pde-feed-titel" className={HEADING}>
        [Feed — nieuwste eerst]
      </h2>
      {posts.length === 0 ? (
        emptyFeed
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </section>
  );
}
