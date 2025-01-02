import type { MetaFunction } from "@remix-run/node";
import { Button, Flex, Input,message, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from "react";
import Header from "~/components/Header";
import { getTweets } from "~/common/api.request";

export const meta: MetaFunction = () => {
  return [
    { title: "Twitter Scrapper" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const[url,setUrl] = useState<string>("")
  const[cashtag,setCashtag]=useState<string>("")
  const[loading,setLoading]=useState<boolean>(false)
  const [data,setData]=useState()
  console.log(typeof(data))

  const handleSubmit = async() => {
    if(!url || !cashtag){
      message.error("Please enter url n cashtag")
      return;
    }
    setLoading(true)
    const result = await getTweets(url,cashtag)
    setData(result)
    setLoading(false)
  }

  return (
    <>
    <Header/>
    <Flex className="px-10 h-[calc(100vh-48px)]">
      <div  className="mt-10 mb-5 flex-[0.3]">
        <div>
        <h1 className="mb-3 font-semibold">Enter Twitter userName</h1>
        <Input value={url} onChange={e => setUrl(e.target.value)}/>
        </div>
        <div className="mt-10">
        <h1 className="mb-3 font-semibold">Enter cashtag</h1>
        <Input value={cashtag} onChange={e => setCashtag(e.target.value)}/>
        </div>
      <Button className="w-full mt-10" variant="solid" color="default" onClick={handleSubmit}>Submit</Button>
      </div>
      <div className="flex-[0.7]">
      {loading &&
      <Flex className="h-full" justify="center" align="center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Flex>
      }
      
        {data ? <div className="px-10 mt-10">
          {data?.map((data,key) => <div key={data} className="my-2">{key} {" - "}{data}</div>)} 
        </div>
        :
      <Flex className="h-full" justify="center" align="center">
        {!loading &&
          <h1 className="font-semibold text-lg">No Data ...</h1>
        }
          </Flex>
        }
      
      </div>
      </Flex>
    </>
  );
}
