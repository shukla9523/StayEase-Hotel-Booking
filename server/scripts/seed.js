import mongoose from 'mongoose';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { connectDB } from '../config/db.js';

export const seedDatabase = async () => {
  console.log('[Seed] Beginning StayEase database seeding process...');

  // 1. Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Hotel.deleteMany({}),
    Room.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log('[Seed] Cleared existing records.');

  // 2. Create Default Admin & User
  const adminUser = await User.create({
    name: 'StayEase Admin',
    email: 'admin@stayease.com',
    passwordHash: 'Admin@123',
    phone: '+91 98765 43210',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const demoUser = await User.create({
    name: 'Aarav Sharma',
    email: 'user@stayease.com',
    passwordHash: 'User@123',
    phone: '+91 91234 56789',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  const reviewerUser = await User.create({
    name: 'Priya Patel',
    email: 'priya@example.com',
    passwordHash: 'User@123',
    phone: '+91 99887 76655',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  });

  console.log('[Seed] Default users created.');

  // 3. Indian Hotels Dataset (12 Premium Properties)
  const hotelsData = [
    {
      name: 'The Raj Palace Heritage Haveli',
      tagline: 'Step into royal Rajputana splendor in the heart of the Pink City',
      description: 'Nestled amidst historic gardens in Jaipur, The Raj Palace is an exquisite 18th-century heritage haveli restored into a luxury heritage hotel. Enjoy royal courtyard dining, authentic Rajasthani folk evenings, and hand-carved marble jharokhas overlooking the Aravalli hills.',
      city: 'Jaipur',
      state: 'Rajasthan',
      address: 'Zorawar Singh Gate, Amer Road, Pink City',
      starRating: 5,
      propertyType: 'Heritage Haveli',
      priceStartingFrom: 5800,
      coordinates: { latitude: 26.9388, longitude: 75.8341 },
      featured: true,
      amenities: ['Free Wi-Fi', 'Swimming Pool', 'Spa & Wellness', 'Royal Dining Restaurant', 'Free Parking', 'Airport Shuttle', 'Bar & Lounge', '24/7 Room Service'],
      images: [
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80', caption: 'Heritage Courtyard Pool', isFeatured: true },
        { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80', caption: 'Palace Facade at Sunset', isFeatured: false },
        { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80', caption: 'Royal Suite Bedroom', isFeatured: false },
      ],
      rooms: [
        {
          name: 'Heritage Deluxe Room',
          roomType: 'Deluxe',
          bedType: '1 King Bed',
          roomSizeSqFt: 380,
          capacity: { adults: 2, children: 1 },
          totalInventory: 6,
          pricePerNight: 5800,
          discountPercentage: 10,
          amenities: ['City View', 'Free Wi-Fi', 'Rain Shower', 'Complimentary Breakfast', 'Mini Bar'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 24, description: 'Free cancellation up to 24h before check-in.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80', caption: 'Heritage Deluxe' }],
        },
        {
          name: 'Maharaja Royal Suite with Balcony',
          roomType: 'Suite',
          bedType: '1 Four-Poster King Bed',
          roomSizeSqFt: 620,
          capacity: { adults: 3, children: 1 },
          totalInventory: 3,
          pricePerNight: 11500,
          discountPercentage: 15,
          amenities: ['Palace Garden View', 'Private Balcony', 'Jacuzzi', 'Butler Service', 'Complimentary High Tea'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 48, description: 'Free cancellation up to 48h before check-in.' },
          mealPlan: 'All-Inclusive',
          images: [{ url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80', caption: 'Maharaja Suite' }],
        },
      ],
    },
    {
      name: 'Taj Coastal Breeze Beach Resort',
      tagline: 'Sun-drenched golden sands and tropical sea-breeze luxury in North Goa',
      description: 'Overlooking the pristine Arabian Sea, Taj Coastal Breeze is a premier beachfront resort in Goa. Features cascading infinity pools, private beach access, authentic Goan seafood shack, and an Ayurvedic spa.',
      city: 'Goa',
      state: 'Goa',
      address: 'Calangute-Baga Coastal Road, North Goa',
      starRating: 5,
      propertyType: 'Resort',
      priceStartingFrom: 7200,
      coordinates: { latitude: 15.5432, longitude: 73.7554 },
      featured: true,
      amenities: ['Private Beach', 'Infinity Pool', 'Spa & Wellness', 'Beachside Bar', 'Free Wi-Fi', 'Water Sports', 'Fitness Center', 'Sea View Dining'],
      images: [
        { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80', caption: 'Beachfront Resort Pools', isFeatured: true },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80', caption: 'Sunset Sea View', isFeatured: false },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80', caption: 'Resort Cabanas', isFeatured: false },
      ],
      rooms: [
        {
          name: 'Ocean View Deluxe Room',
          roomType: 'Deluxe',
          bedType: '1 King Bed',
          roomSizeSqFt: 420,
          capacity: { adults: 2, children: 1 },
          totalInventory: 8,
          pricePerNight: 7200,
          discountPercentage: 12,
          amenities: ['Sea View Balcony', 'Free Wi-Fi', 'Air Conditioning', 'Espresso Maker'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 24, description: 'Free cancellation up to 24 hours prior.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&auto=format&fit=crop&q=80', caption: 'Ocean Deluxe' }],
        },
        {
          name: 'Private Beach Cabana Villa',
          roomType: 'Villa',
          bedType: '1 California King Bed',
          roomSizeSqFt: 850,
          capacity: { adults: 4, children: 2 },
          totalInventory: 4,
          pricePerNight: 16800,
          discountPercentage: 0,
          amenities: ['Direct Beach Access', 'Private Plunge Pool', 'Outdoor Rain Shower', 'Complimentary Champagne'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 72, description: 'Free cancellation up to 72 hours prior.' },
          mealPlan: 'All-Inclusive',
          images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&auto=format&fit=crop&q=80', caption: 'Beach Cabana Villa' }],
        },
      ],
    },
    {
      name: 'The Imperial Grand New Delhi',
      tagline: 'Historic colonial elegance meets contemporary 5-star sophistication',
      description: 'Located in the prime diplomatic and shopping heart of Connaught Place, The Imperial Grand is New Delhi’s most storied luxury hotel. Featuring high ceilings, museum-grade artwork, a wellness sanctuary, and six award-winning restaurants.',
      city: 'Delhi',
      state: 'Delhi NCR',
      address: 'Janpath, Connaught Place, New Delhi',
      starRating: 5,
      propertyType: 'Hotel',
      priceStartingFrom: 8500,
      coordinates: { latitude: 28.6253, longitude: 77.2185 },
      featured: true,
      amenities: ['Fine Dining', 'Heated Outdoor Pool', 'Luxury Spa', 'Business Center', 'Valet Parking', 'High-Speed Wi-Fi', 'Fitness Center'],
      images: [
        { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&auto=format&fit=crop&q=80', caption: 'Colonial Luxury Lobby', isFeatured: true },
        { url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&auto=format&fit=crop&q=80', caption: 'Grand Exterior Courtyard', isFeatured: false },
      ],
      rooms: [
        {
          name: 'Imperial Heritage Club Room',
          roomType: 'Executive',
          bedType: '1 King Bed',
          roomSizeSqFt: 450,
          capacity: { adults: 2, children: 1 },
          totalInventory: 10,
          pricePerNight: 8500,
          discountPercentage: 5,
          amenities: ['Lounge Access', 'Marble Bathroom', 'City Views', 'Turn-down Service'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 24, description: 'Free cancellation until 1 day before.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&auto=format&fit=crop&q=80', caption: 'Club Room' }],
        },
        {
          name: 'Diplomatic Luxury Suite',
          roomType: 'Presidential Suite',
          bedType: '1 Master King Bed',
          roomSizeSqFt: 950,
          capacity: { adults: 2, children: 2 },
          totalInventory: 2,
          pricePerNight: 24000,
          discountPercentage: 0,
          amenities: ['Living & Dining Hall', 'Private Chauffeur Airport Pick-up', 'Steam & Sauna In-room'],
          cancellationPolicy: { isFreeCancellation: false, cancelBeforeHours: 0, description: 'Non-refundable.' },
          mealPlan: 'All-Inclusive',
          images: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80', caption: 'Diplomatic Suite' }],
        },
      ],
    },
    {
      name: 'Marine Heights Luxury Hotel Mumbai',
      tagline: 'Iconic panoramic views across the Queen’s Necklace on Marine Drive',
      description: 'Towering above Nariman Point with breathtaking vistas of the Arabian Sea, Marine Heights offers bespoke urban hospitality in the financial capital. Experience rooftop infinity dining, plush Italian marble suites, and instant access to South Mumbai nightlife.',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Marine Drive, Nariman Point, South Mumbai',
      starRating: 5,
      propertyType: 'Hotel',
      priceStartingFrom: 9200,
      coordinates: { latitude: 18.9256, longitude: 72.8242 },
      featured: true,
      amenities: ['Sea View Rooftop', 'Swimming Pool', 'Michelin-style Dining', 'Valet Parking', 'Free Wi-Fi', '24/7 Gym', 'Airport Transfers'],
      images: [
        { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80', caption: 'Marine Drive Skyline View', isFeatured: true },
        { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&auto=format&fit=crop&q=80', caption: 'Rooftop Bar at Dusk', isFeatured: false },
      ],
      rooms: [
        {
          name: 'Arabian Sea View Room',
          roomType: 'Deluxe',
          bedType: '1 King Bed',
          roomSizeSqFt: 400,
          capacity: { adults: 2, children: 1 },
          totalInventory: 7,
          pricePerNight: 9200,
          discountPercentage: 10,
          amenities: ['Direct Sea View', 'Soundproof Windows', 'Deep Soaking Tub', 'Complimentary Minibar'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 24, description: 'Free cancellation up to 24h before.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&auto=format&fit=crop&q=80', caption: 'Sea View Room' }],
        },
      ],
    },
    {
      name: 'Himalayan Pine Retreat & Spa',
      tagline: 'Tranquil alpine hideaway with snow-capped Himalayan peak views',
      description: 'Perched in Old Manali surrounded by deodar pine forests and apple orchards, this luxury alpine chalet offers wood-paneled heated rooms, crackling fireplaces, river soundscapes, and guided trekking tours.',
      city: 'Manali',
      state: 'Himachal Pradesh',
      address: 'Log Huts Road, Old Manali',
      starRating: 4,
      propertyType: 'Resort',
      priceStartingFrom: 4200,
      coordinates: { latitude: 32.2536, longitude: 77.1782 },
      featured: false,
      amenities: ['Snow View Balconies', 'Indoor Heated Pool', 'Fireplace Lounge', 'Mountain Treks', 'Free Wi-Fi', 'Pure Veg & Trout Dining'],
      images: [
        { url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80', caption: 'Snow Peaks Panorama', isFeatured: true },
        { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80', caption: 'Wooden Alpine Chalet', isFeatured: false },
      ],
      rooms: [
        {
          name: 'Cedar Mountain View Cottage Room',
          roomType: 'Deluxe',
          bedType: '1 King Bed',
          roomSizeSqFt: 360,
          capacity: { adults: 2, children: 1 },
          totalInventory: 6,
          pricePerNight: 4200,
          discountPercentage: 15,
          amenities: ['Pine Wood Interior', 'Mountain Facing Balcony', 'Central Heating', 'Hot Kettle'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 48, description: 'Free cancellation up to 48 hours prior.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1000&auto=format&fit=crop&q=80', caption: 'Cedar Room' }],
        },
      ],
    },
    {
      name: 'Garden City Tech Park Hotel Bengaluru',
      tagline: 'Sleek modern business & leisure luxury in India’s Silicon Valley',
      description: 'Positioned right on Outer Ring Road, Bengaluru, this high-tech 5-star hotel features ergonomic smart rooms, high-speed fiber internet, rooftop microbrewery, and serene landscaped courtyard gardens.',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: 'Outer Ring Road, Marathahalli-Sarjapur Junction, Bengaluru',
      starRating: 5,
      propertyType: 'Boutique',
      priceStartingFrom: 6500,
      coordinates: { latitude: 12.9279, longitude: 77.6835 },
      featured: false,
      amenities: ['High Speed Fiber Wi-Fi', 'Microbrewery', 'Rooftop Pool', 'Ergonomic Workstations', 'Fitness Center', 'EV Charging Station'],
      images: [
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80', caption: 'Modern Pool Terrace', isFeatured: true },
      ],
      rooms: [
        {
          name: 'Smart Business King Room',
          roomType: 'Executive',
          bedType: '1 King Bed',
          roomSizeSqFt: 375,
          capacity: { adults: 2, children: 0 },
          totalInventory: 12,
          pricePerNight: 6500,
          discountPercentage: 0,
          amenities: ['Herman Miller Chair', 'High Speed Wi-Fi', 'Wireless Charger', 'Rain Shower'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 24, description: 'Free cancellation.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80', caption: 'Smart Business' }],
        },
      ],
    },
    {
      name: 'Udaivilas Lakefront Palace Udaipur',
      tagline: 'Enchanting romantic palace on the serene waters of Lake Pichola',
      description: 'A fairytale marble marvel surrounded by tranquil blue waters, traditional Rajasthani dome architecture, and Mewari artwork. Arrive by private royal boat and unwind with spa rituals and candlelight dinners.',
      city: 'Udaipur',
      state: 'Rajasthan',
      address: 'Haridas Ji Ki Magri, Lake Pichola, Udaipur',
      starRating: 5,
      propertyType: 'Palace',
      priceStartingFrom: 14500,
      coordinates: { latitude: 24.5764, longitude: 73.6738 },
      featured: true,
      amenities: ['Lake View Pools', 'Royal Boat Transfers', 'Ayurvedic Spa', 'Fine Indian Dining', 'Butler Service', 'Folk Performances'],
      images: [
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80', caption: 'Lake Palace Courtyard', isFeatured: true },
      ],
      rooms: [
        {
          name: 'Premier Lake View Room with Pool Access',
          roomType: 'Suite',
          bedType: '1 King Bed',
          roomSizeSqFt: 550,
          capacity: { adults: 2, children: 1 },
          totalInventory: 5,
          pricePerNight: 14500,
          discountPercentage: 10,
          amenities: ['Semi-Private Pool Access', 'Lake Pichola Panorama', 'Carved Marble Bath'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 72, description: 'Free cancellation up to 3 days prior.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80', caption: 'Premier Room' }],
        },
      ],
    },
    {
      name: 'The Gateway Taj View Hotel Agra',
      tagline: 'Unobstructed direct views of the Taj Mahal from your private balcony',
      description: 'Wake up to the ethereal sight of the Taj Mahal in the morning mist. Set across nine acres of manicured landscaped Mughal gardens with an infinity pool, rooftop lounge, and authentic Mughlai tandoor dining.',
      city: 'Agra',
      state: 'Uttar Pradesh',
      address: 'Fatehabad Road, Tajganj, Agra',
      starRating: 5,
      propertyType: 'Hotel',
      priceStartingFrom: 5200,
      coordinates: { latitude: 27.1593, longitude: 78.0436 },
      featured: true,
      amenities: ['Taj Mahal View Rooftop', 'Swimming Pool', 'Mughlai Dining', 'Free Wi-Fi', 'Spa', 'Sightseeing Desk'],
      images: [
        { url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&auto=format&fit=crop&q=80', caption: 'Mughal Architecture Grounds', isFeatured: true },
      ],
      rooms: [
        {
          name: 'Taj View Deluxe King Room',
          roomType: 'Deluxe',
          bedType: '1 King Bed',
          roomSizeSqFt: 380,
          capacity: { adults: 2, children: 1 },
          totalInventory: 9,
          pricePerNight: 5200,
          discountPercentage: 15,
          amenities: ['Direct Taj Mahal View', 'Complimentary Wi-Fi', 'Marble Bath', 'Tea/Coffee Maker'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 24, description: 'Free cancellation.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80', caption: 'Taj View Room' }],
        },
      ],
    },
    {
      name: 'Ganga Ghat Heritage Haveli Varanasi',
      tagline: 'Spiritual tranquility overlooking the sacred Ganges River and morning Aarti',
      description: 'An authentic riverside haveli situated right on Assi Ghat. Watch holy sunrise boat processions, participate in yoga meditation classes, and sample traditional Banarasi satvik delicacies.',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      address: 'Assi Ghat, Shivala, Varanasi',
      starRating: 4,
      propertyType: 'Heritage Haveli',
      priceStartingFrom: 3600,
      coordinates: { latitude: 25.2885, longitude: 83.0066 },
      featured: false,
      amenities: ['River Ganges View', 'Rooftop Yoga', 'Vegetarian Restaurant', 'Free Wi-Fi', 'Boat Tour Desk'],
      images: [
        { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80', caption: 'Ghats View Terrace', isFeatured: true },
      ],
      rooms: [
        {
          name: 'Ganges Sunrise View Room',
          roomType: 'Deluxe',
          bedType: '1 Queen Bed',
          roomSizeSqFt: 320,
          capacity: { adults: 2, children: 0 },
          totalInventory: 5,
          pricePerNight: 3600,
          discountPercentage: 10,
          amenities: ['River Facing Balcony', 'Traditional Silk Decor', 'Air Conditioned'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 24, description: 'Free cancellation.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&auto=format&fit=crop&q=80', caption: 'Sunrise Room' }],
        },
      ],
    },
    {
      name: 'Kerala Backwaters Luxury Villa Resort',
      tagline: 'Serene palm-fringed lagoons, Ayurvedic therapies, and houseboat cruises',
      description: 'Immerse yourself in God’s Own Country at Kumarakom, Kochi. Stay in traditional Kerala timber villas with open-to-sky shower courtyards, watch passing houseboats, and relish Karimeen fish curry.',
      city: 'Kochi',
      state: 'Kerala',
      address: 'Backwater Promenade, Kumarakom Lakefront, Kochi',
      starRating: 5,
      propertyType: 'Resort',
      priceStartingFrom: 7800,
      coordinates: { latitude: 9.6175, longitude: 76.4301 },
      featured: true,
      amenities: ['Private Plunge Pool', 'Ayurvedic Wellness Spa', 'Houseboat Tours', 'Backwater Dining', 'Free Wi-Fi'],
      images: [
        { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&auto=format&fit=crop&q=80', caption: 'Backwaters Resort Lagoon', isFeatured: true },
      ],
      rooms: [
        {
          name: 'Heritage Backwater Lake Villa',
          roomType: 'Villa',
          bedType: '1 King Bed',
          roomSizeSqFt: 650,
          capacity: { adults: 2, children: 2 },
          totalInventory: 6,
          pricePerNight: 7800,
          discountPercentage: 15,
          amenities: ['Private Verandah', 'Open Sky Courtyard', 'Complimentary Sunset Cruise'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 48, description: 'Free cancellation.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&auto=format&fit=crop&q=80', caption: 'Lake Villa' }],
        },
      ],
    },
    {
      name: 'Ananda Sacred Ganges Wellness Resort',
      tagline: 'World-renowned Himalayan wellness, yoga sanctuary & sound healing',
      description: 'Located in the foothills of the Himalayas overlooking the emerald Ganges River in Rishikesh. Featuring organic farm-to-table cuisine, daily meditation sessions, hydrotherapy pools, and private yoga pavilions.',
      city: 'Rishikesh',
      state: 'Uttarakhand',
      address: 'Tapovan, Badrinath Road, Rishikesh',
      starRating: 5,
      propertyType: 'Resort',
      priceStartingFrom: 8900,
      coordinates: { latitude: 30.1314, longitude: 78.3248 },
      featured: false,
      amenities: ['Yoga & Meditation', 'Organic Dining', 'Hydrotherapy', 'Mountain River View', 'Free Wi-Fi', 'Nature Trails'],
      images: [
        { url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80', caption: 'Foothills River Sanctuary', isFeatured: true },
      ],
      rooms: [
        {
          name: 'Mountain Valley Wellness Suite',
          roomType: 'Suite',
          bedType: '1 King Bed',
          roomSizeSqFt: 480,
          capacity: { adults: 2, children: 0 },
          totalInventory: 5,
          pricePerNight: 8900,
          discountPercentage: 10,
          amenities: ['Valley View', 'Yoga Mat & Meditation Cushions', 'Herbal Teas', 'Steam Shower'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 48, description: 'Free cancellation.' },
          mealPlan: 'All-Inclusive',
          images: [{ url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&auto=format&fit=crop&q=80', caption: 'Wellness Suite' }],
        },
      ],
    },
    {
      name: 'Wildflower Heritage Cedar Manor Shimla',
      tagline: 'Colonial grandeur amidst virgin cedar forests overlooking Himalayan crests',
      description: 'Situated at 8,250 feet elevation above Shimla, Wildflower Manor was once the residence of Lord Kitchener. Features open-air heated whirlpool with snow-capped mountain views, wood burning fires, and nature walks.',
      city: 'Shimla',
      state: 'Himachal Pradesh',
      address: 'Chharabra, Shimla Ridge, Himachal Pradesh',
      starRating: 5,
      propertyType: 'Resort',
      priceStartingFrom: 9500,
      coordinates: { latitude: 31.1048, longitude: 77.1734 },
      featured: true,
      amenities: ['Heated Outdoor Whirlpool', 'Snow Valley Views', 'Colonial Billiards Room', 'Fireplace In-Room', 'Spa & Wellness'],
      images: [
        { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80', caption: 'Shimla Cedar Forest Manor', isFeatured: true },
      ],
      rooms: [
        {
          name: 'Premier Mountain View Cedar Suite',
          roomType: 'Suite',
          bedType: '1 King Bed',
          roomSizeSqFt: 520,
          capacity: { adults: 2, children: 1 },
          totalInventory: 4,
          pricePerNight: 9500,
          discountPercentage: 5,
          amenities: ['Panoramic Himalayan View', 'Working Fireplace', 'Teakwood Furnishing'],
          cancellationPolicy: { isFreeCancellation: true, cancelBeforeHours: 48, description: 'Free cancellation.' },
          mealPlan: 'Free Breakfast Included',
          images: [{ url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80', caption: 'Cedar Suite' }],
        },
      ],
    },
  ];

  console.log(`[Seed] Inserting ${hotelsData.length} hotels with rooms...`);

  const createdHotels = [];
  const createdRooms = [];

  for (const hData of hotelsData) {
    const { rooms: roomsForHotel, ...hotelFields } = hData;
    const slug = hotelFields.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const hotel = await Hotel.create({
      ...hotelFields,
      slug,
      averageRating: 4.8,
      reviewCount: 3,
    });

    createdHotels.push(hotel);

    for (const rData of roomsForHotel) {
      const room = await Room.create({
        ...rData,
        hotelId: hotel._id,
      });
      createdRooms.push(room);
    }
  }

  console.log(`[Seed] Inserted ${createdHotels.length} hotels and ${createdRooms.length} rooms.`);

  // 4. Sample Bookings & Reviews
  const firstHotel = createdHotels[0];
  const firstRoom = createdRooms[0];

  const sampleBooking1 = await Booking.create({
    bookingReference: 'SE-DEMO-RAJ-7821',
    userId: demoUser._id,
    hotelId: firstHotel._id,
    roomId: firstRoom._id,
    checkIn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    checkOut: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    guests: { adults: 2, children: 0 },
    guestDetails: {
      fullName: 'Aarav Sharma',
      email: 'user@stayease.com',
      phone: '+91 91234 56789',
      specialRequests: 'High floor room facing courtyard pool, please.',
    },
    roomsCount: 1,
    nights: 3,
    pricePerNight: firstRoom.pricePerNight,
    subtotal: firstRoom.pricePerNight * 3,
    taxes: Math.round(firstRoom.pricePerNight * 3 * 0.12),
    fees: 299,
    discount: 0,
    totalAmount: Math.round(firstRoom.pricePerNight * 3 * 1.12 + 299),
    currency: 'INR',
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    paymentProvider: 'demo_gateway',
    paymentReference: 'DEMO-SEED-REF-991',
  });

  const samplePastBooking = await Booking.create({
    bookingReference: 'SE-PAST-JAIPUR-4412',
    userId: reviewerUser._id,
    hotelId: firstHotel._id,
    roomId: firstRoom._id,
    checkIn: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    checkOut: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    guests: { adults: 2, children: 1 },
    guestDetails: {
      fullName: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 99887 76655',
      specialRequests: 'Quiet room with extra pillows',
    },
    roomsCount: 1,
    nights: 3,
    pricePerNight: firstRoom.pricePerNight,
    subtotal: firstRoom.pricePerNight * 3,
    taxes: Math.round(firstRoom.pricePerNight * 3 * 0.12),
    fees: 299,
    discount: 0,
    totalAmount: Math.round(firstRoom.pricePerNight * 3 * 1.12 + 299),
    currency: 'INR',
    bookingStatus: 'completed',
    paymentStatus: 'paid',
    paymentProvider: 'demo_gateway',
    paymentReference: 'DEMO-SEED-PAST-101',
  });

  // Sample Review
  await Review.create({
    userId: reviewerUser._id,
    hotelId: firstHotel._id,
    bookingId: samplePastBooking._id,
    userName: reviewerUser.name,
    userAvatar: reviewerUser.avatar,
    rating: 5,
    title: 'An unforgettable royal experience in Jaipur!',
    comment: '[Sample Verified Review] The palace hospitality was beyond our expectations. The courtyard breakfast was fresh and authentic, and the folk dance evenings made our stay truly magical.',
    stayDate: samplePastBooking.checkIn,
  });

  console.log('[Seed] Sample bookings and reviews created.');
  console.log('[Seed] Database seeding finished successfully!');

  return {
    hotelsCount: createdHotels.length,
    roomsCount: createdRooms.length,
  };
};

// Direct script execution
if (process.argv[1]?.endsWith('seed.js')) {
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}
