import React from "react";
import JobListing from "./JobListing";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";

function JobListings({ isHome = false }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = isHome
        ? "http://localhost:2000/jobs?_limit=3"
        : "http://localhost:2000/jobs";
      try {
        const response = await fetch(apiUrl, {
          headers: { Accept: "application/json" },
        });
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [isHome]);

  return (
    <section className="bg-blue-50 px-4 py-10 relative">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-300">
            <Spinner loading={loading} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!loading &&
            jobs.map((recentJob) => (
              <JobListing key={recentJob.id} job={recentJob} />
            ))}
        </div>
      </div>
    </section>
  );
}

export default JobListings;
