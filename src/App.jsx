import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage, { jobLoader } from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Unauthorized from "./components/Unauthorized";
import RequiredAuth from "./components/RequireAuth";
import Users from "./components/Users";
import ChangePassword from "./components/ChangePassword";
import ForgetPassword from "./components/ForgotPassword";

const App = () => {
  // Add new Job
  const addJob = async (job) => {
    await fetch("http://localhost:2000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
  };

  // Delete Job

  const deleteJob = async (id) => {
    await fetch(`http://localhost:2000/jobs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  // Edit Job
  const editJob = async (job) => {
    await fetch(`http://localhost:2000/jobs/${job.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/add-job"
            element={
              <RequiredAuth allowedRoles={["ADMIN", "RECRUITER"]}>
                <AddJobPage addJobSubmit={addJob} />
              </RequiredAuth>
            }
          />
          <Route
            element={<RequiredAuth allowedRoles={["ADMIN", "RECRUITER"]} />}
          >
            <Route path="/users" element={<Users />} />
          </Route>
          <Route
            path="/jobs/:id"
            element={<JobPage deleteJob={deleteJob} />}
            loader={jobLoader}
          />
          <Route
            path="/edit-job/:id"
            element={<EditJobPage updateJobSubmit={editJob} />}
            loader={jobLoader}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
