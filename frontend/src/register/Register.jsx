import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase"; // Adjust the path as necessary
import { createUserWithEmailAndPassword } from "firebase/auth"; // Corrected import

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({});

    const handleInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        });
    };

    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev, gender: selectGender === inputData.gender ? '' : selectGender
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (inputData.password !== inputData.confpassword) {
            setLoading(false);
            return toast.error("Passwords don't match");
        }
        try {
            // Use Firebase to create a new user
            const userCredential = await createUserWithEmailAndPassword(auth, inputData.email, inputData.password);
            const user = userCredential.user;

            // Optionally, you can store additional user data in your database here

            toast.success("Registration successful!");
            localStorage.setItem('friendsapp', JSON.stringify({ uid: user.uid, email: user.email }));
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        }
    };

    return (
      <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
        <div
          className="w-full p-6 rounded-lg shadow-lg
          bg-gray-400  bg-clip-padding backdrop-filter 
          backdrop-blur-lg bg-opacity-0 "
        >
          <h1 className="text-3xl font-bold text-center text-gray-300 ">
            Register <span className="text-gray-950"> FriendsChat </span>
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col text-black">
            <div>
              <label className="label p-2">
                <span className="font-bold text-black-950 text-xl label-text">
                  Fullname :
                </span>
              </label>
              <input
                id="fullname"
                type="text"
                onChange={handleInput}
                placeholder="Enter Fullname "
                required
                className="w-full input input-bordered h-10"
              />
            </div>
  
            <div>
              <label className="label p-2">
                <span className="font-bold text-black-950 text-xl label-text">
                  Username :
                </span>
              </label>
              <input
                id="username"
                type="text"
                onChange={handleInput}
                placeholder="Enter Username"
                required
                className="w-full input input-bordered h-10"
              />
            </div>
  
            <div>
              <label className="label p-2">
                <span className="font-bold text-black-950 text-xl label-text">
                  Email :
                </span>
              </label>
              <input
                id="email"
                type="email"
                onChange={handleInput}
                placeholder="Enter email "
                required
                className="w-full input input-bordered h-10"
              />
            </div>
            <div>
              <label className="label p-2">
                <span className="font-bold text-black-950 text-xl label-text">
                  Password :
                </span>
              </label>
              <input
                id="password"
                type="password"
                onChange={handleInput}
                placeholder="Enter password "
                required
                className="w-full input input-bordered h-10"
              />
            </div>
  
            <div>
              <label className="label p-2">
                <span className="font-bold text-black-950 text-xl label-text">
                  Confirm Password :
                </span>
              </label>
              <input
                id="confpassword"
                type="text"
                onChange={handleInput}
                placeholder="Confirm password "
                required
                className="w-full input input-bordered h-10"
              />
            </div>
  
              <div id="gender" className="flex gap-2">
                  <label className="cursor-pointer label flex gap-2">
                      <span className="label-text font-semibold text-gray-950">Male</span>
                      <input 
                      onChange={()=>selectGender('male')} 
                      checked={inputData.gender === 'male'}
                      type="checkbox" className="checkbox checkbox-info" />
                  </label>
                  <label className="cursor-pointer label flex gap-2">
                      <span className="label-text font-semibold text-gray-950">Female</span>
                      <input onChange={()=>selectGender('female')} checked={inputData.gender === 'female'} type="checkbox" className="checkbox checkbox-info" />
                  </label>
              </div>
  
            <button
              type="submit"
              className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg hover:bg-gray-900 text-white rounded-lg hover: scale-105"
            >
              {loading ? "loading.." : "Register"}
            </button>
          </form>
          <div className="pt-2">
            <p className="text-sm font-semibold  text-gray-800">
              Do you have an Account ?
              <Link to={"/login"}>
                <span
                  className="text-gray-950 font-bold underline 
                  cursor-pointer hover:text-green-950"
                >
                  Login Now!!
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;
  