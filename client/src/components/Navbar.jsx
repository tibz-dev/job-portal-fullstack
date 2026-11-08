import { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const { openSignIn } = useClerk()
    const { user } = useUser()

    const { setShowRecruiterLogin } = useContext(AppContext)

    return (
        <div className='border-b border-slate-200 bg-white py-4'>
            <div className='container px-4 2xl:px-20 mx-auto flex flex-wrap gap-4 justify-between items-center'>
                <Link to="/" aria-label="EazyLink Careers home"><img className="w-36" src={assets.logo} alt="EazyLink" /></Link>
                {
                    user
                        ? <div className='flex items-center gap-3'>
                            <Link to={'/applications'}>Applied Jobs</Link>
                            <p>|</p>
                            <p className='max-sm:hidden'>Hi, {user.firstName + " " + user.lastName}</p>
                            <UserButton />
                        </div>
                        : <div className='flex gap-4 max-sm:text-xs'>
                            <button onClick={() => setShowRecruiterLogin(true)} className='text-gray-600'>Recruiter Login</button>
                            <button onClick={() => openSignIn()} className='bg-[#203eab] text-white px-6 sm:px-9 py-2 rounded-full'>Candidate login</button>
                        </div>
                }

            </div>
        </div>
    )
}

export default Navbar