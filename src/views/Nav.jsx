export default function Navigation(props) {
    return (
        <nav className='flex justify-between items-center'>
            {props.leftItem}
            <h1 className='text-2xl font-bold hidden'>{props.title}</h1>
            {props.rightItem}
        </nav>
    );
}