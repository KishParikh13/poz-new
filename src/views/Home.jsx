import React, { useEffect, useState } from 'react';
import Navigation from './Nav';
import { Link } from "react-router-dom";
import { CogIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { supabase } from '../supabaseClient';
import Layout from './Layout';

function Home(props) {

    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState({});

    async function getNotes() {
        const { data, error } = await supabase
            .from("Notes")
            .select()
            .neq('archived', true)
            .order('updated_at', { ascending: false })

        if (error) console.log("getNotesError", error);
        else {
            setNotes(data);
        }
    }

    async function createNote() {
        const { error } = await supabase
            .from('Notes')
            .insert(
                { id: notes.length + 1, title: 'New note', content: '', emoji: '🫥' }
            )

        if (error) console.log("createtNoteError", error);
        else window.location.href = `/notes/${notes.length + 1}`
    }

    async function getUserById(id) {
        const { data, error } = await supabase
            .from("Users")
            .select()
            .eq('id', id)
        if (error) {
            console.log("getUserByIdError", error);
        } else {
            setUser(data[0]);
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
            } else {
                window.location.href = `/`
            }
        }
    }

    useEffect(() => {
        getNotes();
        getSession();
    }, []);

    return (
        <Layout>
            <Navigation
                title="Journal"
                leftItem={
                    <div className='flex items-center relative'>
                        <button type="button" onClick={e => console.log("search clicked")}>
                            <MagnifyingGlassIcon className="h-6 w-6" />
                        </button>
                        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className=' bg-transparent p-2 absolute ml-8' type="search" placeholder='Search'></input>
                    </div>
                }
                rightItem={
                    <Link to="/settings">
                        <CogIcon className="h-6 w-6" />
                    </Link>
                }
            />
            {
                notes.length > 0 &&
                <div className='flex flex-col gap-4 relative'>

                    {
                        user &&
                        <p className='text-lg font-bold'>Welcome back, {user.first_name}</p>
                    }
                    <button onClick={e => createNote()}>
                        <div className='hover:bg-black hover:bg-opacity-5 transition-colors duration-100 text-gray-500 p-4 rounded-md border-dashed border-2  border-black border-opacity-20'>
                            <h2 className='text-xl'>
                                <span className='text-2xl mr-2'></span>
                                + Create
                            </h2>
                            <p className='text-gray-500'></p>
                        </div>
                    </button>
                    {
                        notes.filter((note) => {
                            const noteName = note.title.toLowerCase() + note.content.toLowerCase() + note.emoji.toLowerCase();
                            return noteName.includes(searchQuery);
                        }).map((note, key) => (
                            <div key={key}>
                                {
                                    // only show date if it's different from the previous note
                                    (key === 0 || new Date(note.updated_at).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" }) !== new Date(notes[key - 1].updated_at).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" })) &&
                                    <p className='text-gray-500 mt-4 mb-2'>{new Date(note.updated_at).toLocaleDateString('en-us', { month: "long", day: "numeric" })}</p>
                                }
                                <Link to={`/notes/${note.id}`}>
                                    <div className='hover:bg-opacity-10 transition-colors duration-100 bg-black bg-opacity-5 text-black p-4 rounded-md shadow-md'>
                                        <div className='flex justify-between items-start'>
                                            <h2 className='text-xl font-bold'>
                                                <span className='text-2xl mr-2'>{note.emoji}</span>
                                                {note.title}
                                            </h2>

                                            <p className='text-gray-600  text-sm'>
                                                {/* display just the time of update */}
                                                {new Date(note.updated_at).toLocaleTimeString('en-us', { hour: "numeric", minute: "numeric" })}
                                            </p>
                                        </div>

                                        {
                                            note.content.length > 0 &&
                                            <p className='text-gray-500 mt-2'>{note.content}</p>
                                        }
                                    </div>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            }
        </Layout>
    );
}

export default Home;