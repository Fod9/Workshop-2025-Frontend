import "../../styles/components/continents_footer.css";

type ContinentKey = "Europe" | "Asie" | "Afrique" | "Amerique";

export default function ContinentsFooter({ active }: { active: ContinentKey }) {
  const items: { key: ContinentKey; label: string; src: string }[] = [
    { key: "Europe", label: "Europe", src: "/assets/continents/Europe.png" },
    { key: "Asie", label: "Asie", src: "/assets/continents/Asie.png" },
    { key: "Afrique", label: "Afrique", src: "/assets/continents/Afrique.png" },
    { key: "Amerique", label: "Amérique", src: "/assets/continents/Amerique.png" },
  ];

  return (
    <div className="continents-footer" aria-label="Continents">
      {items.map((it) => (
        <div key={it.key} className={`continent-item ${active === it.key ? "active" : "inactive"}`}>
          <img src={it.src} alt={it.label} />
          <span className="label">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

