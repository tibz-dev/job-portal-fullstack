import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ManageJobs = () => {

  const navigate = useNavigate()

  const [jobs, setJobs] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [busyIds, setBusyIds] = useState([])
  const pendingIds = useRef(new Set())


  const { backendUrl, companyToken } = useContext(AppContext)

  // Function to fetch company Job Applications data 
  const fetchCompanyJobs = useCallback(async () => {
    setLoadError('')

    try {

      const { data } = await axios.get(backendUrl + '/api/company/list-jobs',
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setJobs(data.jobsData.reverse())
      } else {
        setLoadError(data.message || 'Unable to load data. Please try again.')
      }

    } catch (error) {
      setLoadError(error.message)
    }

  }, [backendUrl, companyToken])

  // Function to change Job Visibility 
  const changeJobVisiblity = async (id) => {

    if (pendingIds.current.has(id)) return
    pendingIds.current.add(id)
    setBusyIds(Array.from(pendingIds.current))
    try {

      const { data } = await axios.post(backendUrl + '/api/company/change-visiblity',
        { id },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchCompanyJobs()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      pendingIds.current.delete(id)
      setBusyIds(Array.from(pendingIds.current))
    }

  }

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs()
    }
  }, [companyToken, fetchCompanyJobs])

  if (loadError) {
    return (
      <div className="p-8">
        <p role="alert">{loadError}</p>
        <button type="button" onClick={ fetchCompanyJobs } className="mt-3 text-blue-800 underline">Try again</button>
      </div>
    )
  }

  return jobs ? jobs.length === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
      <div className="text-center">
        <h1 className="text-2xl">You haven’t posted any jobs yet</h1>
        <button onClick={() => navigate('/dashboard/add-job')} className="mt-4 rounded bg-blue-800 px-4 py-2 text-white">Post your first job</button>
      </div>
    </div>
  ) : (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b text-left'>Job Title</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={job._id} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                <td className='py-2 px-4 border-b' >{job.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden' >{moment(job.date).format('ll')}</td>
                <td className='py-2 px-4 border-b max-sm:hidden' >{job.location}</td>
                <td className='py-2 px-4 border-b text-center' >{job.applicants}</td>
                <td className='py-2 px-4 border-b' >
                  <input aria-label={`Show ${job.title} to candidates`} disabled={busyIds.includes(job._id)} onChange={() => changeJobVisiblity(job._id)} className='scale-125 ml-4' type="checkbox" checked={job.visible} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
        <button onClick={() => navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add new job</button>
      </div>
    </div>
  ) : <Loading />
}

export default ManageJobs