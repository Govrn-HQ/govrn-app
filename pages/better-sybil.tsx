import Head from 'next/head'
import App from '../components/App'
import Airtable from 'airtable'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const OBDIndex = 2;

const Index: React.FC<any> = ({ data, statusData, graphData }) => {
  return (
    <>
      <Head>
        <title>Govrn</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta httpEquiv="Content-Security-Policy" content="connect-src ws: wss: https: http:" />
      </Head>
      <App data={data} statusData={statusData} graphData={graphData} />
    </>
  );
}

async function getOBDs(base: any) {
  if(base == null) {
    return;
  }

  const table = base('OBDs'); 
  const records = await table.select({}).firstPage();
  const record = records[OBDIndex];

  const data = {
    name: record.get('Name'),
    slug: record.get('slug'),
    obd_status: record.get('obd_status'),
    contract_id: record.get('contract_id'),
    topic_badge: record.get('topic_badge'),
    display_name: record.get('display_name'),
    community_badge: record.get('community_badge'),
    description: record.get('description')
  };

  return data;
}

async function getStatus(base: any, obd_status: string) {
  if(base == null) {
    return;
  }

  const table = base('Status'); 
  const records = await table.select({}).firstPage();
  let record = records[0];

  switch(obd_status) {
    case 'Proposal Submitted':
      record = records[1];
      break;
    case 'Voting':
      record = records[2];
      break;
    case 'In Progress':
      record = records[3];
      break;
    case 'Closed':
      record = records[4];
      break;
  }

  const data = {
    name: record.get('Name'),
    display_description: record.get('display_description'),
    display_title: record.get('display_title')
  }

  return data;
}

async function getGraphData(client: any, contract_id: string) {
  if(client == null) {
    return;
  }

  const contractQuery =
    `query {
      moloches(where: {id: "${contract_id.toLowerCase()}"}) {
        totalLoot
        members {
          id
	  tokenTribute
	  shares
          loot
        }
      }
    }`;

  const { data } = await client.query({
    query: gql(contractQuery)
  });
  
  return data;
}

export async function getServerSideProps() {
  const base = new Airtable({apiKey: 'keyaudliIldliyUJz'}).base('appDlPdTF1Nd833iw');
  const data = await getOBDs(base);
  const obd_status = (data == null) ? '' : data.obd_status;
  const contract_id = (data == null) ? '' : data.contract_id;
  const statusData = await getStatus(base, obd_status);

  const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-xdai",
    cache: new InMemoryCache()
  });
  const graphData = await getGraphData(client, contract_id);

  return {
    props: {
      data,
      statusData,
      graphData
    }
  }
}

export default Index;
