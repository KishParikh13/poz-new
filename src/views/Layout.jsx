export default function Layout (props) {
    return (
        <section className='bg-yellow-50 p-8 min-h-screen'>
            <div className='max-w-4xl mx-auto'>
                <div className="flex flex-col gap-8 relative">
                {props.children}
                </div>
            </div>
        </section>
    );
}