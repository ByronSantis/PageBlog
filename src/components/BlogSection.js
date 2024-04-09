import React from 'react'
import FontAwesome from 'react-fontawesome'
import {Link} from "react-router-dom"
import { excerpt } from '../utility'

const BlogSection = ({ id,
    title,
    description,
    category,
    imgUrl,
    userId,
    timestamp,
    user,
    handleDelete,}) => {
  return (
             <div>
                 <div className='row pb-4' key={id}>
                    
                    <div className='col-md-5'> 
                        <div className='hover-blogs-img'> 
                     
                            <div className='blogs-img'> 
                                <img src={imgUrl} alt={title} />
                                    <div></div>
                             </div>
                        </div>
                    </div>
                    <br/>
                    <div className='col-md-7'>
                        <div className='text-start'>
                            <h6 className='category catg-color'>{category}</h6>
                            <span className='title py-2'>{title}</span>
                            <span className='meta-info'>
                            <div className='short-description'>
                            {excerpt(description, 100)}
                            </div>
                            </span>
                            Publicado: {timestamp.toDate().toDateString()}
                        </div>
                        <div className='short-description'>
                            
                        </div>
                        <Link to={`/detail/${id}`}> 
                        <button className='btn btn-read'>Leer mas</button>
                        </Link>
                        {user && user.uid === userId && (
                              <div style={{float: "right"}}>
                             <Link to={`/update/${id}`}>
                             <FontAwesome
                              name='edit'
                              style={{margin: "15px", cursor: "pointer"}}
                              size='2x'
                              />
                             </Link>
                              <FontAwesome
                              name='trash'
                              style={{margin: "15px", cursor: "pointer"}}
                              size='2x'
                              onClick={() => handleDelete(id)}
                              />
                          </div>
                        )}
                    </div>
                 </div>
    </div>
  )
}

export default BlogSection
