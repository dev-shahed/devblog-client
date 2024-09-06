import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Blog from "./components/Blog";
import blogService from "./services/blogs";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Blogs:", blogs);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const blogs = await blogService.getBlogs();
      setBlogs(blogs);
      setIsLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto mt-10 flex flex-col items-center justify-center space-y-10">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>

      {/* Center the Auth form with controlled width */}
      <div className="w-full max-w-md mx-auto">
        <Auth />
      </div>

      {/* Blog section with width constraints */}
      <div className="w-full max-w-2xl mx-auto">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => <Blog key={blog.id} blog={blog} />)
        ) : (
          <p className="text-gray-500 text-center">No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
