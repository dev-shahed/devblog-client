import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import AddBlog from '../src/components/AddBlog';
import Blog from '../src/components/Blog';
import Notification from '../src/components/Notification';
import Togglable from '../src/components/Togglable';
import blogService from '../src/services/blogs';

test('renders content', () => {
  const blog = {
    title: 'A sample blog post for test',
    author: 'Jhon Doe',
    url: 'http://localhost:5173/',
    likes: 34,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText('A sample blog post for test');
  expect(element).toBeDefined();
});

test('clicking the toggle button shows and hides blog details such as url and likes', async () => {
  const blog = {
    title: 'A sample blog post for test',
    author: 'Jhon Doe',
    url: 'https://localhost:5173/',
    likes: 34,
    user: {
      username: 'testuser',
    },
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText('Show');
  await user.click(button);
  expect(screen.getByText('Hide')).toBeInTheDocument();

  const url = screen.getByText('Read more');
  expect(url).toBeInTheDocument();
  const likes = screen.getByText(blog.likes);
  expect(likes).toBeInTheDocument();

  await user.click(button);
  expect(screen.getByText('Show')).toBeInTheDocument();
});

describe('<Togglable/> component', () => {
  let container;

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel={'Add New Blog'}>
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container;
  });

  test('renders its children', async () => {
    const content = screen.getByText('togglable content');
    expect(content).toBeInTheDocument();
    expect(content.parentElement).toHaveClass('hidden');
  });

  test('at start the children are not displayed', () => {
    const hiddenDiv = container.querySelector('.togglableContent .hidden');
    expect(hiddenDiv).toBeDefined();
  });

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup();
    const addBtn = screen.getByText('Add New Blog');

    // First click to show the content
    await user.click(addBtn);
    const cancelBtn = screen.getByText('Cancel');
    expect(screen.getByText('togglable content')).toBeInTheDocument();
    expect(screen.getByText('togglable content').parentElement).not.toHaveClass(
      'hidden'
    );

    // Clicking cancel to hide the content again
    await user.click(cancelBtn);
    expect(screen.getByText('togglable content').parentElement).toHaveClass(
      'hidden'
    );
  });
});

// Form submission or add a new blog test..

vi.mock('../src/components/Notification.jsx');
vi.mock('../src/services/blogs.js');

describe('<AddBlog/> form component', () => {
  let setBlogs;
  let blogFormRef;

  beforeEach(() => {
    setBlogs = vi.fn();
    blogFormRef = { current: { toggleVisibility: vi.fn() } };
  });

  test('render the form with the correct input element and button', async () => {
    render(<AddBlog setBlogs={setBlogs} blogFormRef={blogFormRef} />);

    // Check if inputs and button are rendered
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Author')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('URL')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Blog' })
    ).toBeInTheDocument();
  });

  test('updates input values on change', async () => {
    render(<AddBlog setBlogs={setBlogs} blogFormRef={blogFormRef} />);

    const titleInput = screen.getByPlaceholderText('Title');
    const authorInput = screen.getByPlaceholderText('Author');
    const urlInput = screen.getByPlaceholderText('URL');

    await userEvent.type(titleInput, 'Learning React Testing');
    await userEvent.type(authorInput, 'Test Author');
    await userEvent.type(urlInput, 'https://testing.com');
  });

  test('submits the form successfully and calls the necessary handlers', async () => {
    blogService.saveBlog.mockResolvedValue({
      status: 201,
      data: {
        title: 'Learning React Testing',
        author: 'Test Author',
        url: 'https://testing.com',
      },
    });

    render(<AddBlog setBlogs={setBlogs} blogFormRef={blogFormRef} />);

    const titleInput = screen.getByPlaceholderText('Title');
    const authorInput = screen.getByPlaceholderText('Author');
    const urlInput = screen.getByPlaceholderText('URL');
    const submitBtn = screen.getByRole('button', { name: 'Add Blog' });

    await userEvent.type(titleInput, 'Learning React Testing');
    await userEvent.type(authorInput, 'Test Author');
    await userEvent.type(urlInput, 'https://testing.com');

    await userEvent.click(submitBtn);

    expect(blogService.saveBlog).toHaveBeenCalledWith({
      title: 'Learning React Testing',
      author: 'Test Author',
      url: 'https://testing.com',
    });

    // Check if setBlogs and toggleVisibility are called
    expect(setBlogs).toHaveBeenCalledTimes(1);
    expect(blogFormRef.current.toggleVisibility).toHaveBeenCalled();
    expect(Notification.success).toHaveBeenCalledWith(
      'Blog created successfully'
    );
  });

  test('handles form submission failure and shows error notification', async () => {
    blogService.saveBlog.mockRejectedValue({
      response: { data: { error: 'Failed to create blog' } },
    });

    render(<AddBlog setBlogs={setBlogs} blogFormRef={blogFormRef} />);

    const submitBtn = screen.getByRole('button', { name: 'Add Blog' });
    await userEvent.click(submitBtn);
    expect(Notification.error).toHaveBeenCalledWith('Failed to create blog');
  });
});
