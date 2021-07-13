import React, { useState, useEffect } from 'react';
import tw from "twin.macro";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { MdRefresh, MdAdd } from "react-icons/md";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setAuthHeaders } from 'services/auth.service';
import { getEmployerDashboard, createJob } from "services/api.service";
import { useUserContext } from 'pages/UserContext';
import { Dialog } from "evergreen-ui";
import { Loader } from 'components';

const Container = tw.div`w-full h-full pb-24 text-gray-800 bg-primary-lightest`;
const Header = tw.div`mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between mb-10 md:relative p-8 `;
const Heading = tw.h1`text-2xl font-bold text-primary`;
const Input = tw.input`border border-primary w-full my-2 p-1.5 px-8 rounded-md bg-opacity-90 hocus:outline-none focus:ring-primary focus:border-primary`;
const JobContainer = tw.div`w-11/12 shadow-lg rounded bg-white mx-auto p-8`
const JobLi = tw(Link)` block w-full md:w-5/12  mb-12  p-14 border  text-center   rounded-md mt-2`;
const ButtonNewJobs = tw.button`inline-flex mx-2 bg-primary items-center justify-center text-white border border-primary text-center text-sm p-2 hover:bg-transparent hover:text-primary hover:border hover:border-primary`;
const ButtonRefresh = tw.button`inline-flex mx-2 bg-transparent items-center justify-center text-primary border border-primary text-center text-sm p-2 hover:bg-primary hover:text-white `;
const Label = tw.label`block text-sm`;
const TextArea = tw.textarea`w-full rounded mt-2 mb-2 hocus:outline-none focus:ring-green-600 focus:border-green-600`;
const ErrorMessage = tw.p`text-sm text-red-500 mb-2`;
const SubmitButton = tw.button`block w-full md:w-2/3 mx-auto p-2 bg-green-600 text-center font-bold text-white rounded-md mt-2`;


const JobSchema = yup.object().shape({
    company_number: yup.string().required('Company Number is required'),
    company_name: yup.string().required('Company Name is required'),
    company_email: yup.string().email("Please enter a valid email address").required('Email is required'),
    company_website: yup.string().required('Website address is required'),
    country: yup.string().required('Country is required'),
    state: yup.string().required(),
    city: yup.string().required('City is Required'),
    title: yup.string().required('Title is Required'),
    description: yup.string().required('Please provide a job description'),
    experience_level: yup.string(),
});


