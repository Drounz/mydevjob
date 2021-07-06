import React, { useState } from "react";
import tw from "twin.macro";
import toast from "react-hot-toast";
import Loader from "components/Loader";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser, setAuthHeaders } from "services/auth.service";

const Label = tw.label`block text-sm mt-2`;
const Input = tw.input`border border-green-600 w-full mt-2 mb-2 p-2 px-4 placeholder-gray-400 text-sm rounded bg-opacity-90 hocus:outline-none focus:ring-green-600 focus:border-green-600`;
const ErrorMessage = tw.p`text-sm text-red-500 mb-2`;

const SignupSchema = yup.object().shape({
    username: yup.string().required('UserName is required'),
    email: yup.string().email().required('Email is required'),
    password1: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    password2: yup.string().min(8, 'Password must be at least 8 characters').required('Confirm Password is required')
        .oneOf([yup.ref('password1'), null], 'Password does not match'),
});


const SignUpPage = () => {
    const [stage, setStage] = useState(1);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(SignupSchema)
    });

    const handleSignUp = (data) => {

        setLoading(true);

        registerUser(data)
            .then(response => {
                toast.success("Registration Successful");
                setAuthHeaders(response.data);
                setLoading(false);
                setStage(2);
                toast.success("A confirmation Email has been sent to your email address");
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 400) {
                        if (error.response.data.username) {
                            toast.error(error.response.data.username[0]);
                        }
                        else if (error.response.data.password1) {
                            toast.error(error.response.data.password1[0]);
                        }
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    toast.error("An error occurred Please check your network and try again");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error("An error occurred Please check your network and try again");
                }
                setLoading(false);
            });
    }

    if (loading) return <Loader />


    if (stage === 2) {
        return (
            <section tw="text-secondary md:py-24 h-screen">
                <div tw="mx-auto py-12 md:w-2/3 my-24  bg-white md:shadow-lg md:rounded-xl">
                    <header tw="text-center mb-4 p-8">
                        <h1 tw="text-3xl text-green-600 mb-4 font-bold">Registration Completed</h1>
                        <p tw="text-base font-medium">welcome to a faster way of applying for jobs with just two clicks</p>
                    </header>
                    <Link to="/login" tw="block w-2/3 sm:w-1/3 mx-auto p-2 bg-green-600  text-center font-bold text-white rounded-md">Finish</Link>
                </div>
            </section>
        )
    }

    return (
        <section tw="text-secondary md:p-24">
            <div tw="mx-auto py-12 lg:mx-24 bg-white md:shadow-lg md:rounded-xl">
                <header tw="text-center mb-8 p-4">
                    <h1 tw="text-5xl font-bold text-green-600 mb-2">DevJobs</h1>
                    <p tw="text-base">&lt; Ctrl + F Developer Jobs Faster / &gt;</p>
                </header>
                <div tw="flex flex-col md:flex-row">
                    <div tw="w-full md:w-1/2 p-4 text-center">
                        <p tw="mb-8 text-lg font-bold">Sign Up With</p>
                        <button tw="p-2 rounded-md text-xl bg-gray-200 mb-5 w-5/6 md:w-2/3 mx-auto text-center">Google</button>
                        <button tw="p-2 rounded-md text-xl bg-blue-800 w-5/6 md:w-2/3 mx-auto text-white">facebook</button>
                        <p tw="text-green-600 my-4 text-sm">Terms & Privacy | cookie policy</p>
                    </div>
                    <div tw="w-full md:w-1/2 p-4">
                        <form tw="w-5/6 md:w-2/3 mx-auto" onSubmit={handleSubmit(handleSignUp)}>
                            <Label>User Name</Label>
                            <Input
                                type="text"
                                placeholder="johndoe"
                                {...register("username")}
                            />
                            {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}

                            <Label>Email</Label>
                            <Input type="email"
                                placeholder="email@example.com"
                                {...register("email")}
                            />
                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

                            <Label>Password</Label>
                            <Input
                                type="password"
                                name="password1"
                                {...register("password1")}
                            />
                            {errors.password1 && <ErrorMessage>{errors.password1.message}</ErrorMessage>}

                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                name="password2"
                                {...register("password2")}
                            />
                            {errors.password2 && <ErrorMessage>{errors.password2.message}</ErrorMessage>}

                            <button type="submit" tw="w-full p-2 mt-4 bg-green-600 text-center font-bold text-white rounded-md">Sign Up</button>
                            <p tw="text-center my-4 mx-auto block">Already have an account <Link to="/login" tw="text-green-600 font-bold">Log In</Link></p>

                        </form>

                    </div>
                </div>
            </div>
        </section>
    )

}

export default SignUpPage;