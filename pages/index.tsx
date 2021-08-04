import App from '../components/App'

const Index: React.FC<any> = ({ data }) => {
  return (
    <App data={data} />
  );
}

export async function getStaticProps() {
  const Airtable = require('airtable');
  const base = new Airtable({apiKey: 'keyaudliIldliyUJz'}).base('appDlPdTF1Nd833iw');
  const table = base('OBDs'); 
  const records = await table.select({}).firstPage();
  
  let data = {
    name: '',
    slug: '',
    topic_badge: '',
    display_name: '',
    community_badge: '',
    description: ''
  };
 
  records.forEach(function(record: any) {
    data.name = record.get('Name');
    data.slug = record.get('slug');
    data.topic_badge = record.get('topic_badge');
    data.display_name = record.get('display_name');
    data.community_badge = record.get('community_badge');
    data.description = record.get('description');
  });

  return {
    props: {
      data
    }
  }
}

export default Index;
