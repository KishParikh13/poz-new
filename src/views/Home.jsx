import React, { useEffect, useState } from 'react';
import Navigation from './Nav';
import { Link } from "react-router-dom";
import { CogIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { supabase } from '../supabaseClient';
import Loading from './Loading';

function Home(props) {

    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    async function getNotes() {
        const { data, error } = await supabase
            .from("Notes")
            .select()
            .neq('archived', true)
            .order('updated_at', { ascending: false })

        if (error) console.log("getNotesError", error);
        else {
            console.log("getNotes", data);
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

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <>
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
                    <button type="button" onClick={e => console.log()}>
                        <CogIcon className="h-6 w-6" />
                    </button>
                }
            />
            <div className='flex flex-col gap-4 relative'>
                <Loading loading={notes.length === 0} className="top-20" />

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
                        <Link key={key} to={`/notes/${note.id}`}>
                            <div className='hover:bg-opacity-10 transition-colors duration-100 bg-black bg-opacity-5 text-black p-4 rounded-md shadow-md'>
                                <div className='flex justify-between items-start'>
                                    <h2 className='text-xl font-bold'>
                                        <span className='text-2xl mr-2'>{note.emoji}</span>
                                        {note.title}
                                    </h2>

                                    <p className='text-gray-600  text-sm'>
                                        {new Date(note.updated_at).toLocaleDateString('en-us', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit" })}
                                    </p>
                                </div>

                                {
                                    note.content.length > 0 &&
                                    <p className='text-gray-500 mt-2'>{note.content}</p>
                                }
                            </div>
                        </Link>
                    ))
                }
            </div>
        </>
    );
}

export default Home;