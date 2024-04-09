import React, {useState, useEffect} from 'react'
import { collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  orderBy,
  where,
  startAfter,
} from "firebase/firestore"
import {db} from "../frebase"
import BlogSection from '../components/BlogSection'
import Spnner from '../components/Spnner'
import {toast} from "react-toastify"
import Tags from '../components/Tags'
import MostTrend from '../components/MostTrend'
import Search from '../components/Search'
import { isEmpty, isNull } from 'lodash'
import {useLocation} from "react-router-dom"
import Category from '../components/Category'

function useQuery(){
  return new URLSearchParams(useLocation().search);
}

const Home = ({setActive, user, active}) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [mostPopularBlogs, setMostPopularBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [totalBlog, setTotalBlog] = useState(null);
  const [search, setSearch] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [hide, setHide] = useState(false);
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

  useEffect(() =>{ 
    setSearch("");
    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data()});
        });
        const unqueTags = [...new Set(tags)];
        setTags(unqueTags);
        setTotalBlog(list)
        //setBlogs(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    }
  }, [setActive, active]);

  const getBlog = async () => {
    const blogRef = collection(db,"blogs");
    const firstFourt = query(blogRef, orderBy("title"), limit(4));
    const docSnapshot = await getDocs(firstFourt)
    setBlogs(docSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})))
    setMostPopularBlogs(docSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})))
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1])
  }

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if(!isCollectionEmpty){
      const blogsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setBlogs((blogs) => [...blogs, ...blogsData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1])
    }else{
      toast.info("No hay mas publicaciones.")
      setHide(true);
    }
  }

  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const nextFourt = query(blogRef, orderBy("title"), limit(4), startAfter(lastVisible));
    const docSnapshot = await getDocs(nextFourt)
    updateState(docSnapshot);
    setLoading(false);
  };


  useEffect(() => {
    getBlog();
    setHide(false);
  }, [active])

  useEffect(() => {
    if(!isNull(searchQuery)){
      searchBlogs();
    }
  }, [searchQuery])
  
  const searchBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const searchTitleQuery = query(blogRef, where("title", "==", searchQuery));
    const searchTagQuery = query(blogRef, where("tags", "array-contains", searchQuery));
    const titleSnapshot = await getDocs(searchTitleQuery);
    const tagSnapshot = await getDocs(searchTagQuery);
    let searchTitleBlogs = [];
    let searchTagBlogs = [];
    titleSnapshot.forEach((doc) => {
      searchTitleBlogs.push({id: doc.id, ...doc.data()});
    });
    tagSnapshot.forEach((doc) => {
      searchTagBlogs.push({id: doc.id, ...doc.data()});
    });
    const combinedSearchBlogs = searchTitleBlogs.concat(searchTagBlogs);
    setBlogs(combinedSearchBlogs);
    setHide(true);
    setActive("");
  };

  if(loading){
    return <Spnner/>
  }

  const handleDelete = async (id) => {
    if(window.confirm('¿Seguro que quieres borrar esta publicacion?')){
      try{
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Publicacion eliminada con exito.");
        getBlog();
        setLoading(false);
      }catch(err){
        console.log(err);
      }
    }
  }
 
  const handleChange = (e) => {
    const {value} = e.target;
    if(isEmpty(value)){
      getBlog();
      setHide(false);
    }
    setSearch(value);
  }


  const counts = totalBlog.reduce((prevValue, currentValue)  => {
    let name = currentValue.category;
    if(!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }
    prevValue[name]++;
    delete prevValue["udefined"];
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return{
      category: k,
      count: counts[k]
    }
  })

  return (
    <div className='container-fluid pb-4 pt-4 padding'>
      <div className='container padding' > 
        <div className='row mx-0'>
        <Search search={search} handleChange={handleChange}  />
          <div className='col-md-8'>
          <div className='blog-heading text-start py-2 mb-4'>
            Publicaciones</div>
            {blogs.length === 0 && location.pathname !== "/" && (
              <>
              <h4>
                No se encontraron resultados para: {"   "}
              <strong>{searchQuery}</strong>
              </h4>
              </>
            )} 
            {blogs?.map((blog) => (
            <BlogSection 
              key={blog.id}
              user={user} 
              handleDelete={handleDelete}
              {...blog}
                />
            ))}
              {!hide && (
                  <button className='btn btn-primary' color={{background: "#3c546b"}} onClick={fetchMore}>Mostrar mas</button>
              )}
          </div>
          
          <div className='col-md-3' >
            <div className='blog-heading text-start py-2 mb-4'>En tendencia</div>
            <MostTrend  blogs={mostPopularBlogs} />
            <Category catgBlogsCount={categoryCount} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home