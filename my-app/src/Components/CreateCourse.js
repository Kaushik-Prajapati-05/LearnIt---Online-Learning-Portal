import React, { useState } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { NavigateBefore } from '@mui/icons-material';
import './Styles/CreateCourse.css';

const CreateCourse = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    category: '',
    level: '',
    primaryLanguage: '',
    subtitle: '',
    description: '',
    pricing: '',
    welcomeMessage: '',
    image: '',
    video: '',
    pdf: '',
    courseImage: null,
    isPublished: false, // Added default for isPublished
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [modules, setModules] = useState([]);

  const navigate = useNavigate();

  const categories = [
    "Photography",
    "IT",
    "Developer",
    "Marketing",
    "Health",
    "Teaching Online",
    "Technology",
    "Business",
    "Design",
    "Others",
  ];

  const handleAddModule = () => {
    setModules([
      ...modules,
      { moduleName: '', moduleType: '', moduleContent: null, moduleVideo: null },
    ]);
  };

  const handleModuleChange = (index, key, value) => {
    const updatedModules = [...modules];
    updatedModules[index][key] = value;
    setModules(updatedModules);
  };

  const handleFileUpload = (key, index = null) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept =
      key === 'courseImage'
        ? 'image/*'
        : key === 'moduleVideo'
          ? 'video/*'
          : key === 'moduleContent'
            ? '.pdf'
            : '';
    fileInput.onchange = (e) => {
      if (key === 'courseImage') {
        setCourseDetails({ ...courseDetails, courseImage: e.target.files[0] });
      } else {
        handleModuleChange(index, key, e.target.files[0]);
      }
    };
    fileInput.click();
  };

  const uploadCourseImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/media/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) { // Check that url exists in the response
        console.log('Course image uploaded successfully:', result.data);
        setCourseDetails({ ...courseDetails, image: result.data });
        console.log(courseDetails.image);

      } else {
        console.error('Failed to upload course image:', result.message);
      }
    } catch (error) {
      console.error('Error during course image upload:', error);
    }
  };

  const handleFileUploadToServer = async (file, fileType) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/media/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // setCourseDetails({ ...courseDetails, video: result.data.url });
        console.log(`${fileType} uploaded successfully:, result.data`);
        return result.data; // Assuming result.data.url is the URL of the uploaded file
      } else {
        console.error(`Failed to upload ${fileType}:, result.message`);
        return null;
      }
    } catch (error) {
      console.error(`Error during ${fileType} upload:, error`);
      return null;
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!courseDetails.title || !courseDetails.category || !courseDetails.level) {
      alert('Please fill in all required fields.');
      return;
    }

    // Upload the course image if it exists
    if (courseDetails.courseImage) {
      await uploadCourseImage(courseDetails.courseImage);
    }

    // Upload files for each module (content and video)
    for (const module of modules) {
      if (module.moduleContent) {
        const contentUrl = await handleFileUploadToServer(module.moduleContent, 'content');
        module.moduleContentUrl = contentUrl; // Save the uploaded content URL
      }
      if (module.moduleVideo) {
        const videoUrl = await handleFileUploadToServer(module.moduleVideo, 'video');
        module.moduleVideoUrl = videoUrl; // Save the uploaded video URL
      }
    }

    const courseData = {
      instructorId: userInfo._id, // Example: dynamically set based on logged-in user
      instructorName: userInfo.userName, // Example: dynamically set based on logged-in user
      title: courseDetails.title,
      category: courseDetails.category,
      level: courseDetails.level,
      primaryLanguage: courseDetails.primaryLanguage,
      subtitle: courseDetails.subtitle,
      description: courseDetails.description,
      image: courseDetails.image,
      welcomeMessage: courseDetails.welcomeMessage,
      pricing: courseDetails.pricing,
      objectives: courseDetails.objectives,
      curriculum: modules, // Include modules with updated URLs
      isPublished: courseDetails.isPublished, // Ensure isPublished is set
    };

    try {
      console.log(courseData);
      const response = await fetch('http://localhost:8000/instructor/course/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Course created successfully:', data);
        alert('Course created successfully!');
        window.location.href = '/instructor-dashboard';  // Redirect to instructor dashboard page
      } else {
        console.error('Failed to create course:', data.message);
        alert('Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('An error occurred while creating the course');
    }
  };

  const handleQuizRedirect = () => {
    navigate('/create-quiz');
  };

  return (
    <Box className="create-course-container">
      <Box className="section-tabs">
        <Button
          variant={currentSection === 1 ? 'contained' : 'outlined'}
          onClick={() => setCurrentSection(1)}
        >
          Course Details
        </Button>
        <Button
          variant={currentSection === 2 ? 'contained' : 'outlined'}
          onClick={() => setCurrentSection(2)}
        >
          Modules
        </Button>
      </Box>

      <Box className="section-content">
        {currentSection === 1 && (
          <Box className="course-details" sx={{ backgroundColor: '#1f3064' }}>
            <Box className="form-fields">
              <TextField
                label="Course Title"
                variant="outlined"
                sx={{
                  '& label': {
                    color: 'white', // Default label color when not focused
                  },
                  '& label.Mui-focused': {
                    color: '#FF7900', // Orange color when the label is focused
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey', // Default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7900', // Orange color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7900', // Orange color when focused
                    },
                    '& input': {
                      color: 'white', // Text color inside input
                    },
                  },
                  backgroundColor: '#000e3dfb',
                  borderRadius: '5px',
                }}
                fullWidth
                value={courseDetails.title}
                onChange={(e) => setCourseDetails({ ...courseDetails, title: e.target.value })}
              />
              <TextField
  select
  label="Category"
  variant="outlined"
  sx={{
    '& label': {
      color: 'white', // Default label color when not focused
    },
    '& label.Mui-focused': {
      color: '#FF7900', // Orange color when the label is focused
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey', // Default border color
      },
      '&:hover fieldset': {
        borderColor: '#FF7900', // Orange color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FF7900', // Orange color when focused
      },
      '& .MuiSelect-select': {
        color: 'white', // Text color in input after selection
      },
    },
    backgroundColor: '#000e3dfb',
    borderRadius: '5px',
  }}
  fullWidth
  value={courseDetails.category}
  onChange={(e) => setCourseDetails({ ...courseDetails, category: e.target.value })}
  SelectProps={{
    MenuProps: {
      PaperProps: {
        sx: {
          maxHeight: 150, // Limit dropdown height
          backgroundColor: '#000e3dfb', // Dropdown background color
          color: 'white', // Dropdown text color
        },
      },
    },
  }}
>
  {categories.map((category) => (
    <MenuItem key={category} value={category} sx={{ color: 'white' }}>
      {category}
    </MenuItem>
  ))}
</TextField>

              <TextField
  select
  label="Level (e.g., Beginner, Intermediate, Advanced)"
  variant="outlined"
  sx={{
    '& label': {
      color: 'white', // Default label color when not focused
    },
    '& label.Mui-focused': {
      color: '#FF7900', // Orange color when the label is focused
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey', // Default border color
      },
      '&:hover fieldset': {
        borderColor: '#FF7900', // Orange color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FF7900', // Orange color when focused
      },
      '& input': {
        color: 'white', // Text color inside input
      },
      '& .MuiSelect-select': {
        color: 'white', // Ensure selected text color in dropdown is white
      },
    },
    backgroundColor: '#000e3dfb',
    borderRadius: '5px',
  }}
  fullWidth
  value={courseDetails.level}
  onChange={(e) => setCourseDetails({ ...courseDetails, level: e.target.value })}
  SelectProps={{
    MenuProps: {
      PaperProps: {
        sx: {
          maxHeight: 150, // Limit dropdown height
          backgroundColor: '#000e3dfb', // Dropdown background color
          color: 'white', // Dropdown text color
        },
      },
    },
  }}
