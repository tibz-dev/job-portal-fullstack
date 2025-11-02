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

        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())

        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    // Group JobLocations by continent
    const JobLocationsByContinent = {
        "Africa": JobLocations.filter(c => [
            "Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cabo Verde",
            "Cameroon","Central African Republic","Chad","Comoros","Congo","Democratic Republic of the Congo",
            "Djibouti","Egypt","Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Gabon","Gambia",
            "Ghana","Guinea","Guinea-Bissau","Ivory Coast","Kenya","Lesotho","Liberia","Libya",
            "Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique","Namibia",
            "Niger","Nigeria","Rwanda","Sao Tome and Principe","Senegal","Seychelles","Sierra Leone",
            "Somalia","South Africa","South Sudan","Sudan","Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe"
        ].includes(c)),
        "Asia": JobLocations.filter(c => [
            "Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei","Cambodia",
            "China","Cyprus","Georgia","India","Indonesia","Iran","Iraq","Israel","Japan","Jordan",
            "Kazakhstan","North Korea","South Korea","Kuwait","Kyrgyzstan","Laos","Lebanon","Malaysia",
            "Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Palestine","Philippines",
            "Qatar","Saudi Arabia","Singapore","Sri Lanka","Syria","Tajikistan","Thailand","Timor-Leste",
            "Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen"
        ].includes(c)),
        "Europe": JobLocations.filter(c => [
            "Albania","Andorra","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria",
            "Croatia","Czechia","Denmark","Estonia","Finland","France","Germany","Greece","Hungary",
            "Iceland","Ireland","Italy","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta",
            "Monaco","Montenegro","Netherlands","North Macedonia","Norway","Poland","Portugal","Romania",
            "Russia","San Marino","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","United Kingdom"
        ].includes(c)),
        "North America": JobLocations.filter(c => [
            "Antigua and Barbuda","Bahamas","Barbados","Belize","Canada","Costa Rica","Cuba","Dominica",
            "Dominican Republic","El Salvador","Grenada","Guatemala","Haiti","Honduras","Jamaica","Mexico",
            "Nicaragua","Panama","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines",
            "Trinidad and Tobago","United States of America"
        ].includes(c)),
        "South America": JobLocations.filter(c => [
            "Argentina","Bolivia","Brazil","Chile","Colombia","Ecuador","Guyana","Paraguay","Peru",
            "Suriname","Uruguay","Venezuela"
        ].includes(c)),
        "Oceania": JobLocations.filter(c => [
            "Australia","Fiji","Kiribati","Marshall Islands","Micronesia","Nauru","New Zealand",
            "Palau","Papua New Guinea","Samoa","Solomon Islands","Tonga","Tuvalu","Vanuatu"
        ].includes(c))
    }

    const [expandedContinents, setExpandedContinents] = useState({})

    const toggleContinent = (continent) => {
        setExpandedContinents(prev => ({
            ...prev,
            [continent]: !prev[continent]
        }))
    }

    return (
        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>

            {/* Sidebar */}
            <div className='w-full lg:w-1/4 bg-white px-4'>

                {/*  Search Filter from Hero Component */}
                {
                    isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                        <>
                            <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                            <div className='mb-4 text-gray-600'>
                                {searchFilter.title && (
                                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                        {searchFilter.title}
                                        <img onClick={e => setSearchFilter(prev => ({ ...prev, title: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                                {searchFilter.location && (
                                    <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                        {searchFilter.location}
                                        <img onClick={e => setSearchFilter(prev => ({ ...prev, location: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                            </div>
                        </>
                    )
                }

                <button onClick={e => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
                    {showFilter ? "Close" : "Filters"}
                </button>

                {/* Category Filter */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {
                            JobCategories.map((category, index) => (
                                <li className='flex gap-3 items-center' key={index}>
                                    <input
                                        className='scale-125'
                                        type="checkbox"
                                        onChange={() => handleCategoryChange(category)}
                                        checked={selectedCategories.includes(category)}
                                    />
                                    {category}
                                </li>
                            ))
                        }
                    </ul>
                </div>

                {/* Location Filter */}
                <div className={showFilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4 pt-14'>Search by Location</h4>

                    {Object.entries(JobLocationsByContinent).map(([continent, countries]) => (
                        <div key={continent} className="mb-4">
                            <button
                                className="font-semibold text-md py-2 w-full text-left"
                                onClick={() => toggleContinent(continent)}
                            >
                                {continent}
                            </button>
                            {expandedContinents[continent] && (
                                <ul className='space-y-2 max-h-48 overflow-y-auto text-gray-600'>
                                    {countries.map((location, index) => (
                                        <li className='flex gap-3 items-center' key={index}>
                                            <input
                                                className='scale-125'
                                                type="checkbox"
                                                onChange={() => handleLocationChange(location)}
                                                checked={selectedLocations.includes(location)}
                                            />
                                            {location}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Job listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2' id='job-list'>Latest jobs</h3>
                <p className='mb-8'>Get your desired job from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                        <JobCard key={index} job={job} />
                    ))}
                </div>

                {/* Pagination */}
                {filteredJobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <a href="#job-list">
                            <img onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} src={assets.left_arrow_icon} alt="" />
                        </a>
                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                            <a key={index} href="#job-list">
                                <button onClick={() => setCurrentPage(index + 1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>{index + 1}</button>
                            </a>
                        ))}
                        <a href="#job-list">
                            <img onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))} src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )}
            </section>
        </div>
    )
}

export default JobListing
