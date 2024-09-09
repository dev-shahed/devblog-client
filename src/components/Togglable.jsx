import { forwardRef, useImperativeHandle, useState } from 'react';

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  // Toggles the visibility state
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // Exposes the toggleVisibility function to parent components via ref
  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }));

  return (
    <div className="my-4">
      {/* This section is shown when the content is hidden */}
      <div className={visible ? 'hidden' : ''}>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={toggleVisibility}
        >
          {buttonLabel}
        </button>
      </div>

      {/* This section is shown when the content is visible */}
      <div className={visible ? '' : 'hidden'}>
        <div className="p-4 bg-gray-100 rounded shadow-md">{children}</div>
        <button
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={toggleVisibility}
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

// Setting the display name for debugging purposes
Togglable.displayName = 'Togglable';


export default Togglable;
