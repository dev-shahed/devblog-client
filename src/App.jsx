import { useEffect, useRef, useState } from 'react';
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
  const blogFormRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const fetchedBlogs = await blogService.getBlogs();
        const sortedBlogs = fetchedBlogs.sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchBlogs();
  }, [user]);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('devblogUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (loginService.isTokenValid(parsedUser.token)) {
        setUser(parsedUser);
        loginService.setToken(parsedUser.token);
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('devblogUser');
    loginService.logout();
  };

  return (
    <div className="relative container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Blogs</h1>

      {user && (
        <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center">
          <p className="text-sm">Logged-in: {user.name}</p>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 px-2 py-1 rounded-md"
          >
            Log out
          </button>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        {!user ? (
          <Auth setUser={setUser} />
        ) : (
          <Togglable buttonLabel="Add New Blog" ref={blogFormRef}>
            <AddBlog setBlogs={setBlogs} blogFormRef={blogFormRef} />
          </Togglable>
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} setBlogs={setBlogs} />
          ))
        ) : (
          <p className="text-center">No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
