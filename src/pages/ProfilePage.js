import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiEdit3, FiUser } from "react-icons/fi";
import tw from "twin.macro";
import toast from "react-hot-toast";
import ProfileImage from "images/profile.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUserContext } from "pages/UserContext";
import { setAuthHeaders, updateUserProfile } from 'services/auth.service';
import { Dialog } from "evergreen-ui";
import { Loader } from "components";

const Label = tw.label`block text-sm`;
const Input = tw.input`border border-gray-600 w-full mt-2 mb-4 p-2 px-4 placeholder-gray-400 text-sm rounded bg-opacity-90 hocus:outline-none focus:ring-green-600 focus:border-green-600`;
const TextArea = tw.textarea`w-full rounded mt-2 mb-2 hocus:outline-none focus:ring-green-600 focus:border-green-600`;
const ErrorMessage = tw.p`text-sm text-red-500 mb-2`;
const SubmitButton = tw.button`block w-full md:w-2/3 mx-auto p-2 bg-green-600 text-center font-bold text-white rounded-md mt-2`;

const ProfileSchema = yup.object().shape({
    first_name: yup.string().required('First Name is required'),
    email: yup.string().email("Please enter a valid email address").required('Email is required'),
    country: yup.string().required('Country is required'),
    state: yup.string().required("State is required"),
    city: yup.string().required('City is Required'),
    about: yup.string().required('Please provide a description of yourself'),
    experience_level: yup.string().required("Please provide your experience level"),
    salary: yup.number().positive("Please enter a valid amount")
});

