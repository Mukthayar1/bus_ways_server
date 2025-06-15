import { v4 as uuidv4 } from "uuid";

import Bus from "../models/bus.js";
import User from "../models/user.js";
import Ticket from "../models/ticket";

const getUserTicket = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return req.status(404).json({ error: "Auth token is required" });
    }
    const ticket = await Ticket.find({ user: userId })
      .populate(
        "bus",
        "busId from busType company departureTime arrivalTime price"
      )
      .sort({ bookedAt: -1 });

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.log("getUserTicket", error);
    req.status(500).json({ error: "Failed to get user ticket" });
  }
};

const bookTicket = async (req, res) => {
  try {
    const { busId, date, seatNumbers } = req?.body;
    const userId = req?.userId;

    if (!busId || !date || !seatNumbers || seatNumbers?.length == 0) {
      return req.status(404).json({ error: "All fields are required" });
    }

    const bus = await Bus.findOne({ busId });
    if (!bus) {
      return req.status(404).json({ error: "Bus not find" });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return req.status(404).json({ error: "User not find" });
    }

    const unavailableSeats = seatNumbers?.filter((seatNum) =>
      bus.seats?.some((row) =>
        row?.some((seat) => seat.seat_id === seatNum && seat.booked)
      )
    );

    if (unavailableSeats?.length > 0) {
      return req.status(404).json({ error: "These seats are already booked" });
    }

    const totalFare = bus.price * seatNumbers?.length;
    const newTicket = new Ticket({
      user: userId,
      bus: bus._id,
      date,
      seatNumbers,
      total_fare: totalFare,
      pnr: uuidv4().slice(0, 10).toLocaleUpperCase(),
    });
    await newTicket.save();

    bus?.seats?.forEach((row) => {
      row.forEach((seat) => {
        if (seatNumbers.includes(seat.seat_id)) {
          seat.booked = true;
        }
      });
    });
    await bus.save();
    req.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    console.log("getUserTicket", error);
    req.status(500).json({ error: "Failed to book User confirm" });
  }
};

export { getUserTicket, bookTicket };
