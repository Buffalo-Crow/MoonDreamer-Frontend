import { useMoon } from "../../contexts/moonSignContext"

export default function MoonSignDisplay() {
  const { moonSign, moonImage, moonDescription, error, loading } = useMoon();

  if (loading) return <p>Loading moon sign...</p>;
  if (error) return <p>{error}</p>;
  if (!moonSign) return <p>No moon sign available.</p>;

  return (
    <div>
      {moonImage && (
        <img
          className="home-main__image"
          src={moonImage}
          alt={`${moonSign} moon sign`}
        />
      )}
      <h2>🌙 Today's Moon is in {moonSign}</h2>
      <p className="home-main__description">{moonDescription}</p>
    </div>
  );
}
