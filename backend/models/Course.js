const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  moduleName: String,
  moduleType: String,
  moduleVideoUrl: String,
  // public_id: String,
  // freePreview: Boolean,
  moduleContentUrl: [String],
  moduleSections : [String],
});

const CourseSchema = new mongoose.Schema({
  instructorId: String,
  instructorName: String,
  expertise: String,
  taughtStudents: Number,
  offeredCourses: Number,
  date: Date,
  title: { type: String, required: true, unique: true },
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image : String ,
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  demoVideourl: String,
  rating: Number,
  linkedinUrl: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [LectureSchema],
  isPublised: Boolean,
});

module.exports = mongoose.model("Course", CourseSchema);