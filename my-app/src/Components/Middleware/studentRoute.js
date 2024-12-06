import { Children, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// import { useContextState } from "../../context/userProvider";
const ENDPOINT= process.env.BACKEND_URL ||  "http://localhost:8000";

const PrivateRoute = ({ children }) => {
//   const { user, baseURL, setUser } = useContextState();
  const navigate = useNavigate();
  
  useEffect(() => {
   
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    const accessToken = localStorage.getItem("accessToken");

    if (storedUserInfo) {
    //   const userInfo = JSON.parse(storedUserInfo);
    //   setUser(userInfo); 

    // console.log(storedUserInfo)
      
    
        (async () => {
          try {
            // alert("Hi");
            const response = await fetch(`${ENDPOINT}/auth/authRole`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(storedUserInfo),
            });

            const result = await response.json();
            console.log(result);
            if (response.ok && ["Student"].includes(result.data.user.role)) {
              console.log("RoleChecked");
              
            } else {
              throw new Error("Not authorized");
            }
          } catch {
            localStorage.removeItem("accessToken");
       
            localStorage.removeItem("userInfo");
            navigate("/"); 
          }
        })();
      
    } else {
      navigate("/"); 
    }
  }, [ navigate]);

  return  children;
};

export default PrivateRoute;
