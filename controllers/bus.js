import Bus from "../models/bus.js";

const getBusDetail = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findOne({ busId });
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.status(200).json({ data: bus });
  } catch (error) {
    console.error('getBusDetail error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const searchBus = async (req, res) => {
  try {
    const { from, to, date } = req.body;

    if (!from || !to || !date) {
      return req.status(400).json({ error: "bus id is required" });
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const buses = await Bus.find({
      from,
      to,
      departureTime: { $gte: startOfDay, $lte: endOfDay },
    });
    res.status(200).json({ success: true, buses });
  } catch (error) {
    console.log("searchBus", error);
    return req.status(500).json({ error: "Internal server error" });
  }
};

export { getBusDetail, searchBus };
