import React from "react";

const Hero = ({ title = "Test Title", subtitle = "Test Subtitle" }) => {
  return (
    <>
      <section className="bg-indigo-700 py-20 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="my-4 text-xl text-white">{subtitle}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

// ONLY FOR TESTING PURPOSE
// import { useNavigate } from "react-router-dom";

// const Hero = ({ title = "Test Title", subtitle = "Test Subtitle" }) => {
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     navigate("users");
//   };

//   return (
//     <section className="bg-indigo-700 py-20 mb-4">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
//             {title}
//           </h1>
//           <p className="my-4 text-xl text-white">{subtitle}</p>
//           <button
//             onClick={handleNavigate}
//             className="mt-6 px-6 py-2 rounded bg-white text-indigo-700 font-semibold hover:bg-gray-200 transition"
//           >
//             Go to Users Page
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
