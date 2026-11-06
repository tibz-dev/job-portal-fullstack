import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JobListing from '../components/JobListing'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <JobListing />
      </main>
      <Footer />
    </div>
  )
}

export default Home
