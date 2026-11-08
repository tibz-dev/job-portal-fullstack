import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ViewApplications = () => {

  const { backendUrl, companyToken } = useContext(AppContext)

  const [applicants, setApplicants] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [busyIds, setBusyIds] = useState([])
  const pendingIds = useRef(new Set())


  // Function to fetch company Job Applications data 
  const fetchCompanyJobApplications = useCallback(async () => {
    setLoadError('')

    try {

      const { data } = await axios.get(backendUrl + '/api/company/applicants',
        { headers: { token: companyToken } }
      )

      if (data.success) {
        setApplicants(data.applications.reverse())
      } else {
        setLoadError(data.message || 'Unable to load data. Please try again.')
      }

    } catch (error) {
      setLoadError(error.message)
    }

  }, [backendUrl, companyToken])

  // Function to Update Job Applications Status 
  const changeJobApplicationStatus = async (id, status) => {
    if (pendingIds.current.has(id)) return
    pendingIds.current.add(id)
    setBusyIds(Array.from(pendingIds.current))
    try {

      const { data } = await axios.post(backendUrl + '/api/company/change-status',
        { id, status },
        { headers: { token: companyToken } }
      )

      if (data.success) {
        await fetchCompanyJobApplications()
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
      fetchCompanyJobApplications()
    }
  }, [companyToken, fetchCompanyJobApplications])

  if (loadError) {
    return (
      <div className="p-8">
        <p role="alert">{loadError}</p>
        <button type="button" onClick={ fetchCompanyJobApplications } className="mt-3 text-blue-800 underline">Try again</button>
      </div>
    )
  }

  return applicants ? applicants.length === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
      <p className='text-xl sm:text-2xl'>No Applications Available</p>
    </div>
  ) : (
    <div className='container mx-auto p-4'>
      <div className="overflow-x-auto">
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
              <tr key={applicant._id} className='text-gray-700'>
                <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                <td className='py-2 px-4 border-b text-center flex items-center'>
                  <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                  <span>{applicant.userId.name}</span>
                </td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{applicant.jobId.location}</td>
                <td className='py-2 px-4 border-b'>
                  <a href={applicant.userId.resume} target='_blank' rel='noopener noreferrer'
                    className='bg-purple-50 text-purple-400 px-3 py-1 rounded inline-flex gap-2 items-center'
                  >
                    Resume <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className='py-2 px-4 border-b relative'>
                  {applicant.status === "Pending"
                    ? <div className="flex flex-wrap gap-2">
                      <button type="button" disabled={busyIds.includes(applicant._id)} onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')}
                        aria-label={`Accept ${applicant.userId.name}'s application`}
                        className="rounded border px-3 py-2 text-blue-800 disabled:opacity-50">Accept</button>
                      <button type="button" disabled={busyIds.includes(applicant._id)} onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')}
                        aria-label={`Reject ${applicant.userId.name}'s application`}
                        className="rounded border px-3 py-2 text-red-700 disabled:opacity-50">Reject</button>
                    </div>
                    : <div>{applicant.status}</div>
                  }

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ViewApplications