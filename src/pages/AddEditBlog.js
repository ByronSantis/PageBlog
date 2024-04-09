import React, {useState, useEffect} from 'react'
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css"
import { db, storage } from '../frebase'
import {addDoc, collection, serverTimestamp, doc, getDoc, updateDoc} from "firebase/firestore"
import { useNavigate, useParams } from 'react-router-dom';
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage"
import {toast} from "react-toastify"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const initialState = {
  title: "",
  tags: [],
  category: "",
  description: "",
}

const categoryOption = [
  "Devocionales",
  "Reflexiones",
  "Datos Biblicos",
  "Investigaciones",
  "Palabra de animo",
  "Otros"
]

const AddEditBlog = ({user, setActive }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);

  const {id} = useParams();

  const navigate = useNavigate();

  const {title, tags, category, description} = form;

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          switch (snapshot.status) {
            case "pausado":
              console.log("Subida en pausa");
              break;
              case "corriendo":
                console.log("Subida en curso");
              break;
              default:
                break;
          }
      }, (error) => {
        console.log(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          toast.info("Imagen cargada con exito.")
          setForm((prev) => ({ ...prev, imgUrl: downloadURL}));
        })
      }
      )
    }
    file && uploadFile();
  }, [file]);

  useEffect(() => {
    id && getBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    if(snapshot.exists()){
      setForm({...snapshot.data()})
    }
    setActive(null)
  }

  //console.log("form", form);

  const handleSubmit = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value});
  };

  const handleTags = (tags) => {
    setForm({ ...form, tags})
  };

  const onCategory = (e) => {
    setForm({ ...form, category: e.target.value})
  }

  const handleChange =  async (e) => {
    e.preventDefault();
    if(category && tags && title && description){
      if(!id){
        try{
          await addDoc(collection(db, "blogs"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Publicacion creada con exito.")
        }catch(err){
          console.log(err);
        }
      }else{
        try{
          await updateDoc(doc(db, "blogs", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user.displayName,
            userId: user.uid,
          });
          toast.success("Publicacion editada con exito.")
        }catch(err){
          console.log(err);
        }
      }
    }else{
      return toast.error("Algunos campos estan vacios. Intenta de nuevo.")
    }
    navigate("/");
  }

  

  return (
    <div className='container-fluid mb-4'>
      <div className='container'>
        <div className='col-12'>
          <div className='text-center heading py-2'>
              {id ? "Actualizar publicacion" : "Crear Publicacion"}
          </div>
        </div>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-10 col-md-8 col-lg-6'>
            <form className='row blog-form' onSubmit={handleChange}>
              <div className='col-12 py-3'>
                  <input
                        type='text'  
                        className='form-control input-text-box'
                        placeholder='Titulo'
                        name='title'
                        value={title}
                        onChange={handleSubmit}
                        required
                    />
              </div>
              <div className='col-12 py-3'>
              <ReactTagInput
                  tags={tags}
                  placeholder="Etiquetas"
                  onChange={handleTags}
                  required
                />     
              </div>
              <div className='col-12 py-3'>
              <select value={category} onChange={onCategory} className='catg-dropdown'
              >
                  <option>Escoge una categoria</option>
                  {categoryOption.map((option, index) => (
                      <option value={option || "" } key={index}>{option}</option>
                  ))}
                </select> 
              </div>
              <div className='col-12 py-3'>
                <textarea
              
                className='form-control description-box'
                placeholder='Descripcion'
                value={description}
                name='description'
                onChange={handleSubmit}
                required
                />
              </div>
                <div className='mb-3'>
                <span >Solo se admiten archivos .jpg, .jpeg y .png</span>
                  <input
                  type='file'
                  className='form-control'
                  onChange={(e) => setFile(e.target.files[0])}
                  
                  />
                </div>
                <div className='col-12 py-3 text-center'>
                  <button title="Please Login to like post" className='btn btn-add' type='submit' disabled={progress !== null && progress < 100}>
                    {id ? "Actualizar" : "Publicar"}
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditBlog
