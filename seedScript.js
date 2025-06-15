import mongoose from "mongoose";
import { buses, generateSeats, locations } from "./seedData.js";
import Bus from "./models/bus.js";
import dotenv from "dotenv";
dotenv.config();

const generateRandomTime = (baseDate) => {
  const hour = Math.floor(Math.random() * 12) + 6;
  const minute = Math.random() > 0.5 ? 30 : 0;
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date;
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongoose connected");

    await Bus.deleteMany();
    console.log("old bus deleted");

    const baseDate = new Date();
    
    for (let i = 0; i < locations?.length; i++) {
      for (let j = i + 1; j < locations?.length; j++) {
        const from = locations[i];
        const to = locations[j];
        const busesInsert = [];

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const travelDate = new Date(baseDate);
          travelDate.setDate(travelDate.getDate() + dayOffset);

          const returnDate = new Date(travelDate);
          returnDate.setDate(returnDate.getDate() + 1);

          buses.forEach((bus) => {
            // Forward journey
            busesInsert.push({
              busId: `${bus.busId}_${from}_${to}_${dayOffset}`,
              from,
              to,
              departureTime: generateRandomTime(travelDate),
              arrivalTime: generateRandomTime(travelDate),
              duration: "9h 30m",
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });

            // Return journey
            busesInsert.push({
              busId: `${bus.busId}_${to}_${from}_${dayOffset + 1}`,
              from: to,
              to: from,
              departureTime: generateRandomTime(returnDate),
              arrivalTime: generateRandomTime(returnDate),
              duration: "9h 30m",
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });
          });
        }

        await Bus.insertMany(busesInsert);
        console.log(`Buses inserted for ${from} to ${to}`);
      }
    }
    console.log("All buses inserted successfully");
  } catch (error) {
    console.log("seedDatabase", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
