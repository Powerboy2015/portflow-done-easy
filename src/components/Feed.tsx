import { memo } from "react";
import { competencyLabel } from "../competencies";
import type { Post } from "../types";
import { HEADING, PANEL } from "./ui";

// Static JSX outside the component so it is not created per render
// (rendering-hoist-jsx).
const emptyFeed = (
  <p className="border border-dashed border-black p-3">
    [leeg] Nog geen posts. Schrijf hierboven wat je vandaag hebt gedaan.
  </p>
);

type PostCardProps = {
  post: Post;
  onDelete: (id: number) => void;
};

// Memo: the feed grows while every keystroke in the composer re-renders App
// — cards with unchanged props skip that (rerender-memo).
export const PostCard = memo(function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <li className="border-2 border-black bg-white p-2 [content-visibility:auto] [contain-intrinsic-size:auto_120px]">
      <div className="mb-1.5 flex justify-between border-b border-black pb-1 text-xs select-none">
        <span>{post.createdAt.toLocaleString("nl-NL")}</span>
        <button
          type="button"
          className="border border-black px-1 leading-none hover:bg-black hover:text-white"
          aria-label="Entry verwijderen"
          title="Verwijderen"
          onClick={() => onDelete(post.id)}
        >
          <span aria-hidden="true">[x]</span>
        </button>
      </div>
      <p className="m-0 break-words whitespace-pre-wrap">{post.text}</p>
      {post.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5 border-t border-black pt-1.5 select-none">
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
  onDelete: (id: number) => void;
};

export function Feed({ posts, onDelete }: FeedProps) {
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
            <PostCard key={post.id} post={post} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
