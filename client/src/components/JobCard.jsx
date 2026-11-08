import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (job.applyLink) {
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/apply-job/${job._id}`);
      scrollTo(0, 0);
    }
  };

  if (!job || !job.companyId) return null;

  const description = new DOMParser()
    .parseFromString(job.description || '', 'text/html').body.textContent || '';

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {job.companyId.image && (
            <img className="h-10 w-10 object-contain" src={job.companyId.image} alt="" />
          )}
          <p className="text-sm font-medium text-slate-600">{job.companyId.name || 'Employer'}</p>
        </div>
      </div>
      <h4 className="font-medium text-xl mt-2">{job.title}</h4>
      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
        <span className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">{job.location}</span>
        <span className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded">{job.level}</span>
      </div>
      <p className="my-4 text-sm text-slate-600">
        {description.slice(0, 150)}{description.length > 150 ? '…' : ''}
      </p>
      <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm">
        <button
          onClick={handleApplyClick}
          className="bg-[#203eab] text-white px-4 py-2 rounded"
        >
          Apply now
        </button>
        <button
          onClick={() => {
            navigate(`/apply-job/${job._id}`);
            scrollTo(0, 0);
          }}
          className="text-gray-500 border border-gray-500 rounded px-4 py-2"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;
