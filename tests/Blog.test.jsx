import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test } from 'vitest';
import Blog from '../src/components/Blog';
import Togglable from '../src/components/Togglable';

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

test('clicking the toggle button shows and hides blog details', async () => {
  const blog = {
    title: 'A sample blog post for test',
    author: 'Jhon Doe',
    url: 'http://localhost:5173/',
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

  const author = screen.getByText(blog.author);
  expect(author).toBeInTheDocument();

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
