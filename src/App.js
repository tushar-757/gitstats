import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input ,Button, notification, Avatar, Image,Table  } from 'antd';
import {GithubOutlined,StarFilled} from '@ant-design/icons'



const columns = [
  {
    title: 'PublicRepoName',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'PublicRepoLink',
    dataIndex: 'link',
    key: 'link',
  },
  {
    title: 'Stars',
    dataIndex: 'stars',
    key: 'age',
  },
];


function App() {
  const [username,setUsername]=useState("");
  const [data,setData]=useState([]);
  const [sourcedata,setSourceData]=useState([]);
  const [avaterurl,setAvatarUrl]=useState("");
  const [stars,setStars]=useState(0)
  const [publicrepo,setpublicrepo]=useState(0)
  const url= `https://api.github.com/users/${username}/repos`;

  //functions

  //searchhandler
  const searchHandler=async()=>{
    setData([])
    setSourceData([])
    const data=await axios.get(url);
    setData(data?.data)
    setAvatarUrl(data?.data[0]?.owner?.avatar_url)
  }

  //notification if a person has > 50 stars
  const openNotificationWithIcon = type => {
    notification[type]({
      message: `${username}`,
      description:
        `${username} this person has more than ${stars} stars`,
    });
  };

  //hooks
  //hook 1 to reutrn usefull data from data set
  useEffect(()=>{
      const d=data.map((data)=>{
        return(
          {name:data?.name,
            link: `https://github.com/${username}/${data?.name}`,
          stars:data?.stargazers_count
        }
        )
      })
      setSourceData(d)
  },[data])

  //hook 2 :is checking for the star and repo counts
  useEffect(()=>{
       const stars=sourcedata.map((data)=>data.stars)
      const publicrepo=sourcedata.map((data)=>data?.name)
      setpublicrepo(publicrepo.length)
         let sum = 0;
         for (let i = 0; i < stars.length; i++) {
             sum += stars[i];
           }
           setStars(sum)
  },[sourcedata,stars])

  //hook 3 : to release notification if we have >50 stars
  useEffect(()=>{
    if(stars>50){
      openNotificationWithIcon('success')
    }
  },[stars])

  return (
    <div className="App">
      <div className='head'>
           <h2 style={{color: '#ff9800'}}>
             <GithubOutlined /> GitHub Stats
           </h2>
      </div>
      <div  style={{display:"flex", width: "100%"}}>
        <div className='leftbox'  style={{ width: "60%"}} >
           <div className='searchbox'>
            <Input style={{width:"20%"}}
             className='searchbox-input'
             value={username}
             onChange={(e)=>setUsername(e.target.value)}
             placeholder="github username"
             />
           <Button className='searchbox-btn' onClick={()=>searchHandler()}>search</Button>
        </div>
         {
           (!data)?
              <h1 >no result found</h1>
              :
              <div className='table'>
                <Table columns={columns} dataSource={sourcedata} />
                </div>
         }
      </div>
      <div style={{width:"30%",marginLeft:"1rem"}}>
      <div className='avatarbox'>
            <Avatar size={100} src={<Image src={avaterurl} style={{ width:100 }} />} />
      </div>
         <div className='status-box'>
           <div>
           <h2 style={{color:"white"}}>{username} GitHub stats<StarFilled twoToneColor="#ff9800"/></h2>
           </div>
           <div>
             <div>
               <span className='text-color'>total stars:{stars}</span>
             </div>
             <div>
               <span className='text-color'>total public repositories:{publicrepo}</span>
             </div>
             <div style={{marginTop:"1rem"}}>
               <GithubOutlined style={{fontSize:50}}/>
             </div>
           </div>
         </div>
      </div>
      </div>
    </div>
  );
}

export default App;
