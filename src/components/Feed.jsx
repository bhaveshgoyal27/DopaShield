import React, { useRef, useEffect } from "react";

const SAMPLE_POSTS = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  title: `Post ${i + 1}`,
  body: `This is simulated content for post ${i + 1}. Scroll to simulate fast scrolling and trigger detectors.`
}));

export default function Feed({ onClick, onScrollDelta }) {
  const elRef = useRef(null);
  const lastScrollTop = useRef(0);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onScroll = () => {
      const top = el.scrollTop;
      const dy = top - lastScrollTop.current;
      lastScrollTop.current = top;
      onScrollDelta(dy);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScrollDelta]);

  return (
    <div className="feed-container">
      <div className="feed" ref={elRef}>
        {SAMPLE_POSTS.map((p) => (
          <div key={p.id} className="post" onClick={() => onClick()}>
            <h4>{p.title}</h4>
            <p>{p.body}</p>
            <div className="post-actions">
              <button className="small">Like</button>
              <button className="small">Save</button>
              <button className="small">Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
