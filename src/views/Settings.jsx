import React, { useEffect, useState } from 'react';
import Navigation from './Nav';
import { Link } from "react-router-dom";
import { CogIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import { supabase } from '../supabaseClient';
import Loading from './Loading';
import Layout from './Layout';

function Settings(props) {

    const [user, setUser] = useState({});
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);

    async function updateUser(e) {
        e.preventDefault()
        
        const { error } = await supabase.from('Users').update(
            { first_name: user.first_name, last_name: user.last_name, settings: user.settings }
        ).eq('id', user.id)
        if (error) console.log("updateUserError", error);
        else console.log("Update Succesful");
    }

    async function getUserById(id) {
        const { data, error } = await supabase
            .from("Users")
            .select()
            .eq('id', id)
        if (error) {
            console.log("getUserByIdError", error);
        } else {
            console.log("getUserById", data);
            setUser(data[0]);
            setLoading(false);
        }
    }

    async function getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            console.log("getSessionError", error);
            window.location.href = `/`
        }
        else {
            if (data.session) {
                getUserById(data.session.user.id)
                setUserEmail(data.session.user.email)
            } else {
                window.location.href = `/`
            }

            setLoading(false);
        }
    }

    async function signOut() {
        console.log("signOut")
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.log("signOutError", error);
        }
        else {
            console.log("signOut");
            window.location.href = `/`
        }
    }


    useEffect(() => {
        getSession();
    }, []);

    return (
        <Layout>
            <Navigation
                title="Settings"
                leftItem={
                    <Link to="/home">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                }
                rightItem={
                    <button type="button" onClick={e => console.log()}>
                        <CogIcon className="h-6 w-6" />
                    </button>
                }
            />
            <div className='flex flex-col gap-4 items-start relative'>
                <form onSubmit={e => updateUser(e)} className='flex flex-col gap-4 relative w-full'>

                    <div className='flex justify-between items-start'>
                        <h2 className='text-2xl font-bold'>Settings</h2>
                        <button type='submit' className='bg-yellow-500 text-white rounded-lg py-2 px-4'>Save changes</button>
                    </div>
                    <div className='flex flex-col gap-2 flex-grow'>
                        <label htmlFor='last_name'>Email</label>
                        <input disabled className="p-2 bg-black  bg-opacity-5 border rounded-md" type='text' id='email' name='email' placeholder='Email' value={userEmail} />
                    </div>
                    <div className='flex gap-4 flex-grow'>
                        <div className='flex flex-col gap-2 flex-grow'>
                            <label htmlFor='first_name'>First name</label>
                            <input className="p-2 bg-transparent border rounded-md" type='text' id='first_name' name='first_name' placeholder='First name' value={user.first_name} onChange={
                                e => setUser({
                                    ...user,
                                    first_name: e.target.value
                                })
                            } />
                        </div>
                        <div className='flex flex-col gap-2 flex-grow'>
                            <label htmlFor='last_name'>Last name</label>
                            <input className="p-2 bg-transparent border rounded-md" type='text' id='last_name' name='last_name' placeholder='Last name' value={user.last_name} onChange={
                                e => setUser({
                                    ...user,
                                    last_name: e.target.value
                                })
                            } />
                        </div>
                    </div>
                </form>
                <span className="w-full p-[0.25px] mt-4 bg-slate-200 "></span>
                <button type='button' onClick={e => signOut(e)} className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent roundedbg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent roundedbg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'>
                    Logout
                </button>

            </div>
        </Layout>
    );
}

export default Settings;