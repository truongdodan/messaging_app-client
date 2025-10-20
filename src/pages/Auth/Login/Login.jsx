import "../Auth.css";
import Button from "../../../components/Button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../../service/axios";
import useAuth from "../../../hook/useAuth";
import toast from "react-hot-toast";

const hoa = "dodantruong69@gmail.com";
const truongreal = "dodantruong333@gmail.com";
const gigachad = "deepbreathandtakeitslow999@gmail.com";
const truongfake = "dodantruong04@gmail.com";
const guessUser = "guessuser@gmail.com";
const guessUserPwd = "Password@123";

const Login = () => {
  const { setAuth } = useAuth();
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/chats";

  const handleChange = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });

    // reset error
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const loginUser = await axiosInstance.post("/login", account);
      await setAuth({
        accessToken: loginUser.data.accessToken,
        user: loginUser.data.user,
      });

      toast.success("Login successfully");
      navigate(from, { replace: true });
    } catch (error) {
      const errorData = error.response?.data?.error;

      // Check if validation errors exist
      if (errorData?.details && Array.isArray(errorData.details)) {
        // Show first validation error
        const firstError = errorData.details[0];
        setError(firstError.msg || errorData.msg);
      } else {
        // Show generic error message
        console.error("Login failed: ", error);
        setError(errorData?.msg || toast.error("Login failed! Try again"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <img src="background.jpg" alt="Cozyz's background" className="bg-img" />
      <div className="auth">
        <div className="auth__logo">Cozyz</div>
        <div className="auth__title">Log in</div>
        <form className="auth__form form--login" onSubmit={handleSubmit}>
          <div className="auth__input">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input"
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="auth__input">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input"
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="auth__navigate">
            Don't have an account? <Link to={"/register"}>Sign up</Link>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="auth__buttons">
            <Button
              text={"Login as Guess"}
              className={"navigate-btn"}
              onClick={() => {
                setAccount({
                  email: "guessuser@gmail.com",
                  password: "Strongp@ssword123",
                });
              }}
            />
            <Button text={"Submit"} loading={isLoading} />
          </div>
        </form>
      </div>
      <div className="img-wrapper">
        <img src="logo.png" alt="Cozyz's logo" />
      </div>
    </div>
  );
};

export default Login;
