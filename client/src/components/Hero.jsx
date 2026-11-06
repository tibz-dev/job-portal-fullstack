import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Hero = () => {
    const { setSearchFilter, setIsSearched } = useContext(AppContext)

    const onSearch = (event) => {
        event.preventDefault()
        const fields = new FormData(event.currentTarget)
        setSearchFilter({
            title: fields.get('title').trim(),
            location: fields.get('location').trim(),
        })
        setIsSearched(true)
        document.getElementById('job-list')?.scrollIntoView()
    }

    return (
        <section className='bg-[#101426] text-white' aria-labelledby='job-search-heading'>
            <div className='container mx-auto px-4 py-12 sm:py-20 2xl:px-20'>
                <p className='mb-4 text-sm font-semibold uppercase tracking-widest text-[#ffac79]'>EazyLink Careers · Job portal</p>
                <h1 id='job-search-heading' className='max-w-3xl text-5xl font-semibold leading-none tracking-tight sm:text-7xl'>
                    Find your next role.
                </h1>
                <p className='mt-4 max-w-xl text-lg text-slate-300'>Search vacancies by role and location, then explore the jobs that match.</p>

                <form onSubmit={onSearch} role='search' aria-label='Search vacancies'
                    className='mt-8 grid max-w-4xl gap-3 rounded-xl border border-slate-600 bg-[#191f35] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end'>
                    <label className='grid gap-1 text-sm font-medium'>
                        Job title
                        <input name='title' type='search' placeholder='e.g. Software developer'
                            className='min-w-0 rounded-md bg-white px-3 py-3 text-slate-900' />
                    </label>
                    <label className='grid gap-1 text-sm font-medium'>
                        Location
                        <input name='location' type='search' placeholder='e.g. Pretoria'
                            className='min-w-0 rounded-md bg-white px-3 py-3 text-slate-900' />
                    </label>
                    <button type='submit' className='rounded-md bg-[#ffac79] px-6 py-3 font-semibold text-[#101426] hover:bg-orange-200'>
                        Search jobs
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Hero
