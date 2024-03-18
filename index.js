import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://santoshsakre21:sanket123@cluster0.3koj9sr.mongodb.net/your_database_name_here?retryWrites=true&w=majority&appName=Cluster0", {

}).then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const reminderSchema = new mongoose.Schema({
  date: Date,
  time: String,
  message: String
});

const Reminder = mongoose.model('Reminder', reminderSchema);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is ready');
});

// GET handler for retrieving all reminders
app.get('/reminder', async (req, res) => {
 
  try {
    const reminders = await Reminder.find();
    console.log('reminders',reminders);
    return res.json([reminders]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/post_reminders', async (req, res) => {
  console.log('posting-->');
  const { date, time, message } = req.body;
  console.log('date-->',date);
  console.log('time-->',time);
  console.log('message-->',message);

  if (!date || !time || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const reminder = new Reminder({ date, time, message });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
