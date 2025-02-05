import dotenv from 'dotenv'
import { connectDB } from "../lib/db.js";
import User from "../models/user.models.js";

dotenv.config();

const seedUsers = [
  // Female Users
  {
    email: "dipty.kapoor@example.com",
    fullName: "Dipty Kapoor",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "divya.patel@example.com",
    fullName: "Divya Patel",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "kriti.sharma@example.com",
    fullName: "Kriti Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "jesika.mehra@example.com",
    fullName: "Jesika Mehra",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },

  // Male Users
  {
    email: "ajit.behl@example.com",
    fullName: "Ajit Behl",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "lakhvinder.singh@example.com",
    fullName: "Lakhvinder Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "chandu.pillai@example.com",
    fullName: "Chandu Pillai",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "ritivik.das@example.com",
    fullName: "Ritivik Das",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "sumeet.yadav@example.com",
    fullName: "Sumeet Yadav",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "naveen.kumar@example.com",
    fullName: "Naveen Kumar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "raghav.bhateja@example.com",
    fullName: "Raghav Bhateja",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};


// Call the function
seedDatabase();