const EmployerDashboard = () => {

    const { state, dispatch } = useUserContext();
    const { userData, notifications } = state;
    const { total_jobs_posted, active_jobs, expired_jobs } = notifications;
    const [loading, setLoading] = useState(false);
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        if (!state.notifications) {
            setAuthHeaders(state);
            getEmployerDashboard()
                .then(response => {
                    dispatch({ type: "SETNOTIFICATIONS", payload: response.data })
                    console.log(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        toast.error("An error occured, could not get jobs")
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        toast.error("An error occured, could not get jobs")
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        toast.error("An error occured, could not get jobs")
                    }
                    setLoading(false);
                });
        }
    }, [state, dispatch]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(JobSchema)
    });

    const handleCreateJob = (data) => {
        setLoading(true)
        setAuthHeaders(state)
        createJob(data)
            .then(response => {
                toast.success("Job posted succesfully");
                setIsShown(false)
                setLoading(false);
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    toast.error("An error occurred Please check your network and try again");

                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http16000.ClientRequest in node.js
                    toast.error("An error occurred Please check your network and try again");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error("An error occurred Please check your network and try again");
                }
                setLoading(false);

            });
    }

    const handleRefresh = () => {
        setLoading(true);
        setAuthHeaders(state);
        getEmployerDashboard()
            .then(response => {
                dispatch({ type: "SETNOTIFICATIONS", payload: response.data })
                setLoading(false);
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    toast.error("An error occured, could not get jobs")
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    toast.error("An error occured, could not get jobs")
                } else {
                    // Something happened in setting up the request that triggered an Error
                    toast.error("An error occured, could not get jobs")
                }
                setLoading(false);
            });
    }

    if (loading) return <Loader />

    return (
        <Container>
            <Header>
                <div tw='text-center md:text-left'>
                    <Heading>Employer Dashboard</Heading>
                    <p tw='mt-2 text-sm inline-block'>Manage all jobs and applications</p>
                </div>

                <div tw=''>
                    <ButtonNewJobs onClick={() => setIsShown(true)}> <MdAdd size={24} /> Post new jobs</ButtonNewJobs>
                    <ButtonRefresh onClick={() => handleRefresh()}> <MdRefresh size={24} /> Refresh</ButtonRefresh>
                </div>
            </Header>

            <JobContainer tw='font-bold text-base md:text-2xl font-semibold'>
                <div tw='text-center text-gray-400 '>
                    <h2 >Total Jobs Posted {total_jobs_posted?.length || "N/A"}</h2>
                </div>

                <div tw='mt-14 '>
                    <div tw='md:flex block  mx-auto place-content-evenly '>
                        <JobLi to='/employer/activejobs' tw='border-green-800 text-green-800 hover:bg-primary hover:text-white'>
                            <p tw='text-base md:text-2xl mb-2 '> Active Job Posts</p>
                            <p>{active_jobs?.length || "N/A"}</p>

                        </JobLi>
                        <JobLi to='/employer/expiredjobs' tw='border-red-800 text-red-800 hover:bg-red-600 hover:text-white'>
                            <p tw=' mb-2 text-base md:text-2xl'> Expired Job Posts</p>
                            <p>{expired_jobs?.length || "N/A"}</p>
                        </JobLi>

                    </div>
                    <div tw='md:flex block mx-auto place-content-evenly'>
                        <JobLi to='/employer/pendingjobs' tw='border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white'>
                            <p tw='text-base md:text-2xl mb-2'> Pending Applications</p>
                        </JobLi>
                        <JobLi to='/employer/acceptedjobs' tw='border-green-400 text-primary hover:bg-green-400 hover:text-white' >
                            <p tw=' mb-2 text-base md:text-2xl'> Accepted Applications</p>
                        </JobLi>

                    </div>
                </div>

            </JobContainer>


            <Dialog
                isShown={isShown}
                hasFooter={false}
                onCloseComplete={() => setIsShown(false)}
            >
                <>
                    <header tw="w-full flex justify-center items-center my-4">
                        <FiEdit3 size={36} tw="mr-4 text-green-600" />
                        <h1 tw="text-2xl  font-bold ">Post New Job</h1>
                    </header>
                    <form
                        tw="w-full mx-auto mb-12"
                        onSubmit={handleSubmit(handleCreateJob)}
                    >
                        <div tw="p-4 sm:p-8 mb-8 bg-white">
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                placeholder="Company"
                                defaultValue={userData?.company_name}
                                {...register("company_name")}
                            />
                            {errors.company_name && <ErrorMessage>{errors.company_name.message}</ErrorMessage>}

                            <Label>Company Identification Number</Label>
                            <Input
                                type="number"
                                placeholder="123456"
                                defaultValue={userData?.company_number}
                                {...register("company_number")}
                            />
                            {errors.company_number && <ErrorMessage>{errors.company_number.message}</ErrorMessage>}

                            <Label>Company Email</Label>
                            <Input
                                type="email"
                                placeholder="email@company.com"
                                {...register("company_email")}
                            />
                            {errors.company_email && <ErrorMessage>{errors.company_email.message}</ErrorMessage>}


                            <Label>Website Link</Label>
                            <Input
                                type="text"
                                placeholder="https://company.com"
                                {...register("company_website")}
                            />
                            {errors.company_website && <ErrorMessage>{errors.company_website.message}</ErrorMessage>}

                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                placeholder="job title"
                                {...register("title")}
                            />
                            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}

                            <Label>Description</Label>
                            <TextArea
                                rows="3"
                                {...register("description")}>
                            </TextArea>
                            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}

                            <Label>Country</Label>
                            <Input
                                type="text"
                                placeholder="Country"
                                {...register("country")}
                            />
                            {errors.country && <ErrorMessage>{errors.country.message}</ErrorMessage>}

                            <Label>State</Label>
                            <Input
                                type="text"
                                placeholder="State"
                                {...register("state")}
                            />
                            {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}

                            <Label>City</Label>
                            <Input
                                type="text"
                                placeholder="City"
                                {...register("city")}
                            />
                            {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}

                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                placeholder="2 years"
                                {...register("experience_level")}
                            />
                            {errors.experience_level && <ErrorMessage>{errors.experience_level.message}</ErrorMessage>}

                            <Label>Expected Salary</Label>
                            <Input
                                type="number"
                                placeholder="250000"
                            />
                            {errors.expected_salary && <ErrorMessage>{errors.expected_salary.message}</ErrorMessage>}
                        </div>

                        <SubmitButton type="submit"> Post Job</SubmitButton>
                    </form>
                </>
            </Dialog>

        </Container>

    )
}

export default EmployerDashboard