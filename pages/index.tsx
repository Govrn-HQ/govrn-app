import Layout from '../components/Layout'
import Header from '../components/Header.tsx'
import Pledge from '../components/Pledge.tsx'
import Status from '../components/Status.tsx'
import Footer from '../components/Footer.tsx'

const Index = () => {
  return(
    <Layout>
      <Header />
      <Pledge />
      <Status />
      <Footer />
    </Layout>
  );
}
export default Index;
