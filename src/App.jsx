import React from "react";
import {
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
// import UserLayout from "./layouts/UserLayout";
// import NotFoundPage from "./pages/NotFoundPage";
// import RegisterPage from "./pages/RegisterPage";
// import LoginPage from "./pages/LoginPage";
// import Unauthorized from "./components/Unauthorized";
// import RequiredAuth from "./components/RequireAuth";
// import ChangePassword from "./components/ChangePassword";
// import ForgetPassword from "./components/ForgotPassword";

const App = () => {

  const isHotelManager = useLocation().pathname.includes("hotelManager");

  return (
    <div>
      {!isHotelManager && <Navbar />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<HomePage />}/>
        </Routes>
      </div>
    </div>
  )

  // const router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <>
  //       <Route path="/sign-up" element={<RegisterPage />} />
  //       <Route path="/sign-in" element={<LoginPage />} />
  //       <Route path="/forgot-password" element={<ForgetPassword />} />
  //       <Route path="/unauthorized" element={<Unauthorized />} />

  //       <Route path="/" element={<UserLayout />}>
  //         <Route index element={<HomePage />} />
  //         <Route path="/jobs" element={<JobsPage />} />
  //         <Route path="/change-password" element={<ChangePassword />} />
  //         <Route
  //           path="/add-job"
  //           element={
  //             <RequiredAuth allowedRoles={["ADMIN", "RECRUITER"]}>
  //               <AddJobPage addJobSubmit={addJob} />
  //             </RequiredAuth>
  //           }
  //         />
  //         <Route
  //           element={<RequiredAuth allowedRoles={["ADMIN", "RECRUITER"]} />}
  //         >
  //           <Route path="/users" element={<Users />} />
  //         </Route>
  //         <Route
  //           path="/jobs/:id"
  //           element={<JobPage deleteJob={deleteJob} />}
  //           loader={jobLoader}
  //         />
  //         <Route
  //           path="/edit-job/:id"
  //           element={<EditJobPage updateJobSubmit={editJob} />}
  //           loader={jobLoader}
  //         />
  //         <Route path="*" element={<NotFoundPage />} />
  //       </Route>
  //     </>
  //   )
  // );

  // return <RouterProvider router={router} />;
};

export default App;
