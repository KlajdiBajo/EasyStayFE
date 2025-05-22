import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const CHANGE_PASSWORD_URL = "/user/changePassw";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuth();
  const { role } = auth;

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(newPassword));
    setValidMatch(newPassword === matchPwd);
  }, [newPassword, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validPwd || !validMatch) {
      toast.error("Invalid password format or mismatch.");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.patch(
        CHANGE_PASSWORD_URL,
        JSON.stringify({ newPassword }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Password changed successfully!");

      setTimeout(() => {
        if (role === "USER") {
          navigate("/");
        } else if (role === "MANAGER") {
          localStorage.setItem("showHotelRegistration", "true");
          navigate("/hotelManager");
        }
      }, 2000);
    } catch (err) {
      toast.error("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-light-gray px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-charcoal-gray text-center mb-4 font-lora">
          Change Your Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 font-roboto">
          <div>
            <label
              htmlFor="newPassword"
              className="block font-medium text-charcoal-gray font-roboto"
            >
              New Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "ml-2 text-green-500" : "hidden"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  !validPwd && newPassword ? "ml-2 text-red-500" : "hidden"
                }
              />
            </label>
            <input
              type="password"
              id="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              autoComplete="off"
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
            />
            <p
              id="pwdnote"
              className={
                pwdFocus && !validPwd
                  ? "text-sm text-charcoal-gray mt-1 font-roboto"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />8 to 24
              characters. Must include uppercase and lowercase letters, a number
              and a special character (!@#$%).
            </p>
          </div>

          <div>
            <label
              htmlFor="repeatPassword"
              className="block font-medium text-charcoal-gray font-roboto"
            >
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={
                  validMatch && matchPwd ? "ml-2 text-green-500" : "hidden"
                }
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  !validMatch && matchPwd ? "ml-2 text-red-500" : "hidden"
                }
              />
            </label>
            <input
              type="password"
              id="repeatPassword"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              autoComplete="off"
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              className="mt-1 block w-full px-4 py-2 bg-light-gray border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal font-roboto"
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch
                  ? "text-sm text-charcoal-gray mt-1 font-roboto"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              Must match the first password field.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !validPwd || !validMatch}
            className="w-full bg-teal text-white py-2 px-4 rounded-2xl font-montserrat font-bold hover:bg-teal-dark transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? "Submitting..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
