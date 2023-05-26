import React, { useEffect, useState } from 'react';
import Navigation from './Nav';
import { Link } from "react-router-dom";
import { ArchiveBoxIcon, ArrowLeftIcon, CogIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { supabase } from '../supabaseClient';
import { useParams } from "react-router-dom";
import Loading from './Loading';

let emojiOptions = ["🫥", "🙃", "😂", "😝", "😁", "😱", "🙌", "🍻", "🔥", "🌈", "🎈", "🌹", "💄", "🎀", "⚽", "🎾", "🏁", "😡", "👿", "🐻", "🐶", "🐬", "🐟", "🚗", "🍎", "💝", "💙", "👌", "❤", "😍", "😉", "😓", "😳", "💪", "💩", "🍸", "🔑", "💖", "🌟", "🎉", "🌺", "🎶", "👠", "🏈", "⚾", "🏆", "👽", "💀", "💣", "👃", "👂", "🍓", "💘", "💜", "👊", "💋", "😘", "😜", "😵", "🙏", "👋", "🚽", "💃", "💎", "🚀", "🌙", "🎁", "⛄", "🌊", "⛵", "🏀", "🎱", "💰", "👶", "👸", "🐰", "🐷", "🐍", "🐫", "🔫", "👄", "🚲", "🍉", "💛", "💚"]

function Note(props) {

    const [note, setNote] = useState({});
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    async function getNoteById() {
        const { data, error } = await supabase
            .from("Notes")
            .select()
            .eq('id', id)
        if (error) {
            console.log("getNotesError", error);
        }
        else {
            console.log("getNoteById", data);
            setNote(data[0]);
            setLoading(false);
        }
    }

    async function updateNote() {
        const { error } = await supabase.from('Notes').update(
            { title: note.title, content: note.content, emoji: note.emoji, updated_at: new Date() }
        ).eq('id', id)
        if (error) console.log("updateNoteError", error);
        else console.log("Update Succesful");
    }

    async function deleteNote() {
        if (window.confirm("Do you really want to delete this note?")) {
            const { error } = await supabase.from('Notes').delete().eq('id', id)
            if (error) console.log("deleteNoteError", error);
            else {
                console.log("Delete Succesful")
                window.location.href = `/`
            };
        }
    }

    async function archiveNote() {
        const { error } = await supabase.from('Notes').update(
            { archived: true }
        ).eq('id', id)
        if (error) console.log("archiveNoteError", error);
        else console.log("Archive Succesful");
    }

    useEffect(() => {
        getNoteById();
    }, []);

    return (
        <>
            <Navigation
                title={`Note #${id}`}
                leftItem={
                    <Link to="/">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </Link>
                }
                rightItem={
                    <button type="button" onClick={e => deleteNote()}>
                        <ArchiveBoxIcon className="h-6 w-6" />
                    </button>
                }
            />
            <Loading loading={loading} />
            <div className='flex flex-col gap-4'>
                <div className='flex justify-between items-center'>
                    <input value={note.title} className='text-2xl font-bold bg-transparent' onChange={
                        e => setNote({
                            ...note,
                            title: e.target.value
                        })
                    } onBlur={
                        e => updateNote()
                    }
                    />

                    <select value={note.emoji} onChange={
                        e => setNote({
                            ...note,
                            emoji: e.target.value
                        })
                    } onBlur={
                        e => updateNote()
                    } className='text-4xl bg-transparent'>
                        {
                            emojiOptions.map((emoji, index) => {
                                return <option key={index} value={emoji}>{emoji}</option>
                            })
                        }
                    </select>

                </div>

                <textarea className='w-full h-[60vh] bg-black bg-opacity-5 p-4 rounded-lg' value={note.content} onChange={
                    e => setNote({
                        ...note,
                        content: e.target.value
                    })
                } onBlur={
                    e => updateNote()
                } placeholder='Start writing...'>
                    {note.content}
                </textarea>
                <p className='text-gray-600 italic text-sm'>
                    Last updated: {new Date(note.updated_at).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </p>
            </div>
        </>
    );
}

export default Note;