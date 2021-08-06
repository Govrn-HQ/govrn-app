import App from '../components/App'

const Index: React.FC<any> = ({ data, statusData }) => {
  return (
    <App data={data} statusData={statusData} />
  );
}

async function getOBDs(base: any) {
  if(base == null) {
    return;
  }

  const table = base('OBDs'); 
  const records = await table.select({}).firstPage();
  const record = records[0];

  const data = {
    name: record.get('Name'),
    slug: record.get('slug'),
    obd_status: record.get('obd_status'),
    topic_badge: record.get('topic_badge'),
    display_name: record.get('display_name'),
    community_badge: record.get('community_badge'),
    description: record.get('description')
  };

  return data;
}

async function getStatus(base: any) {
  if(base == null) {
    return;
  }

  const table = base('Status'); 
  const records = await table.select({}).firstPage();
  const record = records[0];

  const data = {
    name: record.get('Name'),
    display_description: record.get('display_description'),
    display_title: record.get('display_title')
  }

  return data;
}

export async function getServerSideProps() {
  const Airtable = require('airtable');
  const base = new Airtable({apiKey: 'keyaudliIldliyUJz'}).base('appDlPdTF1Nd833iw');
  const data = await getOBDs(base);
  const statusData = await getStatus(base);

  return {
    props: {
      data,
      statusData
    }
  }
}

export default Index;