const ProfilePage = () => {

    const { getBasicUserProfile, state } = useUserContext();
    const { basicUserData, fullUserData } = state;
    const [upload, setUpload] = useState("");
    const [isShown, setIsShown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!basicUserData.pk) {
            getBasicUserProfile();
        }
    }, [basicUserData, getBasicUserProfile]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(ProfileSchema)
    });

    const handleProfileUpdate = (data) => {
        setLoading(true)
        setAuthHeaders(state)
        updateUserProfile(data)
            .then(response => {
                toast.success("Job posted succesfully");
                setIsShown(false);
                console.log(response.data)
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


    if (loading) return <Loader />;

    return (
        <div className="p-8 md:p-20 text-secondary">
            <div className="flex flex-col md:flex-row md:justify-between mb-12">
                <h1 className="text-primary text-3xl font-bold ">Profile</h1>
                <button
                    onClick={() => setIsShown(true)}
                    className="px-6 py-2 border border-warning text-warning inline-flex justify-center items-center hover:bg-warning-light rounded-md">
                    <FiEdit3 size={18} /> &nbsp; Edit Profile
                </button>
            </div>
            <hr className="border border-gray-300 mb-12" />

            <div className="flex flex-col md:flex-row">
                <img
                    src={fullUserData?.picture || ProfileImage}
                    alt="profile"
                    height={150}
                    width={150}
                />
                <div>
                    <p className="md:ml-8 mb-4"><span className="font-medium">User Name : </span>{fullUserData?.user || basicUserData?.username || "N/A"}</p>
                    <p className="md:ml-8 mb-4"><span className="font-medium">First Name : </span>{fullUserData?.first_name || basicUserData?.first_name || "N/A"}</p>
                    <p className="md:ml-8 mb-4"><span className="font-medium">Last Name : </span>{fullUserData?.last_name || basicUserData?.last_name || "N/A"}</p>
                    <p className="md:ml-8 mb-4"><span className="font-medium">email : </span>{fullUserData?.email || basicUserData?.email || "N/A"}</p>
                </div>
            </div>

            <hr className="border border-gray-300 my-12" />
            <div className="flex flex-col">

                <h2 className="text-2xl font-bold mb-2">About Me</h2>
                <p className="text-base">
                    {fullUserData?.about || "N/A"}
                </p>
            </div>

            <hr className="border border-gray-300 my-12" />


            <div className="flex flex-col md:flex-row md:justify-between mb-12">
                <div className="mb-4 md:mb-0">
                    <h4 className="text-xl font-semibold mb-2">Contact Information</h4>
                    <p className="mb-4"><span className="font-medium">Email : </span> {fullUserData?.email || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">Github : </span>{fullUserData?.github || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">LinkedIn : </span>{fullUserData?.linkedin_profile || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">Twitter : </span>{fullUserData?.twitter || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">Instagram : </span>{fullUserData?.instagram || "N/A"}</p>
                </div>

                <div className="mb-4 md:mb-0">
                    <h4 className="text-xl font-semibold mb-2">Stack/Role Information</h4>
                    <p className="mb-4"><span className="font-medium">Stack, Dev Role : </span>{fullUserData?.stack_dev_role || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">Experience Level : </span>{fullUserData?.experience_level || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">Salary/Pay Range : </span>{fullUserData?.salary || "N/A"}</p>
                </div>

                <div className="mb-4 md:mb-0">
                    <h4 className="text-xl font-semibold mb-2">Location Information</h4>
                    <p className="mb-4"><span className="font-medium">Country </span>{fullUserData?.country || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">State </span>{fullUserData?.state || "N/A"}</p>
                    <p className="mb-4"><span className="font-medium">City </span>{fullUserData?.city || "N/A"}</p>
                </div>
            </div>


            <form className="bg-green-100  my-8 text-center p-4 sm:p-8">
                <p className="block text-lg text-center my-3 font-medium">Cv/Resume</p>
                <p className="text-secondary-lightest text-sm my-6 text-center mx-auto">{upload || "Name of uploaded file"}</p>
                <div className="my-4">
                    <label htmlFor="cv-upload" className="cursor-pointer inline-flex justify-center items-center px-12 py-2 bg-white font-medium text-primary rounded mx-4">

                        Upload &nbsp; <FiUploadCloud size={20} />
                        <input type='file' id="cv-upload" hidden
                            onChange={(evt) => setUpload(evt.target.value)} />
                    </label>

                    <a className={`${fullUserData?.CV ? 'text-primary border-primary' : 'text-secondary-lightest border-secondary-lightest'} border inline-flex justify-center cursor:pointer items-center px-12 py-2 text-center font-medium rounded mx-4`}
                        href={fullUserData?.CV} download={fullUserData?.CV}
                    >
                        Download
                    </a>
                </div>
            </form>

            <Dialog
                isShown={isShown}
                hasFooter={false}
                onCloseComplete={() => setIsShown(false)}
            >
                <>
                    <header tw="w-full flex justify-center items-center my-4">
                        <FiUser size={24} tw="mr-4 text-green-600" />
                        <h1 tw="text-2xl  font-bold ">Update Profile</h1>
                    </header>
                    <form
                        tw="w-full mx-auto mb-12"
                        onSubmit={handleSubmit(handleProfileUpdate)}
                    >
                        <div tw="p-4 sm:p-8 mb-8 bg-white">
                            <Label>First Name</Label>
                            <Input
                                type="text"
                                placeholder="John Doe"
                                defaultValue={fullUserData?.first_name}
                                {...register("first_name")}
                            />
                            {errors.first_name && <ErrorMessage>{errors.first_name.message}</ErrorMessage>}

                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="email@company.com"
                                defaultValue={fullUserData?.email}
                                {...register("email")}
                            />
                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

                            <Label>About</Label>
                            <TextArea
                                rows="3"
                                defaultValue={fullUserData?.about}
                                {...register("about")}>
                            </TextArea>
                            {errors.about && <ErrorMessage>{errors.about.message}</ErrorMessage>}

                            <Label>Country</Label>
                            <Input
                                type="text"
                                placeholder="Country"
                                defaultValue={fullUserData?.country}
                                {...register("country")}
                            />
                            {errors.country && <ErrorMessage>{errors.country.message}</ErrorMessage>}

                            <Label>State</Label>
                            <Input
                                type="text"
                                placeholder="State"
                                defaultValue={fullUserData?.state}

                                {...register("state")}
                            />
                            {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}

                            <Label>City</Label>
                            <Input
                                type="text"
                                placeholder="City"
                                defaultValue={fullUserData?.city}
                                {...register("city")}
                            />
                            {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}

                            <Label>Experience Level</Label>
                            <Input
                                type="text"
                                placeholder="2 years"
                                defaultValue={fullUserData?.experience_level}

                                {...register("experience_level")}
                            />
                            {errors.experience_level && <ErrorMessage>{errors.experience_level.message}</ErrorMessage>}

                            <Label>Salary</Label>
                            <Input
                                type="number"
                                placeholder="2500000"
                                defaultValue={fullUserData?.salary}
                                {...register("salary")}
                            />
                            {errors.salary && <ErrorMessage>{errors.salary.message}</ErrorMessage>}
                        </div>


                        <SubmitButton type="submit">Update</SubmitButton>
                    </form>
                </>
            </Dialog>

        </div>
    )
}

export default ProfilePage;