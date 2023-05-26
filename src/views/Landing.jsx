import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import heroImage from '../assets/hero-journaling.svg';

export function SignInOrUp (props) {

    const [showSignUp, setShowSignUp] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');

    const signIn = async (e) => {
        e.preventDefault()

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            window.alert(error.message);
            console.log("signInError", error)
        } else {
            console.log("Sign In Succesful");
            window.location.href = `/home`
        }
    }

    const createUserFromSession = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (data) {
            const { error } = await supabase
                .from('Users')
                .insert(
                    { id: data.session.user.id, first_name: first, last_name: last, settings: { theme: 'light' } }
                )
            if (error) console.log("createUserError", error);
            else console.log("User Created Succesful");
        } else {
            console.log("createUserFromSessionError", error)
        }
    }

    const signUp = async (e) => {
        e.preventDefault()

        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            window.alert(error.message);
            console.log("signUpError", error)
        } else {
            console.log("Sign Up Succesful");
            createUserFromSession();
            window.location.href = `/home`
        }
    }

    return (
        <section className='grid grid-cols-2 min-h-screen'>
            <div className='bg-orange-600 text-white hidden md:flex flex-col justify-center  p-12 gap-8'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-5xl font-bold'>
                        <span className='italic'>poz-journal</span>
                    </h1>
                    <h2 className='text-lg'>
                        A simple journaling app built with React and Supabase.
                    </h2>
                    <img src={heroImage} className='w-5/6' />
                </div>
            </div>
        <div className='flex flex-col justify-center gap-4 bg-white p-12 col-span-2 md:col-span-1'>

            <h1 className='text-5xl font-bold mb-4 block md:hidden'>
                <span className='italic'>poz-journal</span>
            </h1>
            {
                showSignUp ?
                <form onSubmit={e => signUp(e)} className="">
                    <div className='flex flex-col gap-4 relative'>
                        <h2 className='text-2xl font-bold'>Sign Up</h2>
                        <div className='flex gap-4 flex-grow'>
                            <div className='flex flex-col gap-2 flex-grow'>
                                
                                <label htmlFor='first_name'>First name</label>
                                <input className="p-2 bg-transparent border rounded-md" type='text' id='first_name' name='first_name' placeholder='First name' value={first} onChange={e => setFirst(e.target.value)} />
                            </div>
                            <div className='flex flex-col gap-2 flex-grow'>
                                <label htmlFor='last_name'>Last name</label>
                                <input className="p-2 bg-transparent border rounded-md" type='text' id='last_name' name='last_name' placeholder='Last name' value={last} onChange={e => setLast(e.target.value)} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='email'>Email</label>
                            <input className="p-2 bg-transparent border rounded-md" type='email' id='email' name='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='password'>Password</label>
                            <input className="p-2 bg-transparent border rounded-md" type='password' id='password' name='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='password-confirm'>Confirm Password</label>
                            <input className="p-2 bg-transparent border rounded-md" type='password' id='password-confirm' name='password-confirm' placeholder='Confirm Password'  onChange={
                                e => {
                                    if (e.target.value !== password) console.log("Passwords do not match")
                                }
                        } />
                        </div>
                        <div className='flex flex-col mt-2'>
                            <button type='submit' className='bg-yellow-500 text-white rounded-lg py-2 px-4'>Sign Up</button>
                        </div>
                        <div>
                            <span>Already have an account? </span>
                            <button type='button' className='text-yellow-700' onClick={e => setShowSignUp(false)}>Sign In</button>
                        </div>
                    </div>
                </form>
                :
                <form onSubmit={e => signIn(e)} className="">
                    <div className='flex flex-col gap-4 relative'>
                        <h2 className='text-2xl font-bold'>Welcome back</h2>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='email'>Email</label>
                            <input className="p-2 bg-transparent border rounded-md" type='email' id='email' name='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor='password'>Password</label>
                            <input className="p-2 bg-transparent border rounded-md" type='password' id='password' name='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className='flex flex-col mt-2'>
                            <button type='submit' className='bg-yellow-500 text-white rounded-lg py-2 px-4'>Sign In</button>
                        </div>
                        <div>
                            <span>Don't have an account? </span>
                            <button type='button' className='text-yellow-700' onClick={e => setShowSignUp(true)}>Sign Up</button>
                        </div>
                    </div>
                </form>
            }
        </div>
            
            </section>
    );
}