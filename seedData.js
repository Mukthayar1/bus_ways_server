export const locations = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Sargodha",
  "Bahawalpur",
  "Sukkur",
  "Abbottabad",
  "Mardan",
  "Mirpur",
  "Rahim Yar Khan",
  "Jhelum",
  "Okara",
];

export const buses = [
  {
    busId: "bus_001",
    company: "Daewoo Express",
    busType: "A/C Seater",
    price: 1800,
    originalPrice: 2000,
    rating: 4.5,
    totalReviews: 720,
    badges: ["Comfortable Ride", "Well Maintained"],
  },
  {
    busId: "bus_002",
    company: "Faisal Movers",
    busType: "A/C Sleeper",
    price: 2200,
    originalPrice: 2400,
    rating: 4.7,
    totalReviews: 950,
    badges: ["Highly Rated", "New Bus"],
  },
  {
    busId: "bus_003",
    company: "Skyways",
    busType: "Non-A/C Seater",
    price: 1400,
    originalPrice: 1600,
    rating: 4.2,
    totalReviews: 530,
    badges: ["Affordable", "Great Service"],
  },
  {
    busId: "bus_004",
    company: "Bilal Travels",
    busType: "A/C Sleeper",
    price: 2500,
    originalPrice: 2700,
    rating: 4.8,
    totalReviews: 1100,
    badges: ["Premium Experience", "Fast Service"],
  },
  {
    busId: "bus_005",
    company: "Niazi Express",
    busType: "Non-A/C Sleeper",
    price: 1600,
    originalPrice: 1800,
    rating: 4.1,
    totalReviews: 400,
    badges: ["Budget Friendly", "Good Seats"],
  },
];

export const generateSeats = () => {
  const seats = [];
  for (let i = 1; i <= 28; i++) {
    let seatType;

    if (i > 24) {
      seatType = i % 4 === 1 ? "window" : "side";
    } else {
      seatType = i % 4 === 1 ? "window" : i % 4 === 2 ? "path" : "side";
    }

    seats.push({
      seat_id: i,
      type: seatType,
      booked: false,
    });
  }
  return Array(7)
    .fill()
    .map((_, row) => seats.slice(row * 4, row * 4 + 4));
};