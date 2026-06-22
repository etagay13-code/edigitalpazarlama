import { Fragment } from "react";

// Bir başlık metninde, verilen "highlight" ifadesini gradient ile vurgular.
// highlight boşsa veya metinde geçmiyorsa metni olduğu gibi döndürür.
export function Highlighted({
  text,
  highlight,
}: {
  text: string;
  highlight?: string | null;
}) {
  if (!highlight) return <>{text}</>;
  const idx = text.toLocaleLowerCase("tr").indexOf(highlight.toLocaleLowerCase("tr"));
  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + highlight.length);
  const after = text.slice(idx + highlight.length);

  return (
    <Fragment>
      {before}
      <span className="gradient-text">{match}</span>
      {after}
    </Fragment>
  );
}
