import { useEffect, useState } from 'react';
import './App.css';
import AddBlog from './components/AddBlog';
import Auth from './components/Auth';
import Blog from './components/Blog';
import blogService from './services/blogs';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const blogs = await blogService.getBlogs();
        setBlogs(blogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blogs'); // Set an error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('devblogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  return (
    <div className="relative container mx-auto mt-10 flex flex-col items-center justify-center space-y-10">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      {user !== null && (
        <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center space-x-4">
          <p className="text-sm font-medium">Logged-in: {user.name}</p>
          <button
            onClick={() => {
              window.localStorage.removeItem('devblogUser');
              setUser(null);
            }}
            className="bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Log out
          </button>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        {user === null ? (
          <Auth setUser={setUser} />
        ) : (
          <AddBlog setBlogs={setBlogs} blogs={blogs} />
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
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
