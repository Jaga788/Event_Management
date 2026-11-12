import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, Headset, Layers3 } from "lucide-react";
import categories from "../data/categories";
import services from "../data/services";
import testimonials from "../data/testimonials";
import CategoryCard from "../components/CategoryCard";
import ServiceGrid from "../components/ServiceGrid";

const steps = [
  { title: "Choose an occasion", text: "Start with a wedding, birthday, baby shower or another celebration." },
  { title: "Build your plan", text: "Choose a ready-made package or add only the services you need." },
  { title: "Share your details", text: "Tell us your date, venue and guest count when you check out." },
  { title: "Celebrate with ease", text: "Our team will confirm the details and help bring it all together." },
];

function Home() {
  const [eventType, setEventType] = useState("wedding");
  const navigate = useNavigate();
  const featured = services.filter((s) => s.featured);

  return (
    <div>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Professional event planning, made personal</p>
          <h1>Remarkable events. <span>Thoughtfully planned.</span></h1>
          <p className="hero-sub">
            From company gatherings to once-in-a-lifetime celebrations, find experienced
            teams, clear packages and the details that make an event yours.
          </p>
          <form
            className="hero-form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/events/${eventType}`);
            }}
          >
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} aria-label="Event type">
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <button className="btn" type="submit">Explore services <span aria-hidden="true">→</span></button>
          </form>
          <div className="hero-stats">
            <div><b>500+</b><span>celebrations planned</span></div>
            <div><b>{services.length}</b><span>services to explore</span></div>
            <div><b>4.8 <span aria-hidden="true">★</span></b><span>average rating</span></div>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-photo hero-photo-main">
            <img src={categories[5].image} alt="Professionally coordinated corporate event" />
          </div>
          <div className="hero-photo hero-photo-detail">
            <img src={categories[0].image} alt="Elegant wedding reception setup" />
          </div>
          <div className="hero-photo-note">
            <span className="photo-note-mark" aria-hidden="true">E</span>
            <span><b>Every detail, considered</b><small>One team for the whole occasion</small></span>
          </div>
          <span className="hero-image-caption">EVENTS, WELL ORCHESTRATED</span>
        </div>
      </section>

      <section className="home-promises" aria-label="Why plan with Eventora">
        <div><span aria-hidden="true"><Layers3 size={19} /></span><p><b>Easy to compare</b><small>Clear packages and prices</small></p></div>
        <div><span aria-hidden="true"><BadgeCheck size={19} /></span><p><b>Made for your moment</b><small>Options for every occasion</small></p></div>
        <div><span aria-hidden="true"><Headset size={19} /></span><p><b>Helpful from the start</b><small>Support when you need it</small></p></div>
      </section>

      <section className="section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Where to begin</p>
            <h2 className="section-title">What are you celebrating?</h2>
            <p className="section-sub">Pick an occasion to see ideas and services made for it.</p>
          </div>
          <Link to="/services" className="text-link">Browse all services <span aria-hidden="true">→</span></Link>
        </div>
        <div className="category-list">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">A great place to start</p>
            <h2 className="section-title">Popular packages</h2>
            <p className="section-sub">Thoughtful bundles to make planning simpler.</p>
          </div>
          <Link to="/services" className="text-link">See every package <span aria-hidden="true">→</span></Link>
        </div>
        <ServiceGrid services={featured} />
      </section>

      <section className="section alt">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Simple from start to finish</p>
            <h2 className="section-title">How planning works</h2>
            <p className="section-sub">A few clear steps, with help along the way.</p>
          </div>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div key={s.title} className="step">
              <span className="step-icon">{String(i + 1).padStart(2, "0")}</span>
              <h4>{i + 1}. {s.title}</h4>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Kind words</p>
            <h2 className="section-title">Made memorable together</h2>
          </div>
        </div>
        <div className="testimonials">
          {testimonials.map((t) => (
            <blockquote key={t.name}>
              <p>“{t.text}”</p>
              <footer>— {t.name}, <em>{t.event}</em></footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <h2>Have a special requirement?</h2>
          <p>Tell us about your event and get a custom quote within 24 hours.</p>
        </div>
        <Link to="/plan" className="btn btn-light">Plan My Event</Link>
      </section>
    </div>
  );
}

export default Home;
