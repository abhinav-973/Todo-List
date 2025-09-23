import { useState, useEffect } from "react";
import Header from "./components/Header";
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDeleteForever } from "react-icons/md";
import DeadLinePicker from "./components/DeadLinePicker";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);
  const [deadline, setDeadline] = useState(null);

  const addTask = () => {
    if (todo.trim() === "" || !deadline) return;

    const newTask = {
      text: todo,
      completed: false,
      deadline: deadline,
    };

    setTodos([...todos, newTask]);
    setTodo("");
    setDeadline(null);
  };

  const confirmDeleteAll = () => {
    setTodos([]);
    saveToLS([]);
    setDeleteAll(false);
  };

  const cancelDeleteAll = () => {
    setDeleteAll(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteTaskId(id); // show popup for this task
  };

  const confirmDelete = () => {
    const newTodos = todos.filter((item) => item.id !== deleteTaskId);
    setTodos(newTodos);
    saveToLS(newTodos);
    setDeleteTaskId(null); // close popup
  };

  const cancelDelete = () => {
    setDeleteTaskId(null); // close popup
  };

  const toggleShowFinished = () => {
    setShowFinished(!showFinished);
  };

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos);
    }
  }, []);

  const saveToLS = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const handleEdit = (e, id) => {
    const editTodo = todos.find((item) => item.id === id);
    setTodo(editTodo.todo);

    setTodos((prevTodos) => {
      const newTodos = prevTodos.filter((item) => item.id !== id);
      saveToLS(newTodos);
      return newTodos;
    });
  };

  const handleDelete = (e, id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      let newTodos = todos.filter((item) => item.id !== id);
      setTodos(newTodos);
      saveToLS(newTodos);
    } else {
      console.log("Delete cancelled");
    }
  };

  const handleAdd = () => {
    if (!todo.trim()) return;

    setTodos((prevTodos) => {
      const newTodos = [
        ...prevTodos,
        { id: Date.now(), todo, isCompleted: false },
      ];
      saveToLS(newTodos);
      return newTodos;
    });

    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckBox = (e) => {
    const id = Number(e.target.name);
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      );
      saveToLS(newTodos);
      return newTodos;
    });
  };

  return (
    <>
      <Header />
      <div
        className="container mx-auto my-8 p-6 w-[95vw] sm:w-[90vw] md:w-[70vw] lg:w-[50vw] 
                bg-white shadow-lg rounded-2xl min-h-[80vh] border border-gray-200 relative"
      >
        <div className="header text-center mb-6">
          <h1 className="font-extrabold text-2xl md:text-3xl text-slate-800">
            iTask
          </h1>
          <p className="text-gray-500">Your Productivity Companion</p>
        </div>

        <div className="addTodo">
          <h2 className="text-md font-bold">Add Tasks</h2>
          <div className="flex flex-col sm:flex-row gap-3 my-3">
            <input
              type="text"
              value={todo}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd(); // 👈 call the same function as Save button
                }
              }}
            />
            {/* Deadline Picker */}
            {/* <DeadLinePicker onDeadlineSet={setDeadline} /> */}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg 
               font-medium shadow active:scale-95 transition"
              onClick={handleAdd}
            >
              Save
            </button>
          </div>
        </div>

        <div className="showFinished my-3 flex items-center gap-3">
          <input
            type="checkbox"
            id="showFinished"
            checked={showFinished}
            onChange={toggleShowFinished}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <label
            htmlFor="showFinished"
            className="text-gray-700 font-medium cursor-pointer select-none"
          >
            Show Finished Tasks
          </label>
        </div>

        <h2 className="text-md font-bold">Your Tasks</h2>
        {todos.length === 0 && (
          <div className="m-5 font-semibold font-sans">No tasks today 🎉</div>
        )}
        <div className="todos flex flex-col md:max-w-96">
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div
                  key={item.id}
                  className="todo flex items-center justify-between bg-gray-100 
             px-4 py-2 rounded-lg shadow-sm hover:shadow-md 
             transition duration-200 m-[5px]"
                >
                  {/* Left Side: checkbox + text */}
                  <div className="flex items-center gap-3">
                    <input
                      name={item.id}
                      type="checkbox"
                      checked={item.isCompleted} // ✅ fix: should use item.isCompleted, not todo.isCompleted
                      onChange={handleCheckBox} // ✅ better than onClick for checkbox
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                    />
                    <span
                      className={`text-base ${
                        item.isCompleted
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {item.todo}
                    </span>
                  </div>

                  {/* Right Side: action buttons */}
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                      onClick={(e) => handleEdit(e, item.id)}
                    >
                      <MdModeEditOutline size={20} />
                    </button>
                    <button
                      className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      <MdOutlineDeleteForever size={20} />
                    </button>
                  </div>
                </div>
              )
            );
          })}
          {deleteTaskId && (
            <div className="fixed inset-0 flex items-center justify-center">
              {/* Overlay with blur */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

              {/* Modal content */}
              <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 text-center z-10">
                <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this task?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {deleteAll && todos.length != 0 && (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50"></div>

              <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 text-center z-50">
                <h2 className="text-lg font-semibold mb-4">
                  Confirm Delete All
                </h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <strong>all tasks</strong>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmDeleteAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Yes, Delete All
                  </button>
                  <button
                    onClick={cancelDeleteAll}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {!deleteAll && !deleteTaskId && (
            <>
              <p className="inline-block bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-xl absolute bottom-[15px] left-10">
                {todos.filter((t) => !t.isCompleted).length} tasks left
              </p>

              {todos.length !== 0 && (
                <div className="deleteAll absolute bottom-4 right-10">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition ml-2"
                    onClick={() => setDeleteAll(true)}
                  >
                    Delete All
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
