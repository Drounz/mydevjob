import React, { useEffect, useState } from 'react';
import tw from "twin.macro";
import { getJobs } from "services/api.service";
import "pages/style.css";

const Button = tw.button`p-4 bg-green-600 rounded-lg font-bold text-white mt-5 hover:bg-gray-600`;

const LandingPage = () => {

    const [jobs, setJobs] = useState({})
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getJobs()
            .then(response => {
                setJobs(response.data);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    window.alert("An error occured, could not get jobs")
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    window.alert("An error occured, could not get jobs")
                } else {
                    // Something happened in setting up the request that triggered an Error
                    window.alert("An error occured, could not get jobs")
                }
                setLoading(false);
            });
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        getJobs()
            .then(response => {
                setJobs(response.data);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    window.alert("An error occured, could not get jobs")
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    window.alert("An error occured, could not get jobs")
                } else {
                    // Something happened in setting up the request that triggered an Error
                    window.alert("An error occured, could not get jobs")
                }
                setLoading(false);
            });
    }

    return (
        <div className="App">
            <h1>Fetched Jobs</h1>
            <Button onClick={() => handleRefresh()}>refresh jobs</Button>

            {loading ? (
                <p>Loading please wait</p>
            ) : (
                <>
                    {jobs.length && (
                        jobs?.map(job => {
                            return (
                                <div
                                    className="job"
                                    key={job.pk}
                                >
                                    <p key="1">pk: {job.pk}</p>
                                    <p key="2">Company ID: {job.company_id}</p>
                                    <p key="3">Title: {job.title}</p>
                                    <p key="4">Company Name: {job.company_name}</p>
                                    <p key="5">Duration: {job.duration}</p>
                                    <p key="6">experience_level": {job.experience_level}</p>
                                    <p key="7">expected_salary": {job.expected_salary}</p>
                                    <p key="8">Users Applied": {job.users_applied}</p>
                                    <p key="9">Created Date": {job.created_date}</p>
                                    <a key="10" href={job.url}>learn more about this job</a>
                                </div>
                            )
                        }))}
                </>
            )}


            <div className="bg-gray-900 p-20 h-screen flex justify-center items-start flex-col">
                <h1 className="text-5xl text-white">Hello Tailwind 👋</h1>
                <p className="text-gray-400 mt-5 text-lg">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                    consequuntur odio aut nobis ab quis? Reiciendis doloremque ut quo fugiat
                    eveniet tempora, atque alias earum ullam inventore itaque sapiente iste?
                </p>
                <button class="p-4 bg-green-600 rounded-lg font-bold text-white mt-5 hover:bg-gray-600">
                    Hello Friends 🚀
                </button>
            </div>
        </div>
    )
}

export default LandingPage;