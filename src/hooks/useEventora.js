import { useEffect, useMemo, useState } from 'react';
import { initialEvents } from '../data/events.js';
import { readLocalStorage } from '../utils/formatters.js';

function useEventora() {
  const [events, setEvents] = useState(() => readLocalStorage('eventora_events', initialEvents));
  const [cart, setCart] = useState(() => readLocalStorage('eventora_cart', []));
  const [wishlist, setWishlist] = useState(() => readLocalStorage('eventora_wishlist', []));
  const [bookings, setBookings] = useState(() => readLocalStorage('eventora_bookings', []));
  const [user, setUser] = useState(() => readLocalStorage('eventora_user', null));
  const [page, setPage] = useState('home');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Events');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(null);
  const [toast, setToast] = useState('');
  const [organizerOpen, setOrganizerOpen] = useState(false);

  useEffect(() => localStorage.setItem('eventora_events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('eventora_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('eventora_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('eventora_bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => {
    if (user) localStorage.setItem('eventora_user', JSON.stringify(user));
    else localStorage.removeItem('eventora_user');
  }, [user]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const notify = message => setToast(message);
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const search = query.toLowerCase();
      return (!search || `${event.title} ${event.city} ${event.venue} ${event.category}`.toLowerCase().includes(search))
        && (category === 'All Events' || event.category === category)
        && (maxPrice === 'all' || event.price <= Number(maxPrice));
    });
    if (sort === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sort === 'date') filtered = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
    return filtered;
  }, [events, query, category, maxPrice, sort]);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function addToCart(event) {
    setCart(previous => previous.some(item => item.id === event.id)
      ? previous.map(item => item.id === event.id ? { ...item, qty: Math.min(item.qty + 1, 10) } : item)
      : [...previous, {
        id: event.id,
        title: event.title,
        date: event.date,
        city: event.city,
        price: event.price,
        image: event.image,
        qty: 1,
      }]);
    notify('Ticket added to your bag');
  }

  function changeQty(id, delta) {
    setCart(previous => previous
      .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
      .filter(item => item.qty > 0 && item.qty <= 10));
  }

  function toggleWish(id) {
    setWishlist(previous => previous.includes(id)
      ? previous.filter(eventId => eventId !== id)
      : [...previous, id]);
    notify(wishlist.includes(id) ? 'Removed from saved events' : 'Event saved for later');
  }

  function login(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    if (!email.includes('@') || password.length < 4) {
      notify('Enter a valid email and password (4+ characters)');
      return;
    }
    setUser({
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, character => character.toUpperCase()),
      email,
    });
    setAuthOpen(false);
    notify('Welcome to Eventora!');
  }

  function checkout() {
    if (!cart.length) return;
    if (!user) {
      setAuthOpen(true);
      setAuthMode('login');
      notify('Sign in to finish your booking');
      return;
    }
    const order = {
      id: 'EV' + Date.now().toString().slice(-7),
      date: new Date().toISOString(),
      total: cartTotal,
      items: cart.map(item => ({ ...item })),
    };
    setBookings(previous => [order, ...previous]);
    setCheckoutDone(order);
    setCart([]);
    setCartOpen(false);
    setPage('bookings');
    notify('Your booking is confirmed!');
  }

  function createEvent(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEvent = {
      id: Date.now(),
      title: formData.get('title'),
      category: formData.get('category'),
      date: formData.get('date'),
      time: formData.get('time'),
      city: formData.get('city'),
      venue: formData.get('venue'),
      price: Number(formData.get('price')),
      seats: Number(formData.get('seats')),
      rating: 5.0,
      tag: 'NEW EVENT',
      image: 'photo-1511578314322-379afb476865',
      color: 'blue',
      description: formData.get('description') || 'A new community event. Book your spot today.',
    };
    setEvents(previous => [newEvent, ...previous]);
    setOrganizerOpen(false);
    setPage('home');
    setCategory('All Events');
    notify('Your demo event is now listed!');
  }

  function go(nextPage) {
    setPage(nextPage);
    setMobileOpen(false);
    setCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return {
    events, cart, setCart, wishlist, bookings, user, setUser, page, setPage,
    query, setQuery, category, setCategory, sort, setSort, maxPrice, setMaxPrice,
    cartOpen, setCartOpen, mobileOpen, setMobileOpen, authOpen, setAuthOpen,
    authMode, setAuthMode, selectedEvent, setSelectedEvent, checkoutDone,
    setCheckoutDone, toast, organizerOpen, setOrganizerOpen, notify,
    filteredEvents, cartCount, cartTotal, addToCart, changeQty, toggleWish,
    login, checkout, createEvent, go,
  };
}

export default useEventora;
