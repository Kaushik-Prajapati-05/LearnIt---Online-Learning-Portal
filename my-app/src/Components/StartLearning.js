import React, { useState, useEffect } from "react";
import "./Styles/StartLearning.css";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import Header2 from "./HeaderAfterSignIn";
import Footer from "./Footer";
import FeedbackPage from "./FeedbackPage";
const ENDPOINT = process.env.BACKEND_URL || "http://localhost:8000";



function StartLearning() {
  const { id } = useParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${ENDPOINT}/api/coursedetails/${id}`
        );
        // console.log(response);
        if (!response.ok) {
          // console.log("data");
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        // console.log(data);
        setCourses(data.others);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourses();
    }
  }, [id]);

  const handleStart = () => {
    navigate(`/learnCourse/${id}`);
  };
  const showTab = (tabId) => setActiveTab(tabId);
  // console.log(courses);
  return (
    <>
      <Header2 />
      <div className="course-header-2">
        <h1>{courses.title || "Course Title"}</h1>
      </div>
      <div className="course-container-2">
        {/* Header */}


        {/* Main Content */}
        <div className="course-main-content-2">
          {/* Sidebar */}
          <div className="course-sidebar-2">
            <img
              src={courses.image}
              alt="Course"
              className="course-image"
            />
            <div className="course-course-info-2">
              <p>
                <strong>📅 Published On:</strong> {courses.date || "N/A"}
              </p>
              <p>
                <strong>🧑‍🎓 Enrolled Students:</strong>{" "}
                {courses.students?.length || 0}
              </p>
              <p>
                <strong>📖 Modules:</strong> {courses.curriculum?.length || 0}
              </p>
              <p>
                <strong>🌐 Language:</strong> {courses.primaryLanguage || "N/A"}
              </p>
              <p>
                <strong>📝 Category:</strong> {courses.category || "N/A"}
              </p>
              <p>
                <strong>✏ Level:</strong> {courses.level || "N/A"}
              </p>
              <p>
                <strong>💰 Price:</strong> ₹{courses.pricing || "N/A"}
              </p>
            </div>
            <div
              onClick={() => handleStart()}
              className="course-start-button-2"
            >
              Start Learning
            </div>
          </div>

          {/* Main Content Area */}
          <div className="course-content-2">
            {/* Tabs */}
            <div className="course-tabs-2">
              <div
                className={`course-tab-2 ${activeTab === "description" ? "course-tab-active-2" : ""
                  }`}
                onClick={() => showTab("description")}
              >
                Description
              </div>
              <div
                className={`course-tab-2 ${activeTab === "curriculum" ? "course-tab-active-2" : ""
                  }`}
                onClick={() => showTab("curriculum")}
              >
                Curriculum
              </div>
              <div
                className={`course-tab-2 ${activeTab === "instructor" ? "course-tab-active-2" : ""
                  }`}
                onClick={() => showTab("instructor")}
              >
                Instructor
              </div>
              <div
                className={`course-tab-2 ${activeTab === "feedback" ? "course-tab-active-2" : ""
                  }`}
                onClick={() => showTab("feedback")}
              >
                Feedback
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "description" && (
              <div className="course-tab-content-2">
                <p>{courses.description || "No description available."}</p>
                <div className="course-feature-box-2">
                  <h3>In This Course, You Will Learn:</h3>
                  <ul>
                    <li>{courses.welcomeMessage || "No objectives provided."}</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="course-tab-content-2">
                {courses.curriculum && courses.curriculum.length > 0 ? (
                  courses.curriculum.map((module, index) => (
                    <div className="course-chapter-box-2" key={index}>
                      <h3>📍 {module.moduleName}</h3>
                      <div className="course-section-list-2">
                        {module.moduleSections &&
                          module.moduleSections.map((section, idx) => (
                            <p key={idx}>
                              <a href={module.moduleContentUrl || "#"}>
                                🧾 {section}
                              </a>
                            </p>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No curriculum available.</p>
                )}
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="course-tab-content-2">
                <div className="course-instructor-profile-2">
                  <img
                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQEhISEBIQFRMTFRIXFRUWFRAWEBgSFhUWFhYXGBUYHSggGCYlGxYVITEiJSktLi4uFx8zODMtNyouLisBCgoKDg0OGxAQGi0hHiYtLS0tLS0tLS0tLy4tLS0tLTAtLS0tKy0rLSstLS0tLS0tLS0tLS0tLS0tLS0rLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABgIDBAUHAQj/xABCEAABAwEEBwMJBgUDBQAAAAABAAIDEQQFITEGEkFRcYGRE2GhByIyQlJikrHBI3KCstHwFENjosIzU9IkZLPD4f/EABoBAQACAwEAAAAAAAAAAAAAAAAEBQECAwb/xAAwEQEAAgIBAgMFCAMBAQAAAAAAAQIDEQQhMRJBUQUTMnGBImGRobHB4fAzQlIj0f/aAAwDAQACEQMRAD8A7igICAgICAgICAgICCh8jW+kQOJAWYjbEzEd1l14QjOWIfjZ+qz4LejT3tP+o/F4LxhOUsXxs/VPBb0k97j/AOo/FfZM13ouaeBBWJiYbxaJ7K1hkQEBAQEBAQEBAQEBAQEBAQEBAQEHjnACpIAGZOSEzpp7bpJBHg0mQ+76PxHDpVd68e89+iLfl469urS2rSmZ3oBjB8Tupw8F3rxqx36otubee3RrJ7xmf6Ush7tYgdBgusY6x2hHtlvbvMsUrdzEBAogyIbdKz0JJB3BzqdMlpNKz3hvXJevaZbKzaTzt9LVeO8UPVv6Llbj0nt0d68zJHfq3Nj0nhfg8OjPfi3qPqFxtx7R26pdOZSfi6N1FK141mkEHIggjqFwmJjulRMTG4VrDIgICAgICAgICAgICAgIBKDQ3ppKyOrYqPdv/ljn63LqpFOPM9bdEPLzK16V6z+SLW28JJjWRxO4ZNHAKXWla9oV+TLfJ8UsZbuYgICAgICAgICC9ZbW+I60bi092R4jI81rasW7w3pe1J3WdJNdmlDXUbONU+2K6vMZj95KLfjzHWqdi5sT0v0+9ImPDgCCCDkRiDzUVOid9YVIyICAgICAgICAgICCxbLWyFpfIQB4k7gNq2rWbTqGl8laRuyF3vfj56tFWx+yMz947eGSnY8MU6+aqzcm2Tp2hql2RxAQEBAQEBAQEBAQEBBn3Xe0lnPmmrNrD6PLcVyyYq3793bFntj7dvRNrtvFk7dZhyzafSB7x9VBvSaTqVriy1yRuGWtHUQEBAQEBAQEBBiXneDIGaz/AMLdpO4LelJvOoc8uWuOu5QS8be+d2s88B6rRuH6qwpSKRqFPky2yTuWKt3MQEBAQEBAQEBAQEBAQEBBeslpfE4PYaOHQjcRtC1tWLRqW1LzSd1Tm5r1baG7nj0m/Ubwq/Jjmk/ct8GeMsfe2K5u4gICAgICAgsW21thYXvOA6k7AFtWs2nUNMl4pXxSgF42507y9/IbGjcFY0pFI1Cmy5JyW8UsVbuYgICAgICCzabVHGKyPY37xA6VzWl8ladbTp0pivk6UiZ+TXSaS2YeuTwa+niFHnm4Y8/ylKr7N5E/66+sPYtI7M7+ZTi14HWlFmOZhnz/ACli3s7kR/rv5TDY2e0skFY3tcPdIPyXel63jdZ2i3x3pOrxMfNdW7QQEBAQEBBdstpdE4PYaOHTgd4WtqxaNS2peaT4oT66rwbaGBzcDk5u0OVdkpNJ1K5w5YyV3DNWjqICAgICASggmkF6du+jT9myob3na79O5WGHH4I691Pyc3vLdO0NUuyOICAgICDx7gASTQAEk7AAsTMRG5ZiJmdR3Rq8L6e8kRVY3f8AzD/x+fyVRn51rdMfSPXz/hf8X2XSkeLL1n08v5/RqXNrjtOZOJ6nNQJmZncrWKxEahQ6LfU9FhladZa7AOazs0tfwr2HWYSCMiCQ4cCsxbU7hrasTGpjcNxdek8jCGz1e32v5g/5fPip+HnWr0v1j8/5VXJ9mUt1xdJ9PL+Euhla9ocwgtcKgjIhWtbRaNx2UVq2pPhtGpVrZqICAgICDNui8DZ5A4YtODhvb+o2Lnkp466dcOWcdt/i6BFIHAOaaggEHeCq6Y1OpXUTExuFawyICAgINDpXePZs7Jp86QY9zNvXLqpHHpufFPkh8zL4a+GO8/ohqnKsQEBAQEBBpNJbwDG9kPSfQnuaD9aEdVX87PFa+7jvP6fytfZfGm9/ez2j851+zQAqnehEBAQEGNarMDiBisxLEtlodbi2Qwk+a8EtG54FTTiAeiseBlmLeCe0/qqPauCLU97HeO/yTFWyhEBAQEBAQSjRC8c4HHeWf5N+vVROTT/aFhwsv+k/RKFEWAgICDx7gAScAMSe5CZ05zeVsM0j5DtOA3NGAHRWdK+GsQo8uT3l5sxlu5iAgICAgIIXpG6tofXYGDlqg/VUXNn/ANp+n6PUezY1xq/X9ZS3RbRaMxNfaGl7njWDSXBrWnIYUxpiq+bzvULCY1DKtehMLsY3yM7jR7fGh8VmLtWvfoNJsmjPFrh+qz44F2z6C4/aT4bmNx+In6J4xt7PolZGZsc873Pd8m0HgtfFIi+mWjjIB20FQyoDm1JArk4E454U7ws1vudS2102jejzSbXF3F55ajlP4kbzV+v6Sr/aM641/p+sJ6r15cQEBAQEBBcs8xjc17c2kEcliY3GpZraazEw6NZLQJGNe3JwB/8Aiq7V8M6le0tFqxaF5YbCAg02lVr7OAtGch1fw5u8MOa78eu779EXl38OPXqhCnqkQEBAQEBAQQzSxtJz77WfVv0VJzo1m+kPS+y7b4+vSZ/+/u6zZ20rTh0VTVaXXVs0EBAQafSuLWs04z+zcebfOHyWI+KG8fDLm+ijK2kn2WOP5R9VbcCP/X6Sqfas6wa9Zj901V084ICAgICAgIJboba6sfEfVOsPuuz8fzKFya6mLLLhX3Wa+iRqMnCAghmmFo1pgzYxv9zsT4aqncauq7VfNvu+vRolIQxAQEBAQEHrRUgb1iZ1G2Yjc6a/S65gbVYA0Gj3Oa49zC15/t1ui81l5Fsu7Weu4/Gphr4KJrZ9qiVS7rq2cxAQEGNbGB3mnIgg8DgtLd3SnZAPJ3dwkNqefVDGNPvEuJ+TeqsMXIthtEx9fkg8rj1z0ms/T5t6vRPJiAgICAgICDZ6N2js7Qzc6rD+LLxAXHPXdJSOLfw5Y+/onqr1wICDnN6Ta80rt73U4A0HgArPHGqxCjy28V5n72Kt3MQEBAQEBABWJjZvXWG/k1X6jyAaDWYdoJBBpuwJC8lmpOO00nye3wXrkpF482RZxhzWleza/dcWzQQEBBZtIy5rSzpRpNHLu/grKWuprkFz6ZGV2wcBqt5KVhr73NFY7f3aNyskYcFrT3/umKvUPHCAgICAgICCpjy0hwzaQRxBqFiY30ZidTuHTGPBAIyIBHAqqX0TuNqkZUSv1Wk7gT0CzHViZ1G3Mqq1UAgICAgICAgINjdlqaA5jzQZtJyB2qq9o8W2TV6RufP9lx7L5lcW6XnUd4/dtrOcFR17PQ37ri2aCAgILFqcBnkKk8Fjwza0VjvLbxRSs2t2hqr1tQeQ1h80Y4ZEn9+Kv/Z/GnFE2tGpn9Hm/afLjNaK0ncR+v8ADAViqxAQEBAQEBAQdDuZ+tBCfcaOgp9FWZI1eV3gneOvyZq0dWNeZpDKd0b/AMpW1Pihzy/Bb5S5wrRRiAgICAgICAsAsjf3dLVo7x4heV5GP3ea1f76vY8XL73j1v8Ad1+cdJZi5OogICyNZekvmneaDZz+qm8DH488T6dUD2lk93xpjznp/fo069C8wICAgICAgICAgnujRrZovxeD3BV2f45XHF/xR/fNs1ySGNegrDKP6cn5StqfFHzc8v8Ajt8pc4VooxAQEBAQEBYlmD9/NYZe/v8AZSSGRYLUGuDCR59SBt80YkeHgqr2pjr4IyecdFx7Hy28c4/Kev1/lvWPqOaqY6ruenRUUYenErHZnutyOpxOSTLMR1ai95WhzI6+fqufTaWgtFep8Va+y4iIt69P3U3tiZnw+nX9mD+/krdSPUPJ4stRZBAQEBAQEE80ZH/TRfj/ADuVdn+OVxxf8Uf3zbRckhROzWa5u8EdQsxOpYtG405kFaqAQEBAQEBAQFgeE0xOAGZ2AIIlo/ebrTekThUtPatjb7gject5pVU/NmclLa+j0fApGGa7+ro7JSzECo2j9FRVtML61Isvi8Y/eHJdPeQ5e4u8N4s2BxPBPeQzGCy9Awnzn5nIbgs133lpeYjpDnflMtj7Pb7O5uBZAx1N4dJICDxDVa8SLY435qrlRXLuvk3VlnbIxr2GrXAEcCrqJi0bh5y1ZrM1nyXVlqLIICAgICAgIOhXIzVs8I9xp6iv1VZlnd5XeCNY6/JnLR1EHN7xi1JZG7nupwrh4UVnSd1iVFkr4bzH3sdbtBAQEBAQEBBFtMb6DWmzxmr3YSEeq32eJ+XFRc+XUeGE/h4JmfeW7eTVeT+TVvKxn+rT4mub9VDWcu+266WS4jzXbxkeIUXNxaZOsdJd8PKvj6d4aW0XPK31Q4bxQ+BxUC/Ey18t/JYU5mO3npdsl0vz1KHkAFtj4t/Rrk5VPVubJYA3F2J8Ap2LjxXrPWVflzzbpHSHFPLDJW8nD2YYR+Z3+SkuUMPQy+Ws+wkNATWMnLWObO6pxHeTvClcfJr7MoHMwTP26/VNFMVggICAgICAg9DScBmcBxKwa30dMhj1WhoyaAOgoquZ3O1/EajStYZEEJ0ts+rPrbHtB5jzT8h1U7j23TXoqeZXWTfq0qkIogICAgINdb77s8FdeQaw9VvnP6DLnRc7Za17y7Y+Pkv2hEL30wllqyAdk04a1aynnk3lj3qLfkWnpHRYYuFWvW3WfyaAfveTtKjpjaaLS6ltsbt1ps/QytB8CUH0helvbZ4nyOBdqNLtVtNYgZ5ratfFOmkzqHOLx0ztc1ezcIGHIMDXPp3veD4AKVXDWO/Vxm8sKy6e22xlptDm2qEmhq1jJxtwc0BpwBzGO8JbBWe3RmMkx3dQuO+IbbC2eB2sx1cwQ4OGBaQciCotqzWdS6xO3CvKjLrXpavd7FvSGMnxJWreEUIQbm6NKprPRklZY9gJ+0A7nbeB8F3x57V6T1hFzcSl+sdJTGwaQ2aalJA1x9V/mnqcDyKlVzUt5q/JxslO8b+TarqjiAgICAg2FwWftLRGNgOseDcfnTquWa2qS7ceviyRH1dAVcuhAQaLS6y68IeM4zX8JwPjQ8lI49tW16onMp4qeL0QxTlUICDDt16wwf6sjQfZzf8ACMVpbJWveXSmG9/hhHrdpoMRBGT7z8B8Iz6hR7cn/mEynAn/AHn8Eet192iaofI7VPqt81nQZ86rhbLe3eU2nHx07Q1rjQLm6qYm4VQXEGRd0upNE72ZI3fC8H6IPpRkHal2vi01Du8HCi3mdOetuUXhZDDLJEc2OLeIBwPMUPNTazuNuExqUevgmZ8VniGtI57QB77vNaD1x3Lbt1kdzuq6m2KCKKLKJga73jm557y4k81Am3inq7xGocE06k1rwtZ/qU+FrW/Raz3dI7NGsCmRtQg8iOCDPsN6zQf6Ujmj2c2fCcFvXJavaXO+Gl/ihIbDpocp4wfeZgfhd+q715P/AFCHfgR/pP4pDYb7s82DJG6x9V3mv6HPkpFctLdpQ8nHyU7w2C6OIgIJToZZcHynb5jeAxd9Oih8m3aqx4NO9/ok6ip4gIKJow9pa7EOBB4HArMTqdsTETGpc4ttmMT3RuzaacRsPMUKs628URKivSaWmsrK2aoFf+kr5XFkLi2IYVGDn99dg7uu4QcuebTqvZbcfiVpG79Z/RHlHTBAQW5jggoZJRBeBQePNASNgQfVdlpqNIyIB64o1c18o8ANq80uaXRsLy2gJNXNzph5oapeD4XHJ3YPk4uSFtubIdYlkcjmAkEdp5ra5ey56znmfAxj7uulQ3d8yaUP1rbbD/3NopwErgPkjaGrQWpJNyBCUF5AQeIy3Ny6Qy2cgOLnxbWk1IG9hOXDL5rtjzWp8kbNxq5I6dJ/vd0OKQPa1zTVrgCDvBFQVPidxuFNMTE6ldjYXENaKkkADvOASZ11IiZnUOjXfZRDGyMeqMTvOZPM1VZe3ina8x0ilYqyFq3EBAQRvS+79ZomaMW4P+7sPI/PuUrj31PhlA5uLceOPq57pTbOys0hB85/mN4uz/t1jyXbNbw0lG4tPHlj7urm6r10ICAgsy4miCpsW9BWAgOGCD6g0fm7Sy2Z/tQwu6xtP1Rq51pvLrWyX3ezaPgafmSpmKPsQ4X7vNCpdW2Q+9rtPNjqeICzlj7ElO7qqhO75avOTXmmd7Usrur3H6o2YqCh0QQUNFCgvoCAgIOgaF2rtLOGnONxby9JvzpyU/j23TXoqObTw5d+roGiN36zjM4YNwb3u2nkPn3LTkX1Hhhtw8W58c+XZLlDWYgICAgpe0EEEVBBBGwg5oxMb6S4h5WLI6zyxRUPZnXe12w5ACu9uNfvDeu2XL44hw4+D3drT+CBLilCAgIMd5xQZCAgIPpHQR+td1i7rPC34WBv0Rq53pBLr2m0H+rIOTXFo+SnUjVYR7d1FyS6logduljrwLgD4ErN43WSvd2GV+q0u3AnoFASHylGagVzoEbKkBBYecUF9AQEBBL/ACZxultLoG1+0ZrE7GhhGJ5OPOgXbDk8G9ovKwzkiNervVls7Y2NYwUa0UC5WtNp3LtSsViKwurDYQEBAQEGm0r0eivCzuhlwPpRvpVzJAMHDfnQjaCUHzte92S2SZ8E7dWRhx9kjY5p2g7D9ahGzBeadQgqQEGM7M8UF+M4BBUgIPoTyXza112U7hK34ZXt+iMS51LJruc4+sSepqrCEV41xaQRmMRxGKyw6/floDbJaJBkIJXdIyVXJT5haMEbPUHhKDGQZIQeoKQcTyQXrLZnyvbHE1z3vIa1rfSLjsH7wQfQegWibLtgoaOnkoZnjKoyY33W1PE1O2gNUnQEBAQEBAQEEa020RivKKhoyZgPZS0xB9l29p2jmEHz5fl2y2WV0FoYWSNOI2EbHNPrA7CjZYacEHqDFKC7CUF1AQds8mlq1bmef9r+K64v/wAltWNzENbIgFPRRB0S/LTW5Zn1xNjLeZj1D4lQLxq0pNe0Pn5atxBRKcEFhBktyCD1B5YIHzSNjia575DRrWiridw/exB3vye6Dtu9vazar7U8ec7NsbT6jPq7bwRiZTRGBAQEBAQEBAQEGi0s0Vs95RdnO2jm17OVtO0YTuO0HCrTgabwCA4TpNonabtdqzt1oySGTNB7J+77h9099KjFGzSIMYoPYjigyEBB0/yf2nVue3jdPQcJGQN/VdMUfbhpk7NapqMIJPflrpo/Jvq2PkbS0flKhZo+3KRj7ONrm6CCzMUFtBktyCDZ3DcFot8nZWZmsfWccImA7Xu2cMzTAFB3PQjQiC7GVH2locKPmIoabWsHqN7szQVJoKGJlKUYEBAQEBAQEBAQEBBatVmZKx0crGvY4Uc1wDmkbiDmg5ZpX5J85Lud39hIcOEch+TviCM7covKwS2eQxzxvjeK+a9paaVzFcx3jBGWMgyQUHqCaaGWulitke+aynq2U/8AqC7YI+055ezJUtHEGXftrpc0se+1xjkWh/zYVFzx9p3xdnN1wdRBjONSgrs8D5HBkbHve70WMa5zzwaMSg6hor5KJZKSW93ZMwPYsIMx+84YM5VPAoxt1m7Lths0Yis8bY425NaNu0k5knecSjDLQEBAQEBAQEBAQEBAQEBBhXrdUFqZ2dpijlZue0Gh3g5tPeMUHO798jkL6usU74j/ALclZI+AdUPHElyM7Qm8fJ3eVnrWDtWj1oXCQfDg/wDtRnaN2mF0TtWVr2O9l7XMd0dQoNzorLjK3Y4MdzZrAfnPVd8HeXLL2SFSnAQa3Sa1Uswi9qaOT4I5Wn/yBR8/k7YvNFYml7g1gLnHJrQS48AMVGdkhu3QS8bR6FmewH1paRNHJ3ndAUNpncfkaaKOttoLsvs4Rqt4GRwqRwa096MbdGuTR+y2JurZYY4waVIFXup7TzVzuZRhs0BAQEBAQEBAQEBAQEBAQEBAQEBBRNC14o9rXDc4AjoUGrOi9iqXCyWYOIoXNjY1xHeWgLMWmOzExvutu0SsR/kDk+UfJy397f1Y8EPG6I2Ifyf75j83J72/qeCq4dFrEaa1ls7tXLXY19OGtVa2tNu7MREdmzs9mZGKRsYwbmta0dAtWV1AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQf/Z"
                    alt="Instructor"
                    className="instructor-image-2"
                  />
                  <p>
                    <strong>
                      {courses.instructorName || "Instructor Name"}
                    </strong>
                  </p>
                  <p>👉 Expert in {courses.expertise || "N/A"}</p>
                  <p>👉 Students Taught: {courses.taughtStudents || 0}+</p>
                  <p>👉 Courses Offered: {courses.offeredCourses || 0}</p>
                  <p>👉 Rating: {courses.rating || "N/A"}</p>
                  <a
                    href={courses.linkedinUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-link-2"
                  >
                    <FaLinkedin size={30} />
                  </a>
                </div>
              </div>
            )}

            {activeTab === "feedback" && (
              <FeedbackPage />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StartLearning;
