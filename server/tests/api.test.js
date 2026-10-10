import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:5000/api';

test('StayEase Backend API Suite', async (t) => {
  let userToken = '';
  let adminToken = '';
  let testHotelId = '';
  let testRoomId = '';
  let createdBookingId = '';
  let createdBookingRef = '';

  // 1. Health Check
  await t.test('1. Health check returns 200 OK and healthy status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'healthy');
    assert.equal(data.service, 'StayEase API');
  });

  // 2. Auth - Demo Admin Login
  await t.test('2. Admin can log in with valid credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@stayease.com', password: 'Admin@123' }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.role, 'admin');
    adminToken = data.token;
    assert.ok(adminToken, 'Admin token should be returned');
  });

  // 3. Auth - Rejection of invalid credentials
  await t.test('3. Login with invalid password returns 401 Unauthorized', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@stayease.com', password: 'WrongPassword999' }),
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  // 4. Auth - Register a fresh test user
  await t.test('4. Register fresh user with valid details', async () => {
    const uniqueEmail = `testuser_${Date.now()}@stayease-test.com`;
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test QA Traveler',
        email: uniqueEmail,
        password: 'Password@123',
        phone: '+91 99999 88888',
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.role, 'user');
    userToken = data.token;
    assert.ok(userToken, 'User token should be returned');
  });

  // 5. Auth - Access /auth/me
  await t.test('5. GET /auth/me returns current user profile', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.name, 'Test QA Traveler');
  });

  // 6. Hotel Search & Filter
  await t.test('6. GET /hotels returns active hotels with correct schema', async () => {
    const res = await fetch(`${BASE_URL}/hotels`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.hotels.length >= 12, 'Expected at least 12 seeded hotels');

    // Pick first hotel for subsequent room tests
    testHotelId = data.hotels[0]._id;
  });

  // 7. Hotel Search by City
  await t.test('7. Search hotels by city (Jaipur) returns matching properties', async () => {
    const res = await fetch(`${BASE_URL}/hotels?city=Jaipur`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.hotels.length > 0);
    assert.ok(data.hotels.every((h) => h.city.toLowerCase() === 'jaipur'));
  });

  // 8. Single Hotel with Populated Rooms
  await t.test('8. GET /hotels/:id returns details with populated rooms', async () => {
    const res = await fetch(`${BASE_URL}/hotels/${testHotelId}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.hotel.rooms.length > 0, 'Hotel should have at least 1 room');
    testRoomId = data.hotel.rooms[0]._id;
  });

  // 9. Availability Validation - Reject Invalid Dates
  await t.test('9. Rejects invalid dates where checkout is before checkin', async () => {
    const inDate = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
    const outDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

    const res = await fetch(
      `${BASE_URL}/hotels/${testHotelId}/availability?checkIn=${inDate}&checkOut=${outDate}`
    );
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  // 10. Booking Creation & Server-side Pricing
  await t.test('10. Create new booking with calculated taxes and fees', async () => {
    const inDate = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
    const outDate = new Date(Date.now() + 13 * 86400000).toISOString().split('T')[0];

    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        hotelId: testHotelId,
        roomId: testRoomId,
        checkIn: inDate,
        checkOut: outDate,
        guests: { adults: 2, children: 0 },
        guestDetails: {
          fullName: 'Test QA Traveler',
          email: 'qa@stayease.com',
          phone: '+91 99999 88888',
        },
        paymentProvider: 'demo_gateway',
        instantDemoConfirm: false,
      }),
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.booking.nights, 3);
    assert.ok(data.booking.taxes > 0, 'GST taxes should be strictly calculated');
    assert.ok(data.booking.fees === 299, 'Standard service fee applied');
    assert.equal(data.booking.bookingStatus, 'pending');

    createdBookingId = data.booking._id;
    createdBookingRef = data.booking.bookingReference;
  });

  // 11. Payment - Interactive Demo Gateway Confirmation
  await t.test('11. Demo payment verification updates booking to confirmed & paid', async () => {
    const res = await fetch(`${BASE_URL}/payments/demo-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        bookingId: createdBookingId,
        demoCardLast4: '4242',
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.booking.paymentStatus, 'paid');
    assert.equal(data.booking.bookingStatus, 'confirmed');
  });

  // 12. Booking Cancellation & Refund Calculation
  await t.test('12. Cancel eligible confirmed booking and verify refund calculation', async () => {
    const res = await fetch(`${BASE_URL}/bookings/${createdBookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ reason: 'Trip plans changed' }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.booking.bookingStatus, 'cancelled');
    assert.ok(data.booking.refundAmount > 0, 'Refund amount should be processed');
  });

  // 13. Security - Ordinary User Cannot Access Admin Dashboard
  await t.test('13. Ordinary user is forbidden from admin dashboard (403)', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  // 14. Security - Admin Accesses Dashboard Metrics
  await t.test('14. Admin successfully accesses /admin/dashboard metrics', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.stats.totalHotels >= 12);
    assert.ok(data.stats.totalBookings >= 1);
  });
});
