import { useEffect, useRef, useState } from 'react';
import './App.css';
import AddBlog from './components/AddBlog';
import Auth from './components/Auth';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const blogFormRef = useRef();

  // Fetch blogs when user is authenticated
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const blogs = await blogService.getBlogs();
        const sortedBlog = [...blogs].sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlog);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to fetch blogs');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBlogs();
    }
  }, [user]);

  // Check for logged-in user from localStorage and validate the token
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('devblogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      const tokenValid = loginService.isTokenValid(user.token);
      if (tokenValid) {
        setUser(user);
        loginService.setToken(user.token);
      } else {
        handleLogout(); // Auto logout if the token is expired
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('devblogUser');
    loginService.logout();
  };

  return (
    <div className="relative container mx-auto mt-10 flex flex-col items-center justify-center space-y-10">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>
      {user !== null && (
        <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center space-x-4">
          <p className="text-sm font-medium">
            Logged-in: {user.name || user.username}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Log out
          </button>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        {user === null ? (
          <div>
            <p className="text-xl font-medium my-5">
              Login to your account to add and view blogs
            </p>
            <Togglable buttonLabel="Login">
              <Auth setUser={setUser} />
            </Togglable>
          </div>
        ) : (
          <Togglable buttonLabel="Add New Blog" ref={blogFormRef}>
            <AddBlog setBlogs={setBlogs} blogFormRef={blogFormRef} />
          </Togglable>
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} setBlogs={setBlogs} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
