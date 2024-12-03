
const Course = require("../../models/Course");

// const getAllStudentViewCourses = async (req, res) => {
//   try {
//     const {
//       category = [],
//       level = [],
//       primaryLanguage = [],
//       sortBy = "price-lowtohigh",
//     } = req.query;

//     console.log(req.body, "req.query");

//     let filters = {};
//     if (category.length) {
//       filters.category = { $in: category.split(",") };
//     }
//     if (level.length) {
//       filters.level = { $in: level.split(",") };
//     }
//     if (primaryLanguage.length) {
//       filters.primaryLanguage = { $in: primaryLanguage.split(",") };
//     }

//     let sortParam = {};
//     switch (sortBy) {
//       case "price-lowtohigh":
//         sortParam.pricing = 1;

//         break;
//       case "price-hightolow":
//         sortParam.pricing = -1;

//         break;
//       case "title-atoz":
//         sortParam.title = 1;

//         break;
//       case "title-ztoa":
//         sortParam.title = -1;

//         break;

//       default:
//         sortParam.pricing = 1;
//         break;
//     }

//     const coursesList = await Course.find(filters).sort(sortParam);

//     res.status(200).json({
//       success: true,
//       data: coursesList,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };
class getCourseDetails {
  static getStudentViewCourseDetails = async (req, res) => {
   
   console.log("getCourseData")
    try {


      const { id } = req.params;

      const courseDetails = await Course.findById(id);

      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Course not found!",
        });
      }

      // Transform data to the desired format
      const formattedData = courseDetails.curriculum.map((module) => {
        let link = null;
        let type = 'quiz'; // default type
        
        if (module.moduleType === 'lecture') {
          if (module.moduleVideoUrl) {
            type = 'video';
            link = module.moduleVideoUrl; // Assign video URL to link
          } else if (module.moduleContentUrl.length > 0) {
            type = 'pdf';
            link = module.moduleContentUrl[0]; // Assign PDF URL to link
          }
        }
         
        return {
          title: module.moduleName,
          items: [
            {
              title: module.moduleName,  // Lesson title is the same as moduleName
              type: type,               // video, pdf, or quiz
              time: "60 minutes",       // Placeholder for time, adjust as needed
              link: link                // The link to the content (video or PDF)
            }
          ]
        }; 
      });

      const data = {
        module: formattedData,
        others: courseDetails
      };

      res.json(data);

    } catch (e) {
      console.error(e);
      res.status(500).json({
        success: false,
        message: "Some error occurred!",
      });
    }
  };
}

module.exports = getCourseDetails;
