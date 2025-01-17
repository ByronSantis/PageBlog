import React from 'react'
import {Link} from "react-router-dom"

const Tags = ({tags}) => {
  return (
    <div>
       <div className='tags'>
            {tags?.map((tag, index) => (
                 <p 
                 className='tag' key={index} style={{cursor: "pointer"}}>
                     <Link to={`/tag/${tag}`} style={{textDecoration: "none", color: "white"}}
                     >
                     {tag}
                     </Link>
                 </p>
            ))}
       </div>
    </div>
  )
}

export default Tags