>
  <MenuItem value="Beginner">Beginner</MenuItem>
  <MenuItem value="Intermediate">Intermediate</MenuItem>
  <MenuItem value="Advanced">Advanced</MenuItem>
</TextField>


              <TextField
                label="Primary Language"
                variant="outlined"
                sx={{
                  '& label': {
                    color: 'white', // Default label color when not focused
                  },
                  '& label.Mui-focused': {
                    color: '#FF7900', // Orange color when the label is focused
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey', // Default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7900', // Orange color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7900', // Orange color when focused
                    },
                    '& input': {
                      color: 'white', // Text color inside input
                    },
                  },
                  backgroundColor: '#000e3dfb',
                  borderRadius: '5px',
                }}
                fullWidth
                value={courseDetails.primaryLanguage}
                onChange={(e) => setCourseDetails({ ...courseDetails, primaryLanguage: e.target.value })}
              />
              <TextField
                label="Subtitle"
                variant="outlined"
                sx={{
                  '& label': {
                    color: 'white', // Default label color when not focused
                  },
                  '& label.Mui-focused': {
                    color: '#FF7900', // Orange color when the label is focused
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey', // Default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7900', // Orange color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7900', // Orange color when focused
                    },
                    '& input': {
                      color: 'white', // Text color inside input
                    },
                  },
                  backgroundColor: '#000e3dfb',
                  borderRadius: '5px',
                }}
                fullWidth
                value={courseDetails.subtitle}
                onChange={(e) => setCourseDetails({ ...courseDetails, subtitle: e.target.value })}
              />
              <TextField
  label="Description"
  variant="outlined"
  sx={{
    '& label': {
      color: 'white', // Default label color when not focused
    },
    '& label.Mui-focused': {
      color: '#FF7900', // Orange color when the label is focused
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey', // Default border color
      },
      '&:hover fieldset': {
        borderColor: '#FF7900', // Orange color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FF7900', // Orange color when focused
      },
      '& textarea': {
        color: 'white', // Text color inside textarea
      },
    },
    backgroundColor: '#000e3dfb',
    borderRadius: '5px',
  }}
  fullWidth
  multiline
  rows={4}
  value={courseDetails.description}
  onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
