import {
  Sparkles,
  Music2,
  BriefcaseBusiness,
  Palette,
  Utensils,
  Dumbbell,
} from 'lucide-react';

export const initialEvents = [
  { id: 1, title: 'Neon Nights Music Festival', category: 'Music', date: '2026-11-14', time: '6:30 PM', city: 'Hyderabad', venue: 'Gachibowli Stadium', price: 1499, seats: 120, rating: 4.9, tag: 'TRENDING', image: 'photo-1459749411175-04bf5292ceea', color: 'purple', description: 'An electric night of live music, immersive lights, and unforgettable performances from emerging artists and headline acts.' },
  { id: 2, title: 'Future Founders Summit', category: 'Business', date: '2026-11-21', time: '9:00 AM', city: 'Bengaluru', venue: 'The Lalit Ashok', price: 899, seats: 85, rating: 4.8, tag: 'POPULAR', image: 'photo-1511578314322-379afb476865', color: 'blue', description: 'Meet founders, builders, and investors. Learn practical strategies for validating ideas, building teams, and growing products.' },
  { id: 3, title: 'Art After Dark Workshop', category: 'Art', date: '2026-11-08', time: '4:00 PM', city: 'Hyderabad', venue: 'The Art House, Jubilee Hills', price: 599, seats: 34, rating: 4.7, tag: 'SMALL GROUP', image: 'photo-1513364776144-60967b0f800f', color: 'orange', description: 'Unplug, explore your creativity, and make your own colorful artwork with guidance from local artists. All materials included.' },
  { id: 4, title: 'Street Food Carnival', category: 'Food', date: '2026-11-28', time: '12:00 PM', city: 'Chennai', venue: 'Island Grounds', price: 299, seats: 240, rating: 4.6, tag: 'FOODIE FAV', image: 'photo-1555939594-58d7cb561ad1', color: 'green', description: 'Taste your way through regional favorites, fusion snacks, live cooking stations, and a lively weekend market.' },
  { id: 5, title: 'Sunrise 5K Community Run', category: 'Fitness', date: '2026-11-07', time: '5:45 AM', city: 'Pune', venue: 'Pashan Lake Trail', price: 399, seats: 90, rating: 4.8, tag: 'FEEL GOOD', image: 'photo-1530549387789-4c1017266635', color: 'cyan', description: 'A friendly, inclusive 5K for every pace. Enjoy a scenic route, warm-up session, hydration points, and a finisher medal.' },
  { id: 6, title: 'Frames & Focus Photo Walk', category: 'Art', date: '2026-11-19', time: '7:00 AM', city: 'Mumbai', venue: 'Kala Ghoda', price: 499, seats: 28, rating: 4.9, tag: 'CREATOR PICK', image: 'photo-1452587925148-ce544e77e70d', color: 'pink', description: 'Explore street photography with a local photographer, learn composition tricks, and leave with a stronger creative eye.' },
  { id: 7, title: 'Indie Acoustic Sessions', category: 'Music', date: '2026-12-05', time: '7:30 PM', city: 'Hyderabad', venue: 'The Moonshine Project', price: 799, seats: 65, rating: 4.8, tag: 'INTIMATE', image: 'photo-1516280440614-37939bbacd81', color: 'purple', description: 'A cozy evening of stripped-back performances, intimate storytelling, and independent music in a warm venue.' },
  { id: 8, title: 'Product Design Bootcamp', category: 'Business', date: '2026-12-12', time: '10:00 AM', city: 'Bengaluru', venue: '91Springboard', price: 1199, seats: 42, rating: 4.7, tag: 'LEARN SOMETHING', image: 'photo-1516321318423-f06f85e504b3', color: 'blue', description: 'A hands-on workshop covering user research, wireframes, prototyping, and presenting a product idea with confidence.' },
];

export const categories = [
  { name: 'All Events', icon: Sparkles },
  { name: 'Music', icon: Music2 },
  { name: 'Business', icon: BriefcaseBusiness },
  { name: 'Art', icon: Palette },
  { name: 'Food', icon: Utensils },
  { name: 'Fitness', icon: Dumbbell },
];
