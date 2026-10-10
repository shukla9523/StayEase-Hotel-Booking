import mongoose from 'mongoose';

const hotelImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
      maxlength: [120, 'Hotel name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Hotel description is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    country: {
      type: String,
      default: 'India',
    },
    postalCode: {
      type: String,
      default: '',
    },
    coordinates: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    amenities: {
      type: [String],
      default: [],
      index: true,
    },
    images: {
      type: [hotelImageSchema],
      default: [],
    },
    propertyType: {
      type: String,
      enum: ['Hotel', 'Resort', 'Villa', 'Apartment', 'Heritage Haveli', 'Boutique', 'Palace'],
      default: 'Hotel',
      index: true,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    priceStartingFrom: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for rooms
hotelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hotelId',
});

// Text index for full-text search across name, city, and description
hotelSchema.index({ name: 'text', city: 'text', description: 'text' });

export const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