/>

<TextField
  label="Pricing"
  variant="outlined"
  sx={{
    '& label': {
      color: 'white', // Default label color when not focused
    },
    '& label.Mui-focused': {
      color: '#FF7900', // Orange color when the label is focused
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'grey', // Default border color
      },
      '&:hover fieldset': {
        borderColor: '#FF7900', // Orange color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FF7900', // Orange color when focused
      },
      '& input': {
        color: 'white', // Text color inside input
      },
    },
    backgroundColor: '#000e3dfb',
    borderRadius: '5px',
  }}
  fullWidth
  type="number"
  value={courseDetails.pricing}
  onChange={(e) => {
    const value = e.target.value;
    if (value === '' || Number(value) >= 0) {
      setCourseDetails({ ...courseDetails, pricing: value });
    }
  }}
/>

              <TextField
                label="Welcome Message"
                variant="outlined"
                sx={{
                  '& label': {
                    color: 'white', // Default label color when not focused
                  },
                  '& label.Mui-focused': {
                    color: '#FF7900', // Orange color when the label is focused
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey', // Default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF7900', // Orange color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF7900', // Orange color when focused
                    },
                    '& textarea': {
                      color: 'white', // Text color inside textarea
                    },
                  },
                  backgroundColor: '#000e3dfb',
                  borderRadius: '5px',
                }}
                fullWidth
                multiline
                rows={2}
                value={courseDetails.welcomeMessage}
                onChange={(e) => setCourseDetails({ ...courseDetails, welcomeMessage: e.target.value })}
              />
              <Button
                sx={{
                  backgroundColor: '#FF7900', // Orange color
                  color: '#FFFFFF', // White text
                  '&:hover': {
                    backgroundColor: '#FF7900', // Prevent color change on hover
                  },
                }}
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => handleFileUpload('courseImage')}
              >
                {courseDetails.courseImage
                  ? `Change Course Image (${courseDetails.courseImage.name})`
                  : 'Add Course Image'}
              </Button>
            </Box>
          </Box>
        )}

        {currentSection === 2 && (
          <Box className="modules-section" sx={{ backgroundColor: '#1f3064' }}>
            {modules.map((module, index) => (
              <Box key={index} className="module-container" sx={{ backgroundColor: '#1f3064' }}>
                <TextField
                  label="Module Name"
                  variant="outlined"
                  sx={{
                    '& label': {
                      color: 'white', // Default label color when not focused
                    },
                    '& label.Mui-focused': {
                      color: '#FF7900', // Orange color when the label is focused
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'grey', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF7900', // Orange color on hover
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF7900', // Orange color when focused
                      },
                      '& input': {
                        color: 'white', // Text color inside input
                      },
                    },
                    backgroundColor: '#000e3dfb',
                    borderRadius: '5px',
                    marginBottom: '20px'
                  }}
                  fullWidth
                  value={module.moduleName}
                  onChange={(e) => handleModuleChange(index, 'moduleName', e.target.value)}
                />
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'grey', // Default border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#FF7900', // Orange on hover
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF7900', // Orange when focused
                      },
                    },
                    backgroundColor: '#000e3dfb',
                    borderRadius: '5px',
                  }}
                >
                  <InputLabel
                    sx={{
                      color: 'white', // Default label color
                      '&.Mui-focused': {
                        color: '#FF7900', // Orange color when focused
                      },
                    }}
                  >
                    Module Type
                  </InputLabel>
                  <Select
                    value={module.moduleType}
                    onChange={(e) => handleModuleChange(index, 'moduleType', e.target.value)}
                    label="Module Type"
                    sx={{
                      color: 'white', // Text color inside input
                    }}
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Module Type
                    </MenuItem>
                    <MenuItem value="lecture">Lecture</MenuItem>
                    <MenuItem value="quiz">Quiz</MenuItem>
                  </Select>
                </FormControl>


                {module.moduleType === 'lecture' && (
                  <Box className="module-files">
                    <Button
                      sx={{
                        backgroundColor: '#FF7900', // Orange color
                        color: '#FFFFFF', // White text
                        '&:hover': {
                          backgroundColor: '#FF7900', // Prevent color change on hover
                        },
                        marginRight: '20px',
                        marginTop: '20px'
                      }}
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => handleFileUpload('moduleContent', index)}

                    >
                      Upload Module Content (PDF)
                    </Button>
                    <Button
                      sx={{
                        backgroundColor: '#FF7900', // Orange color
                        color: '#FFFFFF', // White text
                        '&:hover': {
                          backgroundColor: '#FF7900', // Prevent color change on hover
                        },
                        marginRight: '20px',
                        marginTop: '20px'
                      }}
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => handleFileUpload('moduleVideo', index)}
                    >
                      Upload Module Video
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
            <Button
              sx={{
                backgroundColor: '#FF7900', // Orange color
                color: '#FFFFFF', // White text
                '&:hover': {
                  backgroundColor: '#FF7900', // Prevent color change on hover
                },
              }}
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddModule}
            >
              Add Module
            </Button>
          </Box>
        )}
      </Box>

      <Box className="buttons-container">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF7900', // Orange color
            color: '#FFFFFF', // White text
            '&:hover': {
              backgroundColor: '#FF7900', // Prevent color change on hover
            },
            margin: '10px',
          }}
          onClick={handleSubmit}
        >
          Save Course
        </Button>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: '#FF7900', // Orange color
            color: '#FFFFFF', // White text
            '&:hover': {
              backgroundColor: '#FF7900', // Prevent color change on hover
            },
          }}
          startIcon={<NavigateBefore />}
          onClick={() => navigate('/instructor-dashboard')}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCourse;
