import React from 'react'
import './dashboardPage.css'
import Header from '../../layouts/header'
const DashboardPage = () => {

    const data = [
        {
          id: 1,
          title: "Iran–Israel War Explained in 60 Seconds",
          description: "Short video explaining the conflict in a simple way",
          type: "Short", // Short | Long
          category: "News",
          uploaded: false, // true = already uploaded, false = not yet
          script: "",
          hashtags: ["#worldnews", "#iran", "#israel", "#shorts"],
          thumbnailUrl: "",
          publishDate: "2026-01-25",
          publishTime: "18:30",
          platform: "YouTube",
          videoUrl: "",
          createdBy: "Nuthan"
        },
        {
          id: 2,
          title: "Why People Are Losing Jobs During War",
          description: "Office and border war scenes showing economic impact",
          type: "Long",
          category: "Storytelling",
          uploaded: false,
          script: "Scene 1: Empty office...\nScene 2: War border visuals...",
          hashtags: ["#warimpact", "#jobs", "#aivideo"],
          thumbnailUrl: "https://example.com/thumbnails/job-loss-war.jpg",
          publishDate: "2026-01-27",
          publishTime: "20:00",
          platform: "YouTube",
          videoUrl: "",
          createdBy: "Nuthan"
        },
        {
          id: 3,
          title: "Calendar Time Rewinding – Cinematic Shot",
          description: "Clock rewinding fast with dramatic cinematic feel",
          type: "Short",
          category: "Cinematic",
          uploaded: true,
          script: "",
          hashtags: ["#cinematic", "#timerewind", "#shortfilm"],
          thumbnailUrl: "https://example.com/thumbnails/clock-rewind.jpg",
          publishDate: "2026-01-20",
          publishTime: "19:00",
          platform: "YouTube",
          videoUrl: "https://youtube.com/shorts/xxxxx",
          createdBy: "Nuthan"
        }
      ];
      
    return (
        <>
        <Header />
        <div className='dashboard-page'>
            {data.map(item => {
               return( <div key={item.id} className='dashboard-container'>
                <div className='header-dashboard'>
                    <h1>{item.type} vedio</h1>
                    {item.uploaded ? <p> uploaded</p> : <p>ToBeUplaod</p>}
                </div>

                <div className='content-dashboard'>
                    <p>{item.title}</p>
                    {item.uploaded ? <p>{item.publishDate} : {item.publishTime}</p> :''}
                    {item.uploaded && (
                        <>
                        <p>{item.publishDate} : {item.publishTime}</p>
                        <p>Youtube Link:{item.videoUrl}</p>
                        </>
                    )}

                    

                </div>
                <div className='dashboard-footer'>
                    {!item.uploaded && <button>
                        Delete
                    </button> }
                    <button>
                        Edit
                    </button>
                    
                    <button>
                        View
                    </button>
                </div>
            </div>)
            })}
            

           

        </div>

        </>
    )
}
export default DashboardPage