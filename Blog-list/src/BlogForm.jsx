import React, {useState,useEffect} from 'react'
import axios from "axios"
import {BrowserRouter as Router,Route,Routes,Link,useParams} from "react-router-dom"

const categories = [
   " Entertainment",
    "Technology",
     "Sports",
      "Business",
       "Health",
        "Science"
]

function BlogForm(AddOn) {
    const [category,setCategory] = useState[categories[0]]
    const [title,setTitle] = useState("")
    const [bloggerName,setBloggerName] = useState("")
    const [image,setImage] = useState("")
    const [description,setDescription] = useState("")

    const validate = () =>{
        let err = {};
        if(!category) err.category = "Category is required"
        if(title.length<3) err.title = "Title length must be min 3 or more character required"
        if(bloggerName.length<3) err.title = "Blogger length must be min 3 or more character required"
        if(!image) err.image = "Image URL must be valid from internet"
        if(description.length<3)err.description = "Description text area must be min 3 or more character required"
        SetErrors(err);
        return Object.keys(err).length ==0;
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!validate()) return;
        AddOn({
            category,
            title,
            bloggerName,
            image,
            description,
        });
        setTitle("");
        setBloggerName("")
        setImage("");
        setDescription("");
        setCategory("");
        setCategory(categories[0])
    }
  return (
    <form onSubmit={handleSubmit} style= {{marginBottom:"30px"}}>
        <h3>Add New Blog</h3>
        <div>
            <label>Category:</label>
            <select value={category} onChange={(e)=> setCategory(e.target.value)}></select>
            {errors.category && <p style={{color:"red"}}>{errors.categories}</p>}
            </div>
            <div>
                <label>Title:</label>
                <input type="text" placeholder='Enter the title' value={title} onChange={(e)=> setTitle(e.target.value)} />
                {errors.title && <p style={{color: "red"}}>{errors.title}</p>}
            </div>
            <div>
                <label>BloggerName:</label>
                <input type="text" placeholder='Enter blogger name' value={bloggerName} onChange={(e)=> setBloggerName(e.target.value)} />
            </div>
    </form>
  )     
}

export default BlogForm