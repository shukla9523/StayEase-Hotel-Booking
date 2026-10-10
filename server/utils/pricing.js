/**
 * StayEase Pricing and Financial Computation Engine
 * Prevents client-side manipulation by strictly computing all numbers server-side.
 */

export const calculateNights = (checkInDate, checkOutDate) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);

  // Normalize to midnight UTC for reliable night calculations
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.round((endUTC - startUTC) / msPerDay);

  return nights;
};

export const calculateBookingPrice = ({
  pricePerNight,
  discountPercentage = 0,
  nights = 1,
  roomsCount = 1,
  taxRate = 0.12, // 12% GST
  serviceFee = 299, // ₹299 standard platform service fee
}) => {
  const baseRate = Number(pricePerNight);
  const totalNights = Math.max(1, Number(nights));
  const count = Math.max(1, Number(roomsCount));

  // Gross room price before discount
  const grossSubtotal = baseRate * totalNights * count;

  // Discount calculation
  const discountAmount = discountPercentage > 0 ? Math.round((grossSubtotal * discountPercentage) / 100) : 0;

  // Net subtotal
  const subtotal = grossSubtotal - discountAmount;

  // Taxes (GST)
  const taxes = Math.round(subtotal * taxRate);

  // Final total
  const fees = serviceFee;
  const totalAmount = subtotal + taxes + fees;

  return {
    pricePerNight: baseRate,
    nights: totalNights,
    roomsCount: count,
    grossSubtotal,
    discount: discountAmount,
    subtotal,
    taxes,
    fees,
    totalAmount,
    currency: 'INR',
  };
};

export const generateBookingReference = () => {
  const prefix = 'SE';
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${randomSuffix}`;
};
