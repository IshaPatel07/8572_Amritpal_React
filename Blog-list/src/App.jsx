import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";


const categories = [
  "Entertainment",
  "Technology",
  "Sports",
  "Business",
  "Health",
  "Science",
];

// Form component for adding blogs
function BlogForm({ onAdd }) {
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState("");
  const [bloggerName, setBloggerName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};
    if (!category) err.category = "Category is required";
    if (title.length < 3) err.title = "Title must be 3 or more characters";
    if (bloggerName.length < 3) err.bloggerName = "Blogger Name must be 3 or more characters";
    if (!image) err.image = "Image URL is required";
    if (description.length < 3) err.description = "Description must be 3 or more characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({
      category,
      title,
      bloggerName,
      image,
      description,
    });
    setTitle("");
    setBloggerName("");
    setImage("");
    setDescription("");
    setCategory(categories[0]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <h3>Add New Blog</h3>
      <div>
        <label>Category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p style={{ color: "red" }}>{errors.category}</p>}
      </div>
      <div>
        <label>Title: </label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
      </div>
      <div>
        <label>Blogger Name: </label>
        <input
          type="text"
          placeholder="Enter blogger name"
          value={bloggerName}
          onChange={(e) => setBloggerName(e.target.value)}
        />
        {errors.bloggerName && <p style={{ color: "red" }}>{errors.bloggerName}</p>}
      </div>
      <div>
        <label>Image URL: </label>
        <input
          type="text"
          placeholder="Enter image link"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        {errors.image && <p style={{ color: "red" }}>{errors.image}</p>}
      </div>
      <div>
        <label>Description: </label>
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p style={{ color: "red" }}>{errors.description}</p>}
      </div>
      <button type="submit">Add Blog</button>
    </form>
  );
}


function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = filterCategory
    ? blogs.filter((blog) => blog.category === filterCategory)
    : blogs;

  return (
    <div>
      <h2>Blog List</h2>
      <div>
        <label>Filter by Category: </label>
        <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: 20 }}>
          {filteredBlogs.map((blog) => (
            <div key={blog.id} style={{ border: "1px solid #ccc", padding: 10, width: 300 }}>
              <img src={blog.image} alt={blog.title} style={{ width: "100%", height: 150, objectFit: "cover" }} />
              <h3>{blog.title}</h3>
              <p><b>Category:</b> {blog.category}</p>
              <p><b>Blogger:</b> {blog.bloggerName}</p>
              <p>{blog.description.substring(0, 100)}...</p>
              <Link to={`/blog/${blog.id}`}>Read More</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found</p>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <img src={blog.image} alt={blog.title} style={{ width: "100%", maxHeight: 300, objectFit: "cover" }} />
      <p><b>Category:</b> {blog.category}</p>
      <p><b>Blogger:</b> {blog.bloggerName}</p>
      <p>{blog.description}</p>
      <Link to="/">Back to List</Link>
    </div>
  );
}


function App() {
  
  const addBlog = async (blog) => {
    try {
      await axios.post("http://localhost:3000/blogs", blog);
      alert("Blog added successfully. Please refresh list.");
    } catch (err) {
      console.error(err);
      alert("Error adding blog");
    }
  };
  

  return (

    <Router>
      <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
        <h1>React Blog App with Axios API (JSON-server)</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <BlogForm onAdd={addBlog} />
                <BlogList />
              </>
            }
          />
          <Route path="/blog/:id" element={<BlogDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;