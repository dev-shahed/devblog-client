import { useEffect, useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import Blog from './components/Blog';
import blogService from './services/blogs';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Blogs:', blogs);

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
    <main className="container mx-auto mt-10 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      <Auth />
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : blogs.length > 0 ? (
        blogs.map((blog) => <Blog key={blog.id} blog={blog} />)
      ) : (
        <p className="text-gray-500">No blogs found.</p>
      )}
    </main>
  );
}

export default App;
