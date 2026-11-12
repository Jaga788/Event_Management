// Each category is one type of function a customer can plan.
// Category photos provide the default artwork; colors remain as a fallback.
const categories = [
  { id: 1, slug: "wedding", name: "Wedding", emoji: "💍", colors: ["#315f72", "#b77f52"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    tagline: "Grand mandaps, candid memories and a day to remember forever." },
  { id: 2, slug: "engagement", name: "Engagement", emoji: "💎", colors: ["#315f72", "#b77f52"],
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
    tagline: "Ring ceremonies and receptions styled to perfection." },
  { id: 3, slug: "birthday", name: "Birthday", emoji: "🎂", colors: ["#315f72", "#b77f52"],
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
    tagline: "Kids parties, milestone birthdays and everything in between." },
  { id: 4, slug: "maturity", name: "Maturity Function", emoji: "🌸", colors: ["#315f72", "#b77f52"],
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
    tagline: "Half saree / Ritu Kalyanam ceremonies with traditional charm." },
  { id: 5, slug: "babyshower", name: "Baby Shower & Naming", emoji: "🍼", colors: ["#315f72", "#b77f52"],
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=85",
    tagline: "Seemantham, baby showers, cradle and naming ceremonies." },
  { id: 6, slug: "corporate", name: "Corporate & Parties", emoji: "🏢", colors: ["#315f72", "#b77f52"],
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=85",
    tagline: "Annual days, launches, housewarmings and anniversaries." },
];

export default categories;
