import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {

    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)

    const [showFilter, setShowFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])

    const [filteredJobs, setFilteredJobs] = useState(jobs)

    const handleCategoryChange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        )
    }

    useEffect(() => {

        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)

        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)

        const matchesTitle = job => searchFilter.title === "" || (job.title || '').toLowerCase().includes(searchFilter.title.toLowerCase())

        const matchesSearchLocation = job => searchFilter.location === "" || (job.location || '').toLowerCase().includes(searchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => job && job.companyId && matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    const clearFilters = () => {
        setSelectedCategories([])
        setSelectedLocations([])
        setSearchFilter({ title: '', location: '' })
    }

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8 gap-6'>

            {/* Sidebar */}
            <div className='w-full lg:w-1/4 bg-white px-4'>

                {/*  Search Filter from Hero Component */}
                {
                    isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                        <>
                            <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                            <div className='mb-4 text-gray-600'>
                                {searchFilter.title && (
                                    <span className='inline-flex items-center gap-2.5 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded'>
                                        {searchFilter.title}
                                        <img onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                                {searchFilter.location && (
                                    <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                        {searchFilter.location}
                                        <img onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                            </div>
                        </>
                    )
                }

                <button type="button" aria-expanded={showFilter} onClick={() => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
                    {showFilter ? "Close" : "Filters"}
                </button>

                <button type="button" onClick={clearFilters} className="ml-3 text-sm text-blue-800 underline">
                    Clear all filters
                </button>

                {/* Category filters */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {
                            JobCategories.map((category, index) => (
                                <li key={index}>
                                    <label className='flex gap-3 items-center'>
                                    <input
                                        className='scale-125'
                                        type="checkbox"
                                        onChange={() => handleCategoryChange(category)}
                                        checked={selectedCategories.includes(category)}
                                    />
                                    {category}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                {/* Location Filter */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4 pt-14'>Search by Location</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {
                            JobLocations.map((location, index) => (
                                <li key={index}>
                                    <label className='flex gap-3 items-center'>
                                    <input
                                        className='scale-125'
                                        type="checkbox"
                                        onChange={() => handleLocationChange(location)}
                                        checked={selectedLocations.includes(location)}
                                    />
                                    {location}
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>

            {/* Job listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2' id='job-list'>Latest jobs</h3>
                <p className='mb-8 text-slate-600' role="status">{filteredJobs.length} {filteredJobs.length === 1 ? 'vacancy' : 'vacancies'} found</p>
                {filteredJobs.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-8">
                        <h4 className="text-lg font-semibold">No vacancies to show</h4>
                        <p className="mt-2">Try another title or location, or clear your filters.</p>
                        <button type="button" onClick={clearFilters} className="mt-4 text-blue-800 underline">Clear filters</button>
                    </div>
                )}
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4'>
                    {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>


                {/* Pagination */}
                {filteredJobs.length > 0 && (
                    <nav aria-label="Vacancy pages" className="mt-10 flex flex-wrap justify-center gap-2">
                        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="rounded border px-3 py-2 disabled:opacity-40">Previous</button>
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                            <button key={index} type="button" aria-current={currentPage === index + 1 ? 'page' : undefined}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`rounded border px-3 py-2 ${currentPage === index + 1 ? 'bg-blue-100 text-blue-900' : ''}`}>
                                {index + 1}
                            </button>
                        ))}
                        <button type="button" disabled={currentPage === Math.ceil(filteredJobs.length / 6)} onClick={() => setCurrentPage(currentPage + 1)} className="rounded border px-3 py-2 disabled:opacity-40">Next</button>
                    </nav>
                )}

            </section>

        </div>
    )
}

export default JobListing