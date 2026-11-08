import { assets } from '../assets/assets'

const Footer = () => (
  <footer className="mt-16 border-t border-slate-200 bg-slate-50">
    <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 px-4 py-8 2xl:px-20">
      <img width={140} src={assets.logo} alt="EazyLink" />
      <p className="text-sm text-slate-600">EazyLink Careers · South Africa</p>
      <a href="mailto:info@eazylinkjobs.co.za" className="text-sm text-blue-800 underline">Contact support</a>
    </div>
  </footer>
)

export default Footer
