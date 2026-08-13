// Decorative, purely-CSS animated background: slow-drifting glow blobs
// over a fine dot grid. No image assets, so it stays lightweight and
// themes automatically with light/dark mode via CSS variables.
export default function BackgroundFX() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <span className="blob blob-a" />
      <span className="blob blob-b" />
      <span className="blob blob-c" />
      <div className="bg-grid" />
    </div>
  );
}
