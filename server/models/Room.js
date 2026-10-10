import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Hotel ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    roomType: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Executive', 'Suite', 'Family Suite', 'Presidential Suite', 'Villa'],
      default: 'Deluxe',
    },
    bedType: {
      type: String,
      default: '1 King Bed',
    },
    roomSizeSqFt: {
      type: Number,
      default: 350,
    },
    capacity: {
      adults: { type: Number, required: true, min: 1, default: 2 },
      children: { type: Number, default: 1, min: 0 },
    },
    totalInventory: {
      type: Number,
      required: [true, 'Total inventory is required'],
      min: [1, 'Inventory must be at least 1'],
      default: 5,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 90,
      default: 0,
    },
    amenities: {
      type: [String],
      default: ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'En-suite Bathroom', 'Room Service'],
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          caption: { type: String, default: '' },
        },
      ],
      default: [],
    },
    cancellationPolicy: {
      isFreeCancellation: { type: Boolean, default: true },
      cancelBeforeHours: { type: Number, default: 24 },
      description: {
        type: String,
        default: 'Free cancellation up to 24 hours before check-in. Partial refund thereafter.',
      },
    },
    mealPlan: {
      type: String,
      enum: ['Room Only', 'Free Breakfast Included', 'All-Inclusive'],
      default: 'Free Breakfast Included',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model('Room', roomSchema);
export default Room;
